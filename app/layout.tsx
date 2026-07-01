import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from 'next-themes'
import NavBar from "./ui/Navbar";
import Footer from "./ui/Footer";
import { toast, Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "soophia.me",
  description: "Sophia's personal website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased 
        dark:text-neutral-400 text-neutral-500  dark:bg-neutral-950 bg-neutral-50 
        `}
      >
        <ThemeProvider>
          <Toaster
            toastOptions={{
              style: {
                borderRadius: '0',
              }
            }}
           />
          <div className="grid grid-rows-[max-content_1fr_max-content] h-svh w-svw ">
            <NavBar />
              {children}
            <Footer />
          </div>
        </ThemeProvider>
        
      </body>
    </html>
  );
}
