import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Navbar } from "@/components/layout/navbar";
import { ChatSheet } from "@/components/chat/chat-sheet";
import { UserNav } from "@/components/layout/user-nav" // Client Component

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Loan Picks Dashboard",
  description: "Your personalized loan recommendations powered by AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Navbar>
          <UserNav />
        </Navbar>
        <div className="flex-1">
          {children}
        </div>
        <Toaster />
        <ChatSheet />
      </body>
    </html>
  );
}
