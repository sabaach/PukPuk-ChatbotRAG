import './globals.css';

export const metadata = {
    title: 'PukPuk Chatbot',
    description: 'Sahabat Kewarasan Corporate Loe',
};

export default function RootLayout({ children }) {
    return (
        <html lang="id">
            <body className="antialiased bg-slate-50 text-slate-800 font-sans">
                {children}
            </body>
        </html>
    );
}
