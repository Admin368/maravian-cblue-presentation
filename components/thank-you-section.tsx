"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Heart, ThumbsUp, Share2, Camera, Award } from "lucide-react"
import { useState } from "react"

// Sample gallery images - replace with your actual images
const galleryImages = [
  "/placeholder.svg?height=400&width=600",
  "/placeholder.svg?height=400&width=600",
  "/placeholder.svg?height=400&width=600",
  "/placeholder.svg?height=400&width=600",
  "/placeholder.svg?height=400&width=600",
  "/placeholder.svg?height=400&width=600",
]

export default function ThankYouSection() {
  const [mainImage, setMainImage] = useState(galleryImages[0])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  }

  return (
    <div className="min-h-screen py-12">
      <motion.div 
        variants={containerVariants} 
        initial="hidden" 
        animate="visible" 
        className="max-w-6xl mx-auto"
      >
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
            Thank You!
          </h2>
          <div className="flex items-center justify-center mb-4">
            <Heart className="w-6 h-6 text-red-400 mr-2" />
            <h3 className="text-3xl font-semibold text-white">
              For Joining Our Presentation
            </h3>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            We hope you enjoyed learning about these amazing countries and their connections to the Yangtze River through the lens of maritime shipping.
          </p>
        </motion.div>

        {/* Main image section */}
        <motion.div variants={itemVariants} className="mb-12">
          <div className="relative rounded-xl overflow-hidden h-80 md:h-96 w-full">
            <Image
              src={mainImage}
              alt="Thank you highlight"
              fill
              className="object-cover transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
            <div className="absolute bottom-4 left-4 bg-slate-900/70 px-4 py-2 rounded-lg">
              <p className="text-white font-medium flex items-center">
                <Camera className="w-4 h-4 mr-2" />
                C Blue Event Highlights
              </p>
            </div>
          </div>
        </motion.div>

        {/* Thumbnails gallery */}
        <motion.div variants={itemVariants}>
          <h3 className="text-2xl font-semibold mb-6 flex items-center">
            <Award className="w-6 h-6 mr-2 text-yellow-400" />
            Event Gallery
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {galleryImages.map((image, index) => (
              <div
                key={index}
                className={`relative rounded-lg overflow-hidden cursor-pointer transition-all ${
                  mainImage === image ? "ring-2 ring-blue-500 scale-95" : "hover:scale-105"
                }`}
                onClick={() => setMainImage(image)}
                style={{ height: "120px" }}
              >
                <Image
                  src={image}
                  alt={`Gallery image ${index + 1}`}
                  fill
                  className="object-cover"
                />
                {mainImage === image && (
                  <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                    <ThumbsUp className="w-6 h-6 text-white" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Final message */}
        <motion.div variants={itemVariants} className="text-center mt-16">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700">
            <h3 className="text-2xl font-semibold mb-4 text-blue-300">
              Stay Connected
            </h3>
            <p className="text-lg text-gray-300 mb-6">
              Feel free to reach out with any questions or for future collaborations!
            </p>
            <div className="flex justify-center items-center">
              <Share2 className="w-5 h-5 mr-2 text-blue-400" />
              <span className="text-gray-300">
                Share your thoughts about the presentation
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
