# Sistem Desain, Tema, dan Warna (PukPuk)

## 1. Tema Utama: Calm & Stoic
Desain antarmuka PukPuk mengusung filosofi *Calm & Stoic*—bertujuan untuk menurunkan tingkat stres pengguna (*corporate workers*) begitu mereka membuka aplikasi. Tema ini bebas dari warna-warna mencolok atau elemen UI yang agresif dan berlebihan.

## 2. Palet Warna (Color Palette)
Berikut adalah kode HEX spesifik yang membentuk *brand identity* PukPuk, dapat diimplementasikan menggunakan kustomisasi *theme* pada `tailwind.config.ts`:

* **Background Utama (Beige/Krem)**: `#f4ece1`
  * Warna dasar untuk latar belakang aplikasi. Memberikan kesan hangat, netral, dan tidak menyilaukan mata (menyerupai *paper texture* atau rumah bernuansa *earth-tone*).
* **Header & Bot Bubble**: `#e8decf`
  * Digunakan untuk *background* Navigation Bar (atas) serta *chat bubble* balasan dari PukPuk (bot).
* **Secondary / Muted Border**: `#d8c8b6`
  * Digunakan pada garis tepi *input area*, *form textarea*, dan garis pembatas UI lainnya yang membutuhkan penegas visual sangat halus.
* **Aksen Kuat & Ikonografi PukPuk**: `#8c7b68`
  * Warna cokelat keabuan yang digunakan untuk *background* lingkaran logo Kapibara, *tagline* (sub-text), ikon "*Send*", dan indikator titik animasi *typing*.
* **Primary / User Bubble (Sage Green)**: `#4a5f50`
  * Hijau pudar yang membumi (*earthy*). Digunakan secara eksklusif untuk *bubble chat* milik pengguna (*User*). Memberikan kesan ketenangan dan *healing* (*nature*). *Hover state* untuk elemen interaktif hijau ini bisa memakai warna sedikit lebih gelap (contoh: `#3d4f42`).
* **Teks Utama (Dark Slate)**: `#1f2937` (Ekuivalen dengan Tailwind `gray-800`)
  * Warna abu-abu gelap untuk teks di *body* dan obrolan agar *readable* (mudah dibaca) dan *accessible*. Tidak menggunakan hitam murni (`#000000`) agar kontrasnya tidak terlalu tajam/melelahkan mata pekerja yang menatap layar berjam-jam.
* **Teks Hint & Placeholder**: `#b5a796`
  * Digunakan untuk teks *placeholder* di *text box* input ("Ketik curhatan lo di sini...").

## 3. Tipografi (Typography)
Sistem *font* berfokus pada keterbacaan tinggi di layar sempit (*mobile-first*), bersifat bersih, modern, dan memberikan *vibe* profesional namun tetap santai:

* **Font Family Utama**: **Inter** atau **Poppins** (dari Google Fonts).
  * *Rekomendasi Utama*: Menggunakan font sans-serif geometris seperti **Poppins** khusus untuk Logo/Header utama PukPuk agar terasa membulat, *playful*, dan bersahabat (*brand identity*).
  * *Rekomendasi Body Text*: Menggunakan **Inter** untuk konten *chat bubble* dan teks aplikasi. Inter sangat unggul dalam hal keterbacaan struktural (legibilitas) untuk paragraf panjang, menyeimbangkan kesan *corporate* dan *clean*.

## 4. Efek Membulat (Border-Radius & Shape)
Untuk mendukung kesan *friendly, safe space*, dan tidak kaku (bertolak belakang dengan *interface corporate tools* yang tajam), komponen UI banyak menggunakan sudut melengkung ekstrem dan *smooth*.

* **Chat Bubbles**: Menggunakan `rounded-2xl` (sekitar `1rem` atau `16px`). Sudut dimodifikasi secara spesifik untuk mengekor arah pesan: `rounded-tr-sm` untuk ekor pesan pengguna (kanan), dan `rounded-tl-sm` untuk ekor pesan PukPuk (kiri).
* **Input Box**: Menggunakan `rounded-2xl` agar senada dengan *feel* organik gelembung pesan.
* **Tombol Send & Ikon Header**: Menggunakan `rounded-full` (lingkaran sempurna) untuk mengekspresikan interaksi yang aman dan memanusiakan pengguna.

## 5. Shadow & Depth (Elevasi Visual)
*Drop shadows* dipertahankan sangat halus (*subtle*) murni untuk memisahkan hierarki informasi.
* **Global Container**: `shadow-xl` untuk memisahkan kotak aplikasi (lebar maks *mobile*) dari *background global* jika dibuka di perangkat dekstop.
* **Chat Bubbles**: `shadow-md` untuk ilusi kedalaman seolah *bubble* mengambang pelan di atas kanvas obrolan.
* **Header / Footer**: `shadow-sm` tipis ke arah dalam untuk memisahkan konten *scrollable* dengan area statis.
