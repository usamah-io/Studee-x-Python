import { Outfit, Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { StreakProvider } from "../lib/StreakContext";
import { CourseDataProvider } from "../lib/CourseDataContext";
import { ThemeProvider } from "../lib/ThemeContext";
import Navbar from "./components/Navbar";
import PWARegistration from "../components/PWARegistration";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Stry - AI Quiz Generator & Learning Platform",
  description: "Enhance your online learning experience with Stry, the most consistent and fun way to master new skills.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Stry",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} ${outfit.variable} h-full antialiased`}
    >
      <head>
        <Script 
          src="https://accounts.google.com/gsi/client" 
          strategy="beforeInteractive"
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className="min-h-full flex flex-col">
        <StreakProvider>
          <CourseDataProvider>
            <ThemeProvider>
              <PWARegistration />
              {children}
              <Navbar />
            </ThemeProvider>
          </CourseDataProvider>
        </StreakProvider>
      </body>
    </html>
  );
}
