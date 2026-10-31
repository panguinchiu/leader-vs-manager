import './globals.css';

export const metadata = {
  title: '領導力心理測驗',
  description: '你是領導人還是經理人？透過10個情境題，探索你的管理風格與領導特質。',
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-TW">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@400;600;700;900&family=Noto+Sans+TC:wght@400;500;700&family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <footer className="site-footer">
          本測驗改編自 Abraham Zaleznik "Managers and Leaders: Are They Different?"《哈佛商業評論》<br />
          僅供 EiMBA 課堂導讀互動使用，不作為專業心理評量依據。
          <a href="/admin/login" className="admin-entry">後台</a>
        </footer>
      </body>
    </html>
  );
}
