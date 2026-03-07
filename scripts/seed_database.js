const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

// Inisialisasi Google Generative AI (Gemini)
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);

// Inisialisasi Supabase menggunakan Service Role Key agar bisa menembus pembatasan RLS saat Insert
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Lokasi folder yang berisi file-file Markdown sumber pengetahuan
const KNOWLEDGE_BASE_DIR = path.join(__dirname, '../docs/knowledge_base');

async function processFile(filePath, fileName) {
  console.log(`\n⏳ Memproses file: ${fileName}`);
  
  // Membaca isi teks markdown
  const markdownContent = fs.readFileSync(filePath, 'utf-8');
  
  // Melakukan 'Chunking' sederhana (Membagi teks berdasarkan spasi antar-paragraf)
  // Ekspresi reguler /\n\n+/ memastikan pemisahan terjadi bila ada dua Enter (Baris Kosong) atau lebih
  const chunks = markdownContent
    .split(/\n\n+/)
    .map(chunk => chunk.trim())
    .filter(chunk => chunk.length > 50); // Filter out chunk yang terlalu pendek (contoh: sekadar judul)

  console.log(`   - Ditemukan ${chunks.length} potongan (chunks) paragraf yang valid.`);

  // Kita gunakan model embedding Gemini
  const model = genAI.getGenerativeModel({ model: 'gemini-embedding-001' });

  for (let i = 0; i < chunks.length; i++) {
    const chunkText = chunks[i];

    try {
      console.log(`   - Meng-generate embedding (vektor 3072) untuk chunk ${i + 1}/${chunks.length}...`);
      
      const result = await model.embedContent(chunkText);
      const embeddingArray = result.embedding.values;
      
      console.log(`   - Insert chunk ${i + 1} berserta vektornya ke Supabase...`);
      const { error } = await supabase
        .from('documents')
        .insert({
          content: chunkText,
          metadata: {
             source: fileName,
             chunk_index: i
          },
          embedding: embeddingArray
        });

      if (error) {
        console.error(`❌ Gagal insert pada baris ${i + 1} file ${fileName}:`, error.message);
      } else {
        console.log(`✅ Chunk ${i + 1} sukses dimasukkan ke database.`);
      }

      // Beri jeda/delay singkat setiap iterasi loop (opsional), 
      // guna menghindari limit API (Rate Limiting) dari Google atau Supabase jika chunks sangat banyak
      await new Promise(resolve => setTimeout(resolve, 500)); 

    } catch (err) {
      console.error(`❌ Terjadi error pada proses AI embedding chunk ${i + 1}:`, err);
    }
  }
  console.log(`✅ Selesai memproses file: ${fileName}`);
}

async function main() {
  console.log('🚀 Memulai Script Sinkronisasi Data Knowledge Base PukPuk...\n');

  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY || !process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
     console.error('❌ ERROR: Environment variabel belum lengkap. Pastikan file .env.local telah diatur dengan konfigurasi Gemini dan Supabase Anda.');
     return;
  }

  try {
    const files = fs.readdirSync(KNOWLEDGE_BASE_DIR);
    const mdFiles = files.filter(file => file.endsWith('.md'));

    if (mdFiles.length === 0) {
      console.log('⚠️ Tidak ditemukan file statis .md di dalam direktori knowledge_base/');
      return;
    }

    console.log(`Ditemukan total ${mdFiles.length} file markdown.`);

    for (const file of mdFiles) {
      const fullPath = path.join(KNOWLEDGE_BASE_DIR, file);
      await processFile(fullPath, file);
    }

    console.log('\n🎉 SEMUA FILE TERPROSES! Database siap digunakan untuk chatbot PukPuk.');

  } catch (error) {
    console.error('❌ Terjadi kesalahan utama:', error);
  }
}

// Eksekusi fungsi pelari
main();
