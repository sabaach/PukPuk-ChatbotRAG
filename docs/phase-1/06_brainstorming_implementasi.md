# Brainstorming Implementasi Teknis PukPuk

Dokumen ini membedah arsitektur teknis dan rancangan data untuk purwarupa PukPuk. Teknologi utama bergantung pada ekosistem Next.js, Supabase (pgvector), dan Google Generative AI (Gemini).

---

## 1. Arsitektur Database (Supabase & pgvector)
Penyimpanan *knowledge base* (pengetahuan Stoikisme) dilakukan dengan pendekatan *Vector Database* menggunakan *extension* `pgvector` pada PostgreSQL bawaan Supabase. Model Gemini `gemini-embedding-001` menghasilkan vektor berdimensi spesifik: **3072**.

### Skema SQL yang Diperlukan
Berikut adalah *script* SQL untuk mengeksekusi inisialisasi tabel di Supabase:

```sql
-- 1. Mengaktifkan ekstensi vector jika belum ada
create extension if not exists vector;

-- 2. Membuat tabel khusus untuk menyimpan dokumen dan embeddingnya
create table documents (
  id bigint primary key generated always as identity,
  content text not null,       -- Potongan paragraf atau teks md asli
  metadata jsonb,              -- Informasi ekstra (misalnya: judul file, url, dsb.)
  embedding vector(3072)       -- Tipe vector dengan panjang 3072 dimensi (khusus Gemini)
);

-- 3. Membuat fungsi untuk mencocokkan kemiripan dokumen (Similarity Search)
create or replace function match_documents (
  query_embedding vector(3072),
  match_count int default 5
) returns table (
  id bigint,
  content text,
  metadata jsonb,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    documents.id,
    documents.content,
    documents.metadata,
    1 - (documents.embedding <=> query_embedding) as similarity -- Cosine distance
  from documents
  order by documents.embedding <=> query_embedding
  limit match_count;
end;
$$;
```

---

## 2. Ingestion Pipeline (Proses Data Ingestion)
Sebelum *chatbot* bisa menjawab curhatan pengguna, referensi yang berbentuk *Markdown* lokal (di dalam folder `knowledge_base/`) perlu diolah, "dicacah/dipotong", dan dimasukkan (di-insert) ke dalam Supabase. Proses ini akan dieksekusi secara terpisah (*one-off script*) menggunakan skrip Node.js (misalnya `scripts/ingest-data.js`).

### Alur Kerja Skrip Data Ingestion:
1. **Membaca Folder**: Skrip memindai *(scan)* semua file berekstensi `.md` yang ada di dalam *directory* proyek (misal: `./docs/knowledge_base/`).
2. **Chunking (Pemotongan Teks)**: Menggunakan algoritma pemotongan karakter (misalnya memisahkan berdasarkan baris kosong `\n\n` atau *heading* Markdown) agar teks terbagi secara semantik per paragraf.
3. **Membuat Embeddings**: Setiap potongan teks (*chunk*) dikirimkan ke Endpoint Google Generative AI menggunakan pustaka `@google/generative-ai` dengan spesifikasi model `model="gemini-embedding-001"`. API akan mengembalikan *array of numbers* (vektor 3072 dimensi).
4. **Insert ke Database**: Skrip akan mengambil nilai teks, metadata (nama file), dan vektor tersebut lalu melakukan instruksi `INSERT INTO documents` ke proyek Supabase dengan *service key*.
5. **Environment Variables Yang Diperlukan**: Skrip backend ini wajib dijalankan dengan variabel rahasia *environment* di tingkat OS atau file `.env`:
   * `SUPABASE_URL`: Endpoint unik database Supabase.
   * `SUPABASE_SERVICE_ROLE_KEY`: Kunci akses level dewa (hanya untuk *backend*) agar memiliki izin mem-Bypass kebijakan RLS (*Row Level Security*).
   * `GOOGLE_GENERATIVE_AI_API_KEY`: Kunci lisensi API dari Google AI Studio untuk men-generate *embeddings*.

---

## 3. Alur Logika RAG & Bot Percakapan (Next.js Endpoint)
Di bagian *frontend* atau *backend end-point* dari dalam App Router Next.js (misal pada sebuah API route `app/api/chat/route.ts`), inilah alur logika yang akan dieksekusi begitu obrolan (*curhatan*) dari *user* masuk:

### Langkah Operasional (*Execution Flow*):
1. **User Mengirim Chat**: PukPuk menerima HTTP POST *request* yang berisi JSON kalimat curhatan dari pengguna (misal: *"Gue capek direvisi"*).
2. **Pencarian Konteks Berbasis Vektor (The 'Retrieval')**:
   * API Route memanggil pustaka `@google/generative-ai` memanfaatkana model `gemini-embedding-001` untuk mengubah "*Gue capek direvisi*" menjadi deretan angka dimensi 3072 (Representasi Vektor/Query).
   * Vektor ini kemudian dikirim/dioper melalui API Supabase Client menuju *function* eksekusi RPC SQL bernama `match_documents`. Supabase akan mengembalikan deretan referensi dokumen Stoikisme yang paling erat maknanya.
3. **Penyusunan Prompt Terpadu (The 'Augmented')**:
   * Sistem merangkai sebuah pesan *prompt* masif. Mulai dari arahan tingkat sistem (System Prompt): *"Kamu adalah PukPuk, kapibara anak jaksel yang santai..."*
   * Diikuti oleh Konteks: Hasil dokumen yang dikembalikan oleh Supabase digabung ke dalam teks secara *raw*.
   * Diikuti oleh *input message* terakhir dari pengguna.
4. **Respon Dari Agen AI (The 'Generation')**:
   * Prompt mahabesar terebut dikirim ke target model LLM yang diwajibkan: **`model="gemini-1.5-flash"`**. (Gemini Flash dipilih karena *latency* sangat efisien bagi aplikasi percakapan instan).
   * Respons dari kapibara mulai dibuat *(generated)*, dan sebaiknya disalurkan kembali dalam bentuk `TextStream` (merender kata per kata pada frontend *Next.js Client Component*) menggunakan antarmuka *UI Auto-Scroll* yang sudah dirancang sebelumnya.
