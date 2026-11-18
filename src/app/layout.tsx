import type { Metadata, Viewport } from "next";
import { Source_Sans_3, Source_Serif_4 } from "next/font/google";
import { AppShell } from "@/components/AppShell";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import "./globals.css";

const display = Source_Serif_4({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const body = Source_Sans_3({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Nøtteskall",
  description:
    "Lær økonomi på bokmål. Læringsløp, begreper og repetisjon — lagret lokalt på enheten.",
  applicationName: "Nøtteskall",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Nøtteskall",
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/icon-192.png" }],
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
