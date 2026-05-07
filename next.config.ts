/*
 * =========================================================================
 * FILE         :   next.config.ts
 *
 * PROJECT      :   EventLoop
 *
 * DESCRIPTION  :   Main Next.js configuration file.
 * =========================================================================
 */


/* Imports the Next.js configuration type. */
import type { NextConfig } from "next";


/**
 * @brief Stores the main Next.js configuration options.
 */
const nextConfig: NextConfig = {
    /* Hides the bottom-left Next.js development indicator. */
    devIndicators: false,
};


/* Exports the Next.js configuration object. */
export default nextConfig;

