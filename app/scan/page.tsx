"use client";

import { motion } from "framer-motion";
import QRCode from "react-qr-code";
import { Anchor, ShipIcon, Globe, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function ScanPage() {
  const [currentImage, setCurrentImage] = useState(0);
  
  // Maritime-themed image URLs
  const backgroundImages = [
    "/placeholder.svg?height=1080&width=1920&text=Ship+at+Sea",
    "/placeholder.svg?height=1080&width=1920&text=Harbor+View",
    "/placeholder.svg?height=1080&width=1920&text=Maritime+Operations",
    "/placeholder.svg?height=1080&width=1920&text=Global+Shipping",
    "/placeholder.svg?height=1080&width=1920&text=Port+Infrastructure",
  ];
  
  // Image carousel effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % backgroundImages.length);
    }, 5000); // Change image every 5 seconds
    
    return () => clearInterval(interval);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };
  return (
    <div className="min-h-screen py-12 flex flex-col items-center justify-center bg-slate-900 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 to-slate-900 relative overflow-hidden">
      {/* Background Image Carousel */}
      <div className="absolute inset-0 z-0">
        {backgroundImages.map((image, index) => (
          <motion.div
            key={index}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: index === currentImage ? 0.15 : 0 
            }}
            transition={{ duration: 1.5 }}
          >
            <Image
              src={image}
              alt="Maritime background"
              fill
              className="object-cover"
              priority={index === 0}
            />
          </motion.div>
        ))}
      </div>
      
      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto w-full px-4 md:px-0 relative z-10"
      >
        {/* Title Section */}
        <motion.div variants={itemVariants} className="text-center mb-10">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-teal-400 text-transparent bg-clip-text">
            C-Blue Winners
          </h1>
          <div className="flex items-center justify-center">
            <Globe className="w-6 h-6 mr-2 text-blue-400" />
            <h2 className="text-2xl font-semibold text-white">
              Global Maritime Perspective
            </h2>
          </div>
        </motion.div>

        {/* QR Code Section */}
        <motion.div
          variants={itemVariants}
          className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700 flex flex-col items-center mb-12"
        >
          <div className="mb-6 text-center">
            <h3 className="text-xl font-semibold text-white mb-2">
              Scan to Join the Presentation
            </h3>
            <p className="text-gray-300">
              Use your device's camera to scan this QR code
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl mb-6">
            <QRCode
              value="https://cblue.maravian.com"
              size={200}
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              viewBox={`0 0 256 256`}
            />
          </div>

          <p className="text-sm text-gray-400">https://cblue.maravian.com</p>
        </motion.div>

        {/* Team Introduction */}
        <motion.div
          variants={itemVariants}
          className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 mb-12"
        >
          <div className="flex items-center mb-4">
            <div className="bg-blue-500/20 p-2 rounded-lg mr-3">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-white">
              Welcome from Our Team
            </h3>
          </div>

          <p className="text-gray-300 mb-4">
            Thank you for joining us for this presentation on the maritime
            industry across different countries. Our team has researched the
            unique aspects, similarities, and differences in maritime operations
            and infrastructure across various nations.
          </p>

          <p className="text-gray-300">
            Please scan the QR code above to access the presentation on your
            device. This will allow you to follow along as we navigate through
            different sections of our analysis of global maritime operations.
          </p>
        </motion.div>

        {/* Start Button */}
        <motion.div variants={itemVariants} className="text-center">
          <Link href="/" passHref>
            <Button className="bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white px-8 py-6 rounded-full text-lg font-semibold transition-all shadow-lg hover:shadow-xl">
              Start Presentation
            </Button>
          </Link>        </motion.div>
      </motion.div>
    </div>
  );
}
