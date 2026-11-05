import { IBM_Plex_Mono, Instrument_Sans, Manrope, Newsreader, Oswald } from "next/font/google";

// next/font self-hosts these at build time: no request to Google at runtime,
// no layout shift (size-adjusted fallbacks), and only the subsets we use.
export const instrumentSans = Instrument_Sans({ variable: "--font-instrument-sans", subsets: ["latin"], weight: ["400", "500", "600", "700"], display: "swap" });
export const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], display: "swap" });
export const newsreader = Newsreader({ variable: "--font-newsreader", subsets: ["latin"], style: ["italic"], weight: ["400", "500"], display: "swap" });
export const plexMono = IBM_Plex_Mono({ variable: "--font-plex-mono", subsets: ["latin"], weight: ["400", "500"], display: "swap" });
// Condensed display face for the full-screen menu only — not preloaded, since
// the menu is closed on first paint.
export const oswald = Oswald({ variable: "--font-oswald", subsets: ["latin"], weight: ["500", "600"], display: "swap", preload: false });

export const siteFontVars = [instrumentSans, manrope, newsreader, plexMono, oswald].map((f) => f.variable).join(" ");
