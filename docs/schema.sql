-- 1. Bersihkan lingkungan (Drop object jika sudah ada, optional tapi direkomendasikan untuk reset)
drop function if exists match_documents;
drop table if exists documents;

-- 2. Mengaktifkan ekstensi pgvector di PostgreSQL (Supabase)
create extension if not exists vector;

-- 3. Membuat tabel utama `documents`
create table documents (
  id bigint primary key generated always as identity,
  
  -- content menyimpan potongan teks asli (satu paragraf dari .md)
  content text not null, 
  
  -- metadata menyimpan informasi asal file dan konteks lainnya
  metadata jsonb,        
  
  -- embedding menyimpan representasi vektor teks yang dihasilkan oleh Gemini.
  -- PERHATIAN: dimensi wajib 3072 sesuai spesifikasi model 'gemini-embedding-001'
  embedding vector(3072) 
);

-- 4. Membuat fungsi RPC (Remote Procedure Call) untuk Similarity Search
-- Fungsi ini akan dipanggil oleh Next.js client menggunakan supabase.rpc('match_documents', ...)
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
    1 - (documents.embedding <=> query_embedding) as similarity -- <=> adalah operator Cosine Distance di pgvector
  from documents
  -- Kita ingin teks yang jaraknya paling kecil (paling mirip) berada di paling atas
  order by documents.embedding <=> query_embedding
  limit match_count;
end;
$$;
