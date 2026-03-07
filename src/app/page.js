'use client';

import { useState, useRef, useEffect } from 'react';

const LOGO_URI = "/gambar/logo.png"
const SLEEPING_URI = "/gambar/bersandar.png"
const ANGRY_URI = "/gambar/marah.png"

const TYPING_MESSAGES = [
    "PukPuk sedang berendam di air panas mencari wangsit... 🛁",
    "PukPuk lagi nyeruput matcha latte sambil mikir... 🍵",
    "Membuka gulungan kitab Filosofi Teras... 📜",
    "PukPuk konsultasi dulu sama burung di kepalanya... 🐦",
    "Lagi ngerenungin semesta yang luas... 🌿",
    "Menghela napas panjang ala stoik sejati... 😤",
    "PukPuk lagi ngunyah rumput sambil berfilsafat... 🌾",
];

const QUICK_REPLIES = [
    { label: "Bos ngamuk lagi 🤬", msg: "Bos gue ngamuk lagi hari ini, padahal gue udah usaha maksimal. Capek banget ngab." },
    { label: "Revisi ke-100 🫠", msg: "Ini revisi ke-100, klien minta yang sama persis kayak draft awal. Gue mau nangis." },
    { label: "Capek pura-pura sibuk 🥱", msg: "Hari ini gue habiskan waktu pura-pura sibuk di depan laptop. Gue ngerasa kosong banget." },
    { label: "Butuh di-pukpuk 🫂", msg: "Gue butuh di-pukpuk hari ini. Literally nothing going right." },
    { label: "Meeting ga jelas lagi 📅", msg: "Baru abis meeting 2 jam yang isinya bisa jadi email. Gue lelah, PukPuk." },
    { label: "Overthinking parah 🌀", msg: "Gue overthinking parah banget sekarang, gabisa berhenti mikirin hal-hal yang ga bisa dikontrol." },
];

const TOAST_MESSAGES = [
    "Ouch! Jangan ditekan, PukPuk lagi rebahan. 😤",
    "Hei! Gentle dong, gue kapibara sensitif. 🥺",
    "Stop! Gue lagi meditasi ini, ganggu aja. 🧘",
    "Aduh! Tombolnya bukan untuk dipencet-pencet! 😅",
    "PukPuk protes keras! Ini pelecehan kapibara! ✊",
];

