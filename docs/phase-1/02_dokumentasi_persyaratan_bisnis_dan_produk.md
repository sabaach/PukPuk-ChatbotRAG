# Dokumentasi Persyaratan Bisnis & Produk (PRD) - PukPuk

## 1. Definisi Scope MVP (Minimum Viable Product)
Berdasarkan latar belakang masalah (kebutuhan pekerja kantoran akan ruang curhat yang *chill*), pengembangan PukPuk tahap awal (MVP) difokuskan pada *scope* yang ramping dan efektif:

* **Frontend Murni Chat UI**: Antarmuka pengguna (UI) secara eksklusif hanya menampilkan layar percakapan (*chat interface*). **Tidak ada fitur *upload file*** atau unggah dokumen dari sisi pengguna demi menjaga kesederhanaan *user experience* dan meminimalisir kompleksitas teknis di tahap awal.
* **Knowledge Base Statis (Lokal)**: Sistem RAG akan mengambil referensi dan pengetahuan Stoikisme secara statis dari kumpulan file `.md` (*markdown*) yang tersimpan secara lokal di dalam *folder* proyek. Tidak ada *scraping* langsung ke internet atau integrasi CMS dinamis.
* **Tech Stack Utama**: 
  * **Frontend & Backend Framework**: **Next.js** (mengadopsi arsitektur **App Router**) untuk pengalaman *full-stack* yang *seamless*.
  * **Database & Vector Store**: **Supabase**, secara spesifik memanfaatkan ekstensi **pgvector** untuk menyimpan dan melakukan pencarian *embeddings* (vektor) dari dokumen *knowledge base*.
  * **LLM Engine**: **Google Generative AI** (Model Gemini) untuk memproses *prompt* dan melakukan sintesis jawaban (menuliskan *output* akhir berdasarkan konteks dokumen dan persona Kapibara anak Jaksel).

## 2. User Flow Sederhana
Interaksi pengguna (karyawan/pegawai) dengan PukPuk dirancang agar langsung ke pokok permasalahan (*frictionless*):

1. **Buka Aplikasi (Welcome Screen)**: 
   Pengguna mengakses halaman utama proyek PukPuk. Mereka akan langsung dihadapkan pada antarmuka *chat box* (*Chat UI*) tanpa perlu registrasi yang berbelit-belit. Terdapat sapaan pembuka selamat datang dari PukPuk.
2. **Pengguna Menuliskan Curhatan (*Venting*)**: 
   Pengguna mengetik keluh kesah atau masalah kerjaan mereka di dalam *input text* (contoh: *"Puk, gue capek banget nih, direvisi bos mulu padahal udah sesuai brief awal, which is annoying banget!"*).
3. **Pemrosesan di Layar Belakang (Sistem RAG)**: 
   * Pertanyaan/curhatan pengguna diubah menjadi *embeddings*.
   * Sistem PukPuk melakukan *similarity search* ke Supabase (pgvector) untuk mencari cuplikan teks filosofi Stoikisme yang paling relevan dengan masalah "revisi bos" dari kumpulan file `.md`.
   * Konteks dari dokumen tersebut digabungkan bersama curhatan pengguna dan di-*feed* ke dalam Google Generative AI dengan instruksi persona (Kapibara Stoik, gaya bahasa *corporate* Jaksel).
4. **PukPuk Memberikan Respons (Puk-Puk Virtual)**: 
   PukPuk membalas teks pengguna di layar obrolan. Balasan berupa nasihat/perspektif Stoikisme tentang apa yang bisa dikontrol (respons sendiri) dan tidak (revisi bos), namun dibawakan dengan selipan *jokes corporate* yang *relatable* dan menenangkan.
5. **Percakapan Berlanjut / Selesai**: 
   Pengguna dapat melanjutkan obrolan (tanya jawab) jika merasa kurang puas, atau menutup aplikasi setelah merasa *mindset*-nya kembali jernih dan lebih *chill*.
