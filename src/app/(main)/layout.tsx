import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "./(common)/footer";
import Navbar from "./(common)/navbar";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TaskFlow - Task Management App",
  description: "A powerful task management tool for teams",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // for generating dataset
  // generateContactDataset(20); // for contacts
  // generateTaskDataset(100); // for task

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        <main className="max-w-7xl mx-auto">{children}</main>
        <Footer />
        {/* Toast container */}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
