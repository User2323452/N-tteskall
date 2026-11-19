import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { AppShell } from "@/components/AppShell";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import "./globals.css";

/**
 * Filene ligger i repoet. next/font/google henter CSS fra Google under build,
 * og den parseren feiler på Vercel når en fil-URL ikke slutter på .woff2.
 */
const display = localFont({
  src: [
    { path: "../fonts/source-serif-4-latin-500.woff2", weight: "500", style: "normal" },
    { path: "../fonts/source-serif-4-latin-600.woff2", weight: "600", style: "normal" },
    { path: "../fonts/source-serif-4-latin-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-display",
  display: "swap",
});

const body = localFont({
  src: [
    { path: "../fonts/source-sans-3-latin-400.woff2", weight: "400", style: "normal" },
    { path: "../fonts/source-sans-3-latin-500.woff2", weight: "500", style: "normal" },
    { path: "../fonts/source-sans-3-latin-600.woff2", weight: "600", style: "normal" },
    { path: "../fonts/source-sans-3-latin-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nøtteskall",
  description:
    "Lær økonomi på bokmål. Læringsløp, konsepter og repetisjon — lagret lokalt på enheten.",
  applicationName: "Nøtteskall",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Nøtteskall",
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icons/icon-192.png?v=6", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png?v=6", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png?v=6", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#F7F8FA",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nb">
      <body className={`${display.variable} ${body.variable} antialiased`}>
        <AppShell>{children}</AppShell>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