export default function Home() {
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [typingMsg, setTypingMsg] = useState(TYPING_MESSAGES[0]);
    const [toast, setToast] = useState(null);
    const [leaves, setLeaves] = useState([]);
    const [logoClickCount, setLogoClickCount] = useState(0);

    const messagesEndRef = useRef(null);
    const textareaRef = useRef(null);
    const toastTimerRef = useRef(null);
    const leafIdRef = useRef(0);

    const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

    useEffect(() => { scrollToBottom(); }, [messages, isLoading, errorMessage]);

    useEffect(() => {
        const ta = textareaRef.current;
        if (!ta) return;
        ta.style.height = 'auto';
        ta.style.height = Math.min(ta.scrollHeight, 140) + 'px';
    }, [inputText]);

    useEffect(() => {
        if (!isLoading) return;
        let i = 0;
        const iv = setInterval(() => {
            i = (i + 1) % TYPING_MESSAGES.length;
            setTypingMsg(TYPING_MESSAGES[i]);
        }, 2800);
        return () => clearInterval(iv);
    }, [isLoading]);

    const showToast = (msg) => {
        setToast(msg);
        if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
        toastTimerRef.current = setTimeout(() => setToast(null), 3200);
    };

    const spawnLeaves = () => {
        const newLeaves = Array.from({ length: 18 }, () => ({
            id: leafIdRef.current++,
            left: Math.random() * 100,
            delay: Math.random() * 0.8,
            duration: 2.5 + Math.random() * 2,
            size: 14 + Math.floor(Math.random() * 16),
            emoji: ['🍃', '🌿', '🍀', '🌱'][Math.floor(Math.random() * 4)],
        }));
        setLeaves(prev => [...prev, ...newLeaves]);
        setTimeout(() => setLeaves(prev => prev.filter(l => !newLeaves.find(n => n.id === l.id))), 5000);
    };

    const handleLogoClick = () => {
        showToast(TOAST_MESSAGES[logoClickCount % TOAST_MESSAGES.length]);
        setLogoClickCount(c => c + 1);
        spawnLeaves();
    };

    const sendMessage = async (text) => {
        if (!text.trim() || isLoading) return;
        setErrorMessage(null);
        setMessages(prev => [...prev, { role: 'user', content: text }]);
        setInputText('');
        setIsLoading(true);
        setTypingMsg(TYPING_MESSAGES[Math.floor(Math.random() * TYPING_MESSAGES.length)]);
        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text }),
            });
            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.error || `Gagal menghubungi server (Status: ${res.status})`);
            }
            const data = await res.json();
            setMessages(prev => [...prev, { role: 'bot', content: data.content }]);
        } catch (e) {
            setErrorMessage(e.message || 'Koneksi ke server PukPuk terputus.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendMessage = (e) => { e.preventDefault(); sendMessage(inputText); };
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(inputText); }
    };

    const hasMessages = messages.length > 0;

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&family=Lora:ital,wght@0,500;0,600;1,400&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { width: 100%; height: 100%; overflow: hidden; font-family: 'Nunito', sans-serif; background: #e8ede4; }

        /* ── SHELL ── */
        .chat-shell { display: flex; flex-direction: column; width: 100vw; height: 100dvh; background: #faf8f3; overflow: hidden; position: relative; }

        /* ── LEAF CONFETTI ── */
        .leaf-container { position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 9999; overflow: hidden; }
        .leaf { position: absolute; top: -40px; animation: leaf-fall linear forwards; user-select: none; pointer-events: none; }
        @keyframes leaf-fall {
          0%   { transform: translateY(-40px) rotate(0deg);   opacity: 1; }
          80%  { opacity: 1; }
          100% { transform: translateY(105vh) rotate(720deg); opacity: 0; }
        }

        /* ── TOAST ── */
        .toast {
          position: fixed; top: 88px; left: 50%;
          transform: translateX(-50%);
          background: #3a5c33; color: #f0f7ee;
          padding: 12px 24px; border-radius: 99px;
          font-size: 14px; font-weight: 700;
          box-shadow: 0 8px 28px rgba(58,92,51,0.35);
          z-index: 9998; white-space: nowrap; max-width: 90vw; text-align: center;
          animation: toast-in 0.35s cubic-bezier(.22,.9,.3,1) forwards;
        }
        @keyframes toast-in  { from { opacity:0; transform:translateX(-50%) translateY(-18px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }

        /* ── HEADER ── */
        .chat-header {
          flex-shrink: 0; display: flex; align-items: center; justify-content: space-between;
          padding: 0 28px 0 20px; height: 68px;
          background: #ffffff; border-bottom: 1.5px solid #dde8d8;
          position: relative; z-index: 20;
        }
        .chat-header::after {
          content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 3px;
          background: linear-gradient(90deg, #a8c4a0 0%, #c4a882 30%, #8fb98f 60%, #a8c4a0 100%);
          background-size: 200% 100%; animation: shimmer 6s linear infinite;
        }
        @keyframes shimmer { 0% { background-position: 0% 0%; } 100% { background-position: 200% 0%; } }

        .header-brand { display: flex; align-items: center; gap: 11px; cursor: pointer; user-select: none; }
        .logo-img {
          width: 50px; height: 50px; border-radius: 50%;
          object-fit: cover; object-position: center 12%;
          background: #d6e8d0; border: 2px solid #b8d4b2;
          box-shadow: 0 2px 12px rgba(74,103,65,0.18); flex-shrink: 0;
          transition: transform 0.25s cubic-bezier(.34,1.56,.64,1); cursor: pointer;
        }
        .logo-img:hover  { transform: scale(1.08) rotate(-4deg); }
        .logo-img:active { transform: scale(0.94) rotate(4deg); }

        .brand-text { display: flex; flex-direction: column; gap: 1px; }
        .brand-name { font-family: 'Lora', serif; font-size: 21px; font-weight: 600; color: #3a5c33; letter-spacing: -0.3px; line-height: 1.1; }
        .brand-tagline { font-size: 10.5px; font-weight: 700; color: #8aaa82; text-transform: uppercase; letter-spacing: 1px; }

        .header-status { display: flex; align-items: center; gap: 8px; background: #f0f7ee; border: 1px solid #c8ddc2; border-radius: 99px; padding: 6px 16px; }
        .pulse-wrap { position: relative; width: 10px; height: 10px; flex-shrink: 0; }
        .pulse-wrap::before { content: ''; position: absolute; inset: 0; border-radius: 50%; background: #5aac4e; animation: pulsering 2s ease-out infinite; }
        @keyframes pulsering { 0% { transform: scale(1); opacity: 0.8; } 70% { transform: scale(2.2); opacity: 0; } 100% { transform: scale(1); opacity: 0; } }
        .pulse-core { position: absolute; inset: 2px; border-radius: 50%; background: #4ade80; z-index: 1; }
        .status-text { font-size: 12.5px; font-weight: 700; color: #3d7a35; white-space: nowrap; }

        /* ── MESSAGES ── */
        .messages-area {
          flex: 1; overflow-y: auto; padding: 32px 10% 16px;
          display: flex; flex-direction: column; gap: 22px;
          background:
            radial-gradient(ellipse 60% 40% at 10% 10%, rgba(168,196,160,0.08) 0%, transparent 60%),
            radial-gradient(ellipse 50% 30% at 90% 85%, rgba(196,168,130,0.06) 0%, transparent 50%),
            #faf8f3;
        }
        .messages-area::-webkit-scrollbar { width: 6px; }
        .messages-area::-webkit-scrollbar-track { background: transparent; }
        .messages-area::-webkit-scrollbar-thumb { background: #c8ddc2; border-radius: 10px; }

        /* ── EMPTY STATE ── */
        .empty-state {
          flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center;
          gap: 20px; padding: 40px 10%; text-align: center;
          animation: fade-up 0.6s ease forwards; opacity: 0;
        }
        @keyframes fade-up { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }

        /* sleeping capybara — wider, not circular */
        .empty-logo {
          width: 220px; height: auto;
          filter: drop-shadow(0 8px 24px rgba(74,103,65,0.18));
          animation: float 4s ease-in-out infinite;
        }
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-14px); } }

        .empty-title { font-family: 'Lora', serif; font-size: 22px; font-weight: 600; color: #3a5c33; line-height: 1.4; }
        .empty-sub   { font-size: 15px; color: #8aaa82; font-weight: 500; max-width: 320px; line-height: 1.7; }
        .empty-hint  {
          display: flex; align-items: center; gap: 8px;
          background: #f0f7ee; border: 1px dashed #b8d4b2; border-radius: 99px;
          padding: 8px 20px; font-size: 13px; font-weight: 700; color: #6b9a5e;
          animation: pulse-hint 2.5s ease-in-out infinite;
        }
        @keyframes pulse-hint { 0%,100% { box-shadow: 0 0 0 0 rgba(107,154,94,0); } 50% { box-shadow: 0 0 0 6px rgba(107,154,94,0.10); } }

        /* ── MSG ROWS ── */
        .msg-row { display: flex; animation: msgin 0.32s cubic-bezier(.22,.9,.3,1) forwards; opacity: 0; transform: translateY(10px); }
        @keyframes msgin { to { opacity: 1; transform: translateY(0); } }
        .msg-row.bot  { justify-content: flex-start; }
        .msg-row.user { justify-content: flex-end; }

        .msg-group { display: flex; align-items: flex-end; gap: 12px; max-width: 65%; }
        .msg-group.ug { flex-direction: row-reverse; }

        .bot-ava { width: 38px; height: 38px; border-radius: 50%; overflow: hidden; flex-shrink: 0; background: #d6e8d0; border: 2px solid #c0d8ba; box-shadow: 0 2px 8px rgba(74,103,65,0.15); margin-bottom: 2px; }
        .bot-ava img { width: 100%; height: 100%; object-fit: cover; object-position: center 10%; }

        .bubble-col { display: flex; flex-direction: column; gap: 4px; }
        .bubble-lbl { font-size: 11.5px; font-weight: 700; color: #8aaa82; letter-spacing: 0.3px; padding: 0 4px; }
        .bubble-lbl.r { text-align: right; }

        .bubble { padding: 14px 20px; font-size: 15.5px; line-height: 1.7; word-break: break-word; white-space: pre-wrap; position: relative; }
        .bb { background: #ffffff; color: #2c3e28; border-radius: 18px 18px 18px 4px; border: 1.5px solid #dde8d8; box-shadow: 0 2px 12px rgba(74,103,65,0.07); }
        .bb::before { content: ''; position: absolute; top: 0; left: -1.5px; width: 3px; height: 50%; background: linear-gradient(to bottom, #a8c4a0, transparent); border-radius: 4px 0 0 4px; }
        .ub { background: linear-gradient(145deg, #6b9a5e, #4a7340); color: #f0f7ee; border-radius: 18px 18px 4px 18px; box-shadow: 0 4px 18px rgba(74,103,65,0.28); }

        /* ── TYPING ── */
        .typing-row { display: flex; justify-content: flex-start; animation: msgin 0.3s ease forwards; opacity: 0; }
        .typing-inner { display: flex; align-items: flex-end; gap: 12px; }
        .typing-bub { display: flex; align-items: center; gap: 12px; background: #ffffff; border: 1.5px solid #dde8d8; border-radius: 18px 18px 18px 4px; padding: 13px 20px; box-shadow: 0 2px 10px rgba(74,103,65,0.07); max-width: 420px; }
        .typing-txt { font-size: 13.5px; color: #7a9a72; font-weight: 600; font-style: italic; flex: 1; }
        .dots { display: flex; gap: 5px; align-items: center; flex-shrink: 0; }
        .dot { width: 7px; height: 7px; border-radius: 50%; background: #a8c4a0; animation: bdot 1.3s infinite ease-in-out; }
        .dot:nth-child(2) { animation-delay: 160ms; }
        .dot:nth-child(3) { animation-delay: 320ms; }
        @keyframes bdot { 0%,70%,100% { transform: translateY(0); opacity: 0.4; } 35% { transform: translateY(-7px); opacity: 1; } }

        /* ── ERROR BOX ── */
        .err-box {
          display: flex; align-items: center; gap: 16px;
          background: #fff3f0; border: 1.5px solid #f5c6b8;
          border-radius: 18px; padding: 14px 20px;
          animation: msgin 0.3s ease forwards; opacity: 0;
          max-width: 70%; align-self: center;
        }
        /* angry capybara shown in error */
        .err-capy { width: 64px; height: 64px; object-fit: contain; flex-shrink: 0; animation: shake 0.5s ease; }
        @keyframes shake {
          0%,100% { transform: rotate(0deg); }
          20%      { transform: rotate(-6deg); }
          40%      { transform: rotate(6deg); }
          60%      { transform: rotate(-4deg); }
          80%      { transform: rotate(4deg); }
        }
        .err-title { font-size: 13.5px; font-weight: 800; color: #b05030; margin-bottom: 3px; }
        .err-txt   { font-size: 13.5px; color: #c0604a; line-height: 1.5; }

        /* ── QUICK REPLIES ── */
        .quick-replies { display: flex; gap: 8px; overflow-x: auto; padding: 2px 4px 10px; scrollbar-width: none; -webkit-overflow-scrolling: touch; flex-shrink: 0; }
        .quick-replies::-webkit-scrollbar { display: none; }
        .qr-chip {
          flex-shrink: 0; padding: 8px 16px;
          background: #ffffff; border: 1.5px solid #c8ddc2;
          border-radius: 99px; font-size: 13.5px; font-weight: 700;
          color: #4a7340; cursor: pointer; white-space: nowrap;
          font-family: 'Nunito', sans-serif;
          transition: all 0.18s cubic-bezier(.22,.9,.3,1);
          box-shadow: 0 2px 8px rgba(74,103,65,0.08);
        }
        .qr-chip:hover  { background: #f0f7ee; border-color: #7ab070; color: #3a5c33; transform: translateY(-2px); box-shadow: 0 4px 14px rgba(74,103,65,0.16); }
        .qr-chip:active { transform: scale(0.95) translateY(0); }
        .qr-chip:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }

        /* ── FOOTER ── */
        .chat-footer { flex-shrink: 0; padding: 12px 10% 20px; background: #ffffff; border-top: 1.5px solid #dde8d8; }
        .input-box {
          display: flex; align-items: flex-end; gap: 12px;
          background: #f5f9f3; border: 1.5px solid #c8ddc2;
          border-radius: 32px; padding: 8px 8px 8px 24px; transition: all 0.2s ease;
        }
        .input-box:focus-within { border-color: #6b9a5e; background: #ffffff; box-shadow: 0 0 0 3px rgba(107,154,94,0.12), 0 4px 18px rgba(74,103,65,0.08); }
        .chat-ta {
          flex: 1; background: transparent; border: none; outline: none;
          font-family: 'Nunito', sans-serif; font-size: 15.5px; color: #2c3e28;
          line-height: 1.65; resize: none; max-height: 140px; min-height: 46px;
          padding: 9px 0; overflow-y: auto; font-weight: 500;
        }
        .chat-ta::placeholder { color: #a8bda0; font-weight: 400; }
        .chat-ta::-webkit-scrollbar { width: 3px; }
        .chat-ta::-webkit-scrollbar-thumb { background: #c8ddc2; border-radius: 10px; }

        .send-btn {
          width: 50px; height: 50px; border-radius: 50%; border: none;
          background: #d8e4d4; color: #8aaa82;
          display: flex; align-items: center; justify-content: center;
          cursor: not-allowed; flex-shrink: 0;
          transition: all 0.22s cubic-bezier(.34,1.56,.64,1);
          font-size: 22px; line-height: 1; box-shadow: none;
        }
        .send-btn.active {
          background: linear-gradient(145deg, #f4a637, #e88c1e);
          color: white; cursor: pointer; transform: scale(1.1);
          box-shadow: 0 4px 18px rgba(232,140,30,0.42);
        }
        .send-btn.active:hover  { transform: scale(1.16) translateY(-1px); box-shadow: 0 7px 24px rgba(232,140,30,0.5); }
        .send-btn.active:active { transform: scale(0.95); }

        .footer-note { text-align: center; font-size: 12px; color: #b0c4a8; margin-top: 11px; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 7px; }
        .fn-dot { width: 3px; height: 3px; border-radius: 50%; background: #c8ddc2; }
        .anchor { height: 4px; }
      `}</style>

            {/* LEAF CONFETTI */}
            <div className="leaf-container">
                {leaves.map(leaf => (
                    <div key={leaf.id} className="leaf" style={{ left: `${leaf.left}%`, fontSize: `${leaf.size}px`, animationDuration: `${leaf.duration}s`, animationDelay: `${leaf.delay}s` }}>
                        {leaf.emoji}
                    </div>
                ))}
            </div>

            {/* TOAST */}
            {toast && <div className="toast">{toast}</div>}

            <div className="chat-shell">

                {/* HEADER — always uses the standard green logo */}
                <header className="chat-header">
                    <div className="header-brand" onClick={handleLogoClick} title="Klik gue!">
                        <img src={LOGO_URI} alt="PukPuk" className="logo-img" />
                        <div className="brand-text">
                            <span className="brand-name">PukPuk</span>
                            <span className="brand-tagline">Kapibara Stoik Jakarta</span>
                        </div>
                    </div>
                    <div className="header-status">
                        <div className="pulse-wrap"><div className="pulse-core" /></div>
                        <span className="status-text">Online · Siap Jadi Sandaran</span>
                    </div>
                </header>

                {/* EMPTY STATE — uses sleeping capybara */}
                {!hasMessages ? (
                    <div className="empty-state">
                        <img src={SLEEPING_URI} alt="PukPuk rebahan" className="empty-logo" />
                        <div className="empty-title">PukPuk sedang rebahan... 😴</div>
                        <div className="empty-sub">
                            Ketik sesuatu untuk membangunkan.<br />
                            Gue di sini, siap dengerin semua drama kantor loe.
                        </div>
                        <div className="empty-hint">
                            <span>💡</span>
                            <span>Klik logo di atas buat surprise!</span>
                        </div>
                    </div>
                ) : (
                    <main className="messages-area">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`msg-row ${msg.role}`}>
                                {msg.role === 'bot' ? (
                                    <div className="msg-group">
                                        <div className="bot-ava"><img src={LOGO_URI} alt="PukPuk" /></div>
                                        <div className="bubble-col">
                                            <span className="bubble-lbl">PukPuk</span>
                                            <div className="bubble bb">{msg.content}</div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="msg-group ug">
                                        <div className="bubble-col">
                                            <span className="bubble-lbl r">Kamu</span>
                                            <div className="bubble ub">{msg.content}</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* TYPING — uses standard logo avatar */}
                        {isLoading && (
                            <div className="typing-row">
                                <div className="typing-inner">
                                    <div className="bot-ava"><img src={LOGO_URI} alt="PukPuk" /></div>
                                    <div className="typing-bub">
                                        <span className="typing-txt">{typingMsg}</span>
                                        <div className="dots"><div className="dot" /><div className="dot" /><div className="dot" /></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ERROR — uses angry capybara */}
                        {errorMessage && (
                            <div className="err-box">
                                <img src={ANGRY_URI} alt="PukPuk marah" className="err-capy" />
                                <div>
                                    <div className="err-title">Cilaka dua belas! 😤</div>
                                    <div className="err-txt">{errorMessage}</div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} className="anchor" />
                    </main>
                )}

                {/* FOOTER */}
                <footer className="chat-footer">
                    <div className="quick-replies">
                        {QUICK_REPLIES.map((qr, i) => (
                            <button key={i} className="qr-chip" onClick={() => sendMessage(qr.msg)} disabled={isLoading}>
                                {qr.label}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleSendMessage}>
                        <div className="input-box">
                            <textarea
                                ref={textareaRef}
                                className="chat-ta"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyDown={handleKeyDown}
                                disabled={isLoading}
                                placeholder="Curhat ke PukPuk di sini… (Enter untuk kirim)"
                                rows={1}
                            />
                            <button
                                type="submit"
                                className={`send-btn ${inputText.trim() && !isLoading ? 'active' : ''}`}
                                disabled={isLoading || !inputText.trim()}
                                aria-label="Kirim pesan"
                            >🍊</button>
                        </div>
                    </form>

                    <div className="footer-note">
                        <span>🌿</span>
                        <span>Dilatih atas ekstrak Filosofi Teras</span>
                        <div className="fn-dot" />
                        <span>Powered by Google Gemini</span>
                    </div>
                </footer>

            </div>
        </>
    );
}