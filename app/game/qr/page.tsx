"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { QrCode, Smartphone, Users, Globe } from "lucide-react";
import { Card } from "@/components/ui/card";
import QRCodeLib from "qrcode";

export default function QRCodePage() {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [studentUrl, setStudentUrl] = useState<string>("");

  useEffect(() => {
    // Determine the base URL based on environment
    const isProduction =
      process.env.NODE_ENV === "production" ||
      window.location.hostname !== "localhost";

    const baseUrl = isProduction
      ? "https://cblue.maravian.com"
      : "http://192.168.1.168:3000";

    const fullStudentUrl = `${baseUrl}/game/student`;
    setStudentUrl(fullStudentUrl);

    // Generate QR code
    QRCodeLib.toDataURL(fullStudentUrl, {
      width: 400,
      margin: 2,
      color: {
        dark: "#1F2937",
        light: "#FFFFFF",
      },
    })
      .then((url) => setQrCodeUrl(url))
      .catch((err) => console.error("Error generating QR code:", err));
  }, []);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(studentUrl);
      // You could add a toast notification here
      alert("URL copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'url(\'data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.4"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\')',
          }}
        ></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1
            className="text-6xl font-bold mb-4 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Scan to Join the Game
          </motion.h1>
        </div>

        {/* Main QR Code Card */}
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <Card className="p-8 bg-black/40 backdrop-blur-sm border-2 border-purple-500/30 text-center">
              {/* QR Code */}
              <div className="flex flex-col items-center justify-center space-y-6">
                {qrCodeUrl && (
                  <div className="bg-white p-6 rounded-2xl inline-block">
                    <img
                      src={qrCodeUrl}
                      alt="QR Code for joining the game"
                      className="w-80 h-80 mx-auto"
                    />
                  </div>
                )}

                {/* Manual URL Option */}
                <div className="w-full bg-gray-800/50 p-4 rounded-xl mt-4">
                  <div className="flex items-center space-x-2">
                    <code className="bg-gray-900 px-3 py-2 rounded text-sm text-green-400 flex-1 break-all">
                      {studentUrl}
                    </code>
                    <button
                      onClick={copyToClipboard}
                      className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm font-medium transition-colors"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
