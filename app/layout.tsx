import type { Metadata } from "next";
import { Manrope } from "next/font/google";

import "./globals.css";
import Header from "@/components/Header";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "greek"],
});

export const metadata: Metadata = {
  title: "EventLoop | Εισιτήρια για τις καλύτερες εκδηλώσεις",
  description: "Εφαρμογή διαχείρισης εκδηλώσεων και ηλεκτρονικών κρατήσεων.",
  icons: {
    icon: [
      {
        url: "/logo/EventLoop_LOGO_SMALL.png",
        type: "image/png",
      },
    ],
  },
};

/**
 * @brief  Renders the root HTML layout of the application.
 * @param  children  the page content rendered inside the body.
 * @return The root HTML and body structure.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="el" className={`${manrope.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Header />
        {children}
      </body>
    </html>
  );
}
