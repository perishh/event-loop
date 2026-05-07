/*
 * =========================================================================
 * FILE         :   app/layout.tsx
 *
 * PROJECT      :   EventLoop
 *
 * DESCRIPTION  :   Root layout of the EventLoop application.
 *                  Defines global fonts, metadata, favicon and body layout.
 * =========================================================================
 */


/* Imports the Metadata type from Next.js. */
import type { Metadata } from "next";

/* Imports the Geist font from Next.js Google font helpers. */
import { Geist, Geist_Mono } from "next/font/google";

/* Imports the global CSS file used by the whole application. */
import "./globals.css";


/**
 * @brief Stores the main sans-serif font configuration.
 */
const geistSans = Geist({
    /* Stores the CSS variable name for the sans-serif font. */
    variable: "--font-geist-sans",

    /* Loads the latin font subset. */
    subsets: ["latin"],
});


/**
 * @brief Stores the main monospace font configuration.
 */
const geistMono = Geist_Mono({
    /* Stores the CSS variable name for the monospace font. */
    variable: "--font-geist-mono",

    /* Loads the latin font subset. */
    subsets: ["latin"],
});


/**
 * @brief Stores the metadata shown by the browser and search engines.
 */
export const metadata: Metadata = {
    /* Sets the browser tab title. */
    title: "EventLoop | Εισιτήρια για τις καλύτερες εκδηλώσεις",

    /* Sets the page description metadata. */
    description: "Εφαρμογή διαχείρισης εκδηλώσεων και ηλεκτρονικών κρατήσεων.",

    /* Defines the browser tab icons. */
    icons: {
        /* Sets the main favicon image. */
        icon: [
            {
                /* Uses the small EventLoop logo from the public/logo folder. */
                url: "/logo/EventLoop_LOGO_SMALL.png",

                /* Defines the icon file type. */
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
    /* Receives the nested page content from Next.js. */
    children,
}: Readonly<{
    /* Stores the React content rendered inside the layout. */
    children: React.ReactNode;
}>) {
    /* Returns the root HTML structure. */
    return (
        /* Defines the document language and global font variables. */
        <html
            /* Sets the document language to Greek. */
            lang="el"
            /* Applies the loaded font variables and antialiasing. */
            className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
        >
            {/* Defines the visible page body. */}
            <body className="min-h-full flex flex-col">
                {/* Renders the current page content. */}
                {children}
            </body>
        </html>
    );
}

