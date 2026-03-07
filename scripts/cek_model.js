require('dotenv').config({ path: '.env.local' });

async function cekModelChat() {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        // Filter khusus untuk model yang bisa melakukan chat/generate text
        const chatModels = data.models.filter(m =>
            m.supportedGenerationMethods && m.supportedGenerationMethods.includes('generateContent')
        );

        console.log("=== MODEL CHAT YANG DIIZINKAN UNTUK API KEY INI ===");
        chatModels.forEach(m => {
            console.log(`- ${m.name} (Alias: ${m.displayName})`);
        });
    } catch (error) {
        console.error("Gagal mengecek model:", error);
    }
}

cekModelChat();