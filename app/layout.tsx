import type React from "react";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SocketProvider } from "@/components/socket-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "C Blue - Winners Team Presentation",
  description:
    "A digital presentation comparing landmarks to the Yangtze River",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SocketProvider>{children}</SocketProvider>
      </body>
    </html>
  );
}
