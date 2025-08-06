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
    const isProduction = process.env.NODE_ENV === "production" || 
                         window.location.hostname !== "localhost";
    
    const baseUrl = isProduction 
      ? "https://cblue.maravian.com"
      : `${window.location.protocol}//${window.location.host}`;
    
    const fullStudentUrl = `${baseUrl}/game/home`;
    setStudentUrl(fullStudentUrl);

    // Generate QR code
    QRCodeLib.toDataURL(fullStudentUrl, {
      width: 400,
      margin: 2,
      color: {
        dark: "#1F2937",
        light: "#FFFFFF"
      }
    })
    .then(url => setQrCodeUrl(url))
    .catch(err => console.error("Error generating QR code:", err));
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
        <div className="absolute inset-0" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%239C92AC\" fill-opacity=\"0.4\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"4\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')" }}></div>
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
            🌍 Join the Game! 📱
          </motion.h1>
          <motion.p 
            className="text-2xl text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Scan the QR code with your phone to join the landmark quiz
          </motion.p>
        </div>

        {/* Main QR Code Card */}
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <Card className="p-12 bg-black/40 backdrop-blur-sm border-2 border-purple-500/30 text-center">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                {/* QR Code */}
                <div className="space-y-6">
                  <div className="flex justify-center">
                    <QrCode className="w-16 h-16 text-yellow-400 mb-4" />
                  </div>
                  <h2 className="text-3xl font-bold text-yellow-400 mb-6">
                    Scan to Join
                  </h2>
                  {qrCodeUrl && (
                    <div className="bg-white p-6 rounded-2xl inline-block">
                      <img 
                        src={qrCodeUrl} 
                        alt="QR Code for joining the game"
                        className="w-80 h-80 mx-auto"
                      />
                    </div>
                  )}
                </div>

                {/* Instructions */}
                <div className="space-y-8 text-left">
                  <div>
                    <h3 className="text-2xl font-bold text-purple-400 mb-6 flex items-center">
                      <Smartphone className="w-8 h-8 mr-3" />
                      How to Join
                    </h3>
                    <div className="space-y-4 text-lg">
                      <div className="flex items-start space-x-4">
                        <span className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">1</span>
                        <div>
                          <p className="font-semibold">Open your camera app</p>
                          <p className="text-gray-300 text-base">Point your phone camera at the QR code</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-4">
                        <span className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">2</span>
                        <div>
                          <p className="font-semibold">Tap the notification</p>
                          <p className="text-gray-300 text-base">Your phone will show a link to open</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-4">
                        <span className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">3</span>
                        <div>
                          <p className="font-semibold">Join your team</p>
                          <p className="text-gray-300 text-base">Enter your name and team to start playing</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Manual URL Option */}
                  <div className="bg-gray-800/50 p-6 rounded-xl">
                    <h4 className="text-lg font-bold text-blue-400 mb-3 flex items-center">
                      <Globe className="w-5 h-5 mr-2" />
                      Or visit manually:
                    </h4>
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
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Game Info */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-12 grid md:grid-cols-3 gap-6 max-w-4xl mx-auto"
        >
          <Card className="p-6 bg-black/30 backdrop-blur-sm border border-blue-500/30 text-center">
            <Users className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-blue-400 mb-2">Team Play</h3>
            <p className="text-gray-300">Work together with your teammates to identify landmarks</p>
          </Card>
          
          <Card className="p-6 bg-black/30 backdrop-blur-sm border border-green-500/30 text-center">
            <Globe className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-green-400 mb-2">World Landmarks</h3>
            <p className="text-gray-300">Explore famous landmarks from around the globe</p>
          </Card>
          
          <Card className="p-6 bg-black/30 backdrop-blur-sm border border-purple-500/30 text-center">
            <QrCode className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-purple-400 mb-2">Easy Access</h3>
            <p className="text-gray-300">Just scan and play - no app downloads needed</p>
          </Card>
        </motion.div>

        {/* Teacher Access Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="text-center mt-12"
        >
          <a
            href="/teacher"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
          >
            🎓 Teacher Access
          </a>
        </motion.div>
      </div>
    </div>
  );
}
