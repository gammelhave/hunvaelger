import "./globals.css"; // 👈 DEN HER LINJE ER DEN VIGTIGE!
import { Plus_Jakarta_Sans } from "next/font/google";

export const metadata = {
  title: "HunVælger",
  description:
    "Scan. Se. Connect. HunVælger – et simpelt, moderne koncept til at mødes og matche.",
  metadataBase:
    typeof process !== "undefined" && process.env.NEXT_PUBLIC_BASE_URL
      ? new URL(process.env.NEXT_PUBLIC_BASE_URL)
      : undefined,
  openGraph: {
    title: "HunVælger – Scan. Se. Connect.",
    description:
      "Se profiler, scan QR-koder og connect på et øjeblik. Et moderne dansk dating-koncept.",
    images: ["/og-preview.jpg"],
    type: "website",
    locale: "da_DK",
  },
  twitter: {
    card: "summary_large_image",
    title: "HunVælger – Scan. Se. Connect.",
    description:
      "Se profiler, scan QR-koder og connect på et øjeblik. Et moderne dansk dating-koncept.",
    images: ["/og-preview.jpg"],
  },
};

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export default function RootLayout({ children }) {
  return (
    <html lang="da">
      <body
        className={`${jakarta.variable} font-sans min-h-screen bg-white text-gray-900`}
      >
        {children}
      </body>
    </html>
  );
}
