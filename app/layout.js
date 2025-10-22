export const metadata = { title: "HunVælger" };
export default function RootLayout({ children }) {
  return (
    <html lang="da">
      <body style={{margin:0,fontFamily:"system-ui"}}>{children}</body>
    </html>
  );
}
