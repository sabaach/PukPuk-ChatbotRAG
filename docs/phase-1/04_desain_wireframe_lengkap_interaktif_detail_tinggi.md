# Spesifikasi Desain Wireframe High-Fidelity & Interaktif PukPuk

Dokumen ini menjabarkan spesifikasi antarmuka *High-Fidelity* dari PukPuk, di mana elemen UI diterjemahkan menjadi deskripsi kode konkret menggunakan pendekatan *utility classes* Tailwind CSS.

## 1. Struktur Layout Utama (Root Container)
Aplikasi PukPuk dirancang menempati satu layar penuh tanpa *scroll bar* pada tingkat `body` (pendekatan *Single-Page Application* dengan *layout fixed*). Area yang bisa di-*scroll* hanya bagian daftar percakapan (*chat list*).

```jsx
// Wrapper terluar
<div className="flex flex-col h-screen w-full bg-[#f4ece1] sm:max-w-md sm:mx-auto shadow-xl relative">
  {/* Konten akan dibagi menjadi 3: Header, Chat Area, dan Input Area */}
</div>
```
*Catatan: `bg-[#f4ece1]` merepresentasikan warna krem/sage terang yang memberikan nuansa kalem/chill. Aplikasi dibuat menyerupai tampilan mobile (`sm:max-w-md sm:mx-auto`) untuk memastikan proporsi chat tetap nyaman dibaca.*

## 2. Header (Top Navigation Bar)
Bagian atas bersifat tetap (*sticky* atau *fixed* dalam struktur flexbox).

```jsx
<header className="flex-none flex items-center justify-between px-4 py-3 bg-[#e8decf] border-b border-[#d8c8b6] z-10 shadow-sm">
  <div className="flex items-center gap-3">
    <div className="w-10 h-10 rounded-full bg-[#8c7b68] flex items-center justify-center text-xl shadow-inner">
      🦫
    </div>
    <div>
      <h1 className="text-gray-800 font-bold text-lg leading-tight">PukPuk</h1>
      <p className="text-[#8c7b68] text-xs font-medium">Sahabat Kewarasan Corporate Loe</p>
    </div>
  </div>
</header>
```

## 3. Chat Area (Scrollable Message List)
Area ini menjadi porsi terbesar di layar, menggunakan `flex-1` agar mengisi sisa ruang secara dinamis dan `overflow-y-auto` untuk mengaktifkan *scroll* vertikal.

```jsx
<main className="flex-1 overflow-y-auto p-4 space-y-4 pb-6 scroll-smooth" id="chat-container">
  
  {/* Chat Bubble: User (Di sebelah kanan) */}
  <div className="flex justify-end">
    <div className="bg-[#4a5f50] text-[#f4ece1] max-w-[80%] rounded-2xl rounded-tr-sm px-4 py-3 shadow-md text-sm sm:text-base leading-relaxed">
      Puk, gue capek banget hari ini. Revisi mulu dari bos.
    </div>
  </div>

  {/* Chat Bubble: Bot / PukPuk (Di sebelah kiri) */}
  <div className="flex justify-start">
    <div className="bg-white text-gray-800 max-w-[85%] rounded-2xl rounded-tl-sm px-4 py-3 shadow-md border border-[#e8decf] text-sm sm:text-base leading-relaxed">
      Halo ngab. Tarik napas dulu. Inget kata om Marcus...
    </div>
  </div>

</main>
```

## 4. Indikator "PukPuk Sedang Mengetik..." (Typing Animation)
Ketika AI sedang memproses jawaban, muncul sebuah indikator animasi sederhana sebelum teks final dimunculkan. Ini krusial agar pengguna tidak mengira aplikasi *hang* / *freeze*.

```jsx
{/* Indikator Animasi Mengetik */}
<div className="flex justify-start items-end gap-2 text-[#8c7b68] text-xs mx-2">
  <span className="animate-pulse">PukPuk lagi mikir</span>
  <div className="flex gap-1 mb-[2px]">
    <div className="w-1.5 h-1.5 rounded-full bg-[#8c7b68] animate-bounce" style={{ animationDelay: '0ms' }}></div>
    <div className="w-1.5 h-1.5 rounded-full bg-[#8c7b68] animate-bounce" style={{ animationDelay: '150ms' }}></div>
    <div className="w-1.5 h-1.5 rounded-full bg-[#8c7b68] animate-bounce" style={{ animationDelay: '300ms' }}></div>
  </div>
</div>
```
* **Mekanisme Rendering:** Indikator ini memanfaatkan kelas animasi `animate-bounce` bawaan Tailwind. Penggunaan *inline-style* `animationDelay` memberikan efek ritmis atau bergelombang pada ketiga titik (*dots*), menyimulasikan ilusi mengetik di *keyboard*.

## 5. Input Area (Bottom Text Box)
Bagian bawah yang berfungsi ganda sebagai *form input* dan tempat tombol kirim diletakkan secara absolut (melekat di bagian bawah wadah *chat*).

```jsx
<footer className="flex-none p-4 bg-[#f4ece1] border-t border-[#d8c8b6]">
  <form className="flex items-end gap-2 relative">
    <textarea 
      className="flex-1 max-h-32 min-h-[44px] bg-white border border-[#d8c8b6] rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8c7b68] focus:border-transparent resize-none overflow-hidden shadow-inner text-gray-800 placeholder:text-[#b5a796]"
      placeholder="Ketik curhatan lo di sini, no judgment..."
      rows={1}
    />
    <button 
      type="submit"
      className="flex-none h-11 w-11 rounded-full bg-[#4a5f50] flex items-center justify-center text-white hover:bg-[#3d4f42] transition-colors shadow-md flex-shrink-0"
    >
      {/* Icon Send (contoh SVG panah ke atas) */}
      <svg className="w-5 h-5 translate-x-[2px] -translate-y-[1px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19V5m-7 7l7-7 7 7" />
      </svg>
    </button>
  </form>
</footer>
```

---

## Mekanisme Interaksi & Auto-Scroll

Agar pengalaman percakapan terasa natural, sistem harus terus-menerus memposisikan mata pengguna (*scroll position*) ke pesan terbaru yang masuk.

**Cara Kerja Auto-Scroll di React/Next.js:**
1. Di dalam wadah utama `<main id="chat-container">`, kita biasanya menempatkan sebuah div kosong atau *dummy element* tepat di akhir daftar obrolan: `div ref={messagesEndRef} />`.
2. Saat *state* pesan berubah (pesan baru masuk dari pengguna, atau "Typing Indicator" muncul dari bot), aplikasi akan memicu efek samping (via `useEffect`).
3. Efek tersebut memanggil `messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })`.
4. Berkat kelas `scroll-smooth` pada *container* `<main>`, transisi pergerakan geser akan terasa mulus (tidak *jumping* seketika secara kasar).
5. Pada integrasi RAG LLM (seperti *streaming text* Gemini), proses `.scrollIntoView()` ini bahkan bisa dibuat reaktif agar terus mendorong ke bawah saat teks AI panjang *ter-generate* kata per kata.
