"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { QrCode, Smartphone, Users, Globe, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import QRCodeLib from "qrcode";

export default function MalawiQRCodePage() {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [studentUrl, setStudentUrl] = useState<string>("");

  useEffect(() => {
    // Determine the base URL based on environment
    const isProduction =
      process.env.NODE_ENV === "production" ||
      window.location.hostname !== "localhost";

    const baseUrl = isProduction
      ? "https://english-program.maravian.com"
      : "http://192.168.1.168:3000";

    const fullStudentUrl = `${baseUrl}/malawi/student`;
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
          <motion.div
            className="flex items-center justify-center mb-4"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <MapPin className="w-12 h-12 text-blue-400 mr-4" />
            <h1 className="text-6xl font-bold bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 bg-clip-text text-transparent">
              English Program
            </h1>
          </motion.div>
          <motion.p
            className="text-xl text-gray-300 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Scan to Join the Interactive Learning Experience
          </motion.p>
          <motion.p
            className="text-sm text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Prepare for international work and travel with this cultural
            presentation
          </motion.p>
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
                      alt="QR Code for joining the Malawi cultural quiz"
                      className="w-80 h-80 mx-auto"
                    />
                  </div>
                )}

                {/* Instructions */}
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center space-x-4 text-gray-300">
                    <div className="flex items-center">
                      <Smartphone className="w-5 h-5 mr-2" />
                      <span className="text-sm">Scan with phone</span>
                    </div>
                    <span className="text-gray-500">•</span>
                    <div className="flex items-center">
                      <Users className="w-5 h-5 mr-2" />
                      <span className="text-sm">Join your team</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400">
                    Answer questions about Malawi culture and customs
                  </p>
                </div>

                {/* Manual URL Option */}
                <div className="w-full bg-gray-800/50 p-4 rounded-xl mt-4">
                  <p className="text-sm text-gray-400 mb-2">Manual entry:</p>
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

        {/* Features */}
        <motion.div
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <Card className="p-6 bg-black/30 backdrop-blur-sm border border-purple-500/20 text-center">
            <MapPin className="w-8 h-8 text-blue-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-2">Cultural Learning</h3>
            <p className="text-sm text-gray-400">
              Learn about Malawi's culture, customs, and practical travel
              information
            </p>
          </Card>

          <Card className="p-6 bg-black/30 backdrop-blur-sm border border-purple-500/20 text-center">
            <Users className="w-8 h-8 text-green-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-2">Team Competition</h3>
            <p className="text-sm text-gray-400">
              Join a team and compete in answering questions about Malawi
            </p>
          </Card>

          <Card className="p-6 bg-black/30 backdrop-blur-sm border border-purple-500/20 text-center">
            <Globe className="w-8 h-8 text-purple-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-2">Prepare for Travel</h3>
            <p className="text-sm text-gray-400">
              Get ready for international work and travel experiences
            </p>
          </Card>
        </motion.div>

        {/* Instructions */}
        <motion.div
          className="mt-12 max-w-2xl mx-auto text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <h2 className="text-2xl font-bold mb-4 text-purple-400">
            How to Join
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-300">
            <div className="flex flex-col items-center">
              <div className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center mb-2 font-bold">
                1
              </div>
              <p>Scan QR code or visit the URL</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center mb-2 font-bold">
                2
              </div>
              <p>Enter your name and select a team</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center mb-2 font-bold">
                3
              </div>
              <p>Answer questions and earn points!</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
