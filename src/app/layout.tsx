import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});
const body = Manrope({ variable: "--font-body", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.printngift.store"),
  title: {
    default: "Print&Gift | Gifts worth remembering",
    template: "%s | Print&Gift",
  },
  description:
    "Thoughtful, personalized gifts made for birthdays, milestones, and ordinary days worth celebrating.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/logo-dark.png",
  },
  openGraph: {
    title: "Print&Gift",
    description: "Gifts worth remembering.",
    url: "https://www.printngift.store",
    siteName: "Print&Gift",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Print&Gift" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Print&Gift",
    description: "Gifts worth remembering.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${display.variable} ${body.variable}`}
    >
      <body className="min-h-dvh font-sans antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
