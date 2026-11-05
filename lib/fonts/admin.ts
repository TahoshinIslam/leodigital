import { JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";

export const jakarta = Plus_Jakarta_Sans({ variable: "--font-jakarta", subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], display: "swap" });
export const jetbrains = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin"], weight: ["400", "500", "600"], display: "swap" });

export const adminFontVars = `${jakarta.variable} ${jetbrains.variable}`;
