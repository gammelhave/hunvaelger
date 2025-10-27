// app/layout.js
import "./globals.css"
import { SiteFooter } from "@/components/SiteFooter"

export const metadata = {
  title: "HunVælger",
  description:
    "Danmarks nye platform hvor kvinder vælger — og mænd viser sig fra deres bedste side.",
  icons: { icon: "/favicon.ico" },
}

export default function RootLayout({ children }) {
  return (
    <html lang="da">
      <body className="min-h-screen flex flex-col bg-white text-gray-900 antialiased">
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  )
}
