import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import TawkScript from "./components/TawkScript"; // Import the Tawk.to script component

// Standard sans for readability
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

// Mono for that industrial, data-heavy CargoPulse aesthetic
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "CargoPulse | Neural Logistics & Enterprise Global Routing",
  description: "Experience the next generation of logistics. CargoPulse utilizes neural routing and automated distribution nodes to power global trade at scale.",
  keywords: "logistics OS, neural routing, enterprise shipping, supply chain automation, CargoPulse",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased bg-slate-950 text-slate-200`}>
        {/* Subtle Scanline / Grain Overlay for the "Terminal" feel */}
        <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-50 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        
        {/* Tawk.to Live Chat Script */}
        <TawkScript />
      </body>
    </html>
  );
}