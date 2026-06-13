import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const display = Cormorant_Garamond({ variable: "--font-display", subsets: ["latin"], weight: ["400", "500", "600"] });
const body = Manrope({ variable: "--font-body", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://www.printngift.store"),
  title: { default: "PrintNGift | Gifts worth remembering", template: "%s | PrintNGift" },
  description: "Thoughtful, personalized gifts made for birthdays, milestones, and ordinary days worth celebrating.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/logo.png",
  },
  openGraph: {
    title: "PrintNGift",
    description: "Gifts worth remembering.",
    url: "https://www.printngift.store",
    siteName: "PrintNGift",
    images: [{ url: "/logo.png", width: 320, height: 309, alt: "PrintNGift" }],
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${display.variable} ${body.variable}`}>
      <body className="min-h-dvh font-sans antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
