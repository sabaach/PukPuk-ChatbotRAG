import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';

// Inisialisasi Supabase Client (bisa pakai anon key, tapi karena ini server-side aman pakai Service Role)
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Inisialisasi Google Gen AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);

// System Prompt Penuh Karakter Kapibara
const PUKPUK_SYSTEM_PROMPT = `
Kamu adalah PukPuk, seekor Kapibara yang mendalami Stoikisme.
Kamu adalah sahabat dan tempat curhat bagi para pekerja kantoran (corporate workers) yang sedang lelah, stres, burnout, atau penuh drama kantor.
Gaya bahasamu sangat santai, punya empati tinggi, lucu, dan sangat menenangkan.
Kamu sering menggunakan gaya bahasa anak Jaksel atau corporate slang (seperti 'literally', 'which is', 'burnout', 'overwhelmed', 'make sense', 'ngab', 'bre', 'jujurly', dll) agar terasa relatable dan tidak kaku.
Tugas utamamu adalah mendengarkan curhatan mereka, lalu memberikan nasihat berdasarkan prinsip Stoikisme (Filosofi Teras).
Inti nasihatmu selalu: "Fokus pada apa yang bisa kamu kontrol, dan lepaskan apa yang di luar kendalimu."
Berikan jawaban yang ringkas, hangat, seperti ngobrol dengan teman tongkrongan. Jangan merespons seperti robot AI atau ChatGPT kaku.

Berikut adalah beberapa referensi pengetahuan Stoikisme yang relevan dengan keluhan User saat ini. Gunakan prinsip di dalam referensi ini untuk meracik nasihatmu:

`;

export async function POST(req) {
    try {
        const { message } = await req.json();

        if (!message) {
            return NextResponse.json(
                { error: 'Pesan tidak boleh kosong.' },
                { status: 400 }
            );
        }

        // 1. Ubah pesan user menjadi vektor (Embedding)
        const embeddingModel = genAI.getGenerativeModel({ model: 'gemini-embedding-001' });
        const embeddingResult = await embeddingModel.embedContent(message);
        const userEmbedding = embeddingResult.embedding.values;

        // 2. Cari dokumen paling relevan (RAG) di Supabase pgvector
        const { data: matchedDocuments, error: matchError } = await supabase.rpc(
            'match_documents',
            {
                query_embedding: userEmbedding,
                match_threshold: 0.7, // opsional: minimal kemiripan (bisa diatur)
                match_count: 5 // ambil 5 potongan terbaik
            }
        );

        if (matchError) {
            console.error('Error fetching from Supabase:', matchError);
            throw new Error('Gagal menarik konteks dari database.');
        }

        // 3. Rangkai konteks dari dokumen yang ditarik
        let contextText = '';
        if (matchedDocuments && matchedDocuments.length > 0) {
            contextText = matchedDocuments
                .map((doc, idx) => `[Referensi ${idx + 1}]: ${doc.content}`)
                .join('\n\n');
        } else {
            contextText = "Tidak ditemukan referensi spesifik, gunakan pengetahuan Stoikisme umummu.";
        }

        // 4. Susun prompt lengkap untuk Generative LLM
        const finalPrompt = `
${PUKPUK_SYSTEM_PROMPT}

<KONTEKS REFERENSI>
${contextText}
</KONTEKS REFERENSI>

Curhatan / Pesan User: "${message}"

Berikan balasanmu sebagai PukPuk (ingat persona kapibara jaksel stoik):
`;

        // 5. Generate jawaban dengan model gemini-1.5-flash
        const chatModel = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        const result = await chatModel.generateContent(finalPrompt);
        const pukpukResponse = result.response.text();

        // 6. Kembalikan respons ke frontend
        return NextResponse.json({
            role: 'bot',
            content: pukpukResponse,
            // Opsional (debug): mengirimkan sumber referensi kembali jika ingin ditampilkan di UI kelak
            sources: matchedDocuments?.map(doc => doc.metadata.source) || []
        });

    } catch (error) {
        console.error('API Chat Error:', error);
        return NextResponse.json(
            { error: 'Waduh, PukPuk lagi pusing server error nih bre. Coba lagi bentar ya.' },
            { status: 500 }
        );
    }
}
