import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Script from "next/script";
import { Providers as AuthProvider } from "@/components/providers/AuthProvider";
import { GrokAssistant } from "@/components/ai/GrokAssistant";
import { CartProvider } from "@/context/CartContext";
import { CartDrawer } from "@/components/layout/CartDrawer";
import "@/styles/globals.css";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { CustomCursor } from "@/components/layout/CustomCursor";


const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Melted Modulus | India's Premium 3D Printing Marketplace",
    template: "%s | Melted Modulus",
  },
  description: "Shop premium 3D printed products or order custom prints. India-wide delivery. Ashoka Stambh, Buddha Murti, Keychains and more.",
  keywords: ["3D printing", "custom prints", "India", "STL files", "3D models", "Melted Modulus", "MeltedModulus"],
  openGraph: {
    title: "Melted Modulus – Imagine. Inspire.",
    description: "India's premium hub for high-precision 3D prints, custom models, and industrial-grade manufacturing.",
    siteName: "Melted Modulus",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans">
        {/* Load critical external scripts at body root */}
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="afterInteractive"
        />
        <Script
          src="https://js.puter.com/v2/"
          strategy="afterInteractive"
        />

        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <CartProvider>
              <SmoothScroll>
                <CustomCursor />
                {children}
                <CartDrawer />
                <GrokAssistant />
              </SmoothScroll>
            </CartProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
