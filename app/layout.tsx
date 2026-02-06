import type React from "react"
import type { Metadata } from "next"
import { Source_Sans_3 } from "next/font/google"
import "./globals.css"

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  weight: ["200", "300", "400", "600", "700", "900"],
})

export const metadata: Metadata = {
  title: "Alliance of Progressives in Ethiopia",
  description: "Empowering Southern Nations through Action, Research, and Advocacy",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={sourceSans.className}>{children}</body>
    </html>
  )
}
