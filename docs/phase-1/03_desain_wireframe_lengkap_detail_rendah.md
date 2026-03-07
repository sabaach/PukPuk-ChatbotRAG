# Desain Wireframe Low-Fidelity PukPuk

Berikut adalah representasi antarmuka web PukPuk (MVP) menggunakan Markdown ASCII art. Desain ini sangat minimalis dan difokuskan murni pada pengalaman obrolan (*chat experience*), tanpa ada elemen navigasi atau tombol *upload* yang tidak perlu.

```text
+-----------------------------------------------------------------+
|                                                                 |
|  [ 🦫 ] PukPuk - Sahabat Kewarasan Corporate Loe                |
|                                                                 |
|-----------------------------------------------------------------|
|                                                                 |
|                                                                 |
|                                         +---------------------+ |
|                                         | Puk, gue capek      | |
|                                         | banget hari ini.    | |
|                                         | Revisi mulu dari    | |
|                                         | bos, padahal udah   | |
|                                         | sesuai brief awal   | |
|                                         | yang dia kasih.     | |
|                                         +---------------------+ |
|                                                 (User)          |
|                                                                 |
|  +------------------------------------+                         |
|  | Halo ngab. Tarik napas dulu.       |                         |
|  | Inget kata om Marcus Aurelius,     |                         |
|  | lu cuma bisa ngontrol respons lu,  |                         |
|  | bukan kelakuan bos lu. Chill aja,  |                         |
|  | kelakuan bos mah emang di luar     |                         |
|  | kendali kita. Bawa santai aja,     |                         |
|  | toh besok juga masih ada revisi.   |                         |
|  | Udah ngopi belom lu hari ini?      |                         |
|  +------------------------------------+                         |
|    (PukPuk)                                                     |
|                                                                 |
|                                                                 |
|                                                                 |
|                                                                 |
|-----------------------------------------------------------------|
|                                                                 |
|  [ Ketik curhatan lo di sini, no judgment...          ] [Kirim] |
|                                                                 |
+-----------------------------------------------------------------+
```

**Penjelasan Komponen UI:**
1. **Header (Atas)**: Hanya menampung logo/ikon Kapibara dan nama aplikasi "PukPuk" beserta *tagline* singkat. Berfungsi untuk menegaskan identitas dan memberikan kesan santai (*welcoming*).
2. **Chat Area (Tengah)**: Ruang utama tempat percakapan berlangsung. Terdapat pemisahan visual yang jelas antara *bubble chat* milik pengguna (di sebelah kanan) dan *bubble chat* balasan dari AI/PukPuk (di sebelah kiri). Menggunakan ruang kosong (*white space*) yang lega agar mata tidak cepat lelah.
3. **Input Area (Bawah)**: Tempat pengguna mengetik teks dengan satu tombol aksi utama yaitu "Kirim" (Send). Di dalamnya terdapat *placeholder* yang mengundang interaksi, menegaskan bahwa ini adalah *safe space*. Tampilan dibuat persis seperti aplikasi pesan instan modern (*messaging app*).
