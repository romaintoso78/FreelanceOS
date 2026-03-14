import type { Metadata } from "next"
import { Geist_Mono, DM_Sans, Cormorant_Garamond, Raleway } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import "./globals.css"
import { cn } from "@/lib/utils";

const raleway = Raleway({subsets:['latin'],variable:'--font-sans'});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
})

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: {
    default: "FreelanceOS — Gestion freelance simplifiée",
    template: "%s | FreelanceOS",
  },
  description:
    "Facturation légale, CRM, contrats et suivi fiscal pour les freelances français.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="fr" className={cn("font-sans", raleway.variable)}>
        <body className={`${dmSans.variable} ${cormorant.variable} ${geistMono.variable} antialiased`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
