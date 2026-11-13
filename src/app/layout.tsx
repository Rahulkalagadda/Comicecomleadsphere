import type { Metadata } from "next";
import localFont from "next/font/local";
import { Inter, Newsreader, Plus_Jakarta_Sans, JetBrains_Mono, Fredoka, Sniglet, Anton } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme/ThemeContext";
import { DemoModeBanner } from "@/components/layout/DemoModeBanner";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta-loaded",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body-loaded",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader-loaded",
  display: "swap",
  style: ["normal", "italic"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-loaded",
  display: "swap",
});

const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-fredoka-loaded",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const sniglet = Sniglet({
  subsets: ["latin"],
  variable: "--font-sniglet-loaded",
  display: "swap",
  weight: ["400", "800"],
});

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton-loaded",
  display: "swap",
});

const shineBubble = localFont({
  src: "../fonts/shine-bubble.ttf",
  variable: "--font-shine-bubble-loaded",
  display: "swap",
});

export const metadata: Metadata = {
  title: "THE AI JUNGLE | Data, Digital & AI Transformation Studio",
  description:
    "Dr. Amit Khandelwal's Season 1 AI Transformation Blueprint, interactive Jungle Audit comics, and AI Jungle Studio video podcast.",
  icons: {
    icon: "/images/leadsphere-logo.jpg",
    apple: "/images/leadsphere-logo.jpg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="jungle" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("leadsphere_theme_mode")||localStorage.getItem("antigravity_theme_mode");if(t==="executive"||t==="jungle"){document.documentElement.setAttribute("data-theme",t)}}catch(e){}})()`,
          }}
        />
      </head>
      <body
        className={`${plusJakartaSans.variable} ${inter.variable} ${newsreader.variable} ${jetbrainsMono.variable} ${fredoka.variable} ${sniglet.variable} ${shineBubble.variable} ${anton.variable} min-h-screen flex flex-col font-sans antialiased selection:bg-brand/25 selection:text-primary-token`}
      >
        <ThemeProvider initialTheme="jungle">
          <DemoModeBanner />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
