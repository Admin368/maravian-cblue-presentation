"use client"

import { motion } from "framer-motion"
import { ShipIcon } from "lucide-react"

interface ShipProps {
  currentSlide: number
  totalSlides: number
}

export function Ship({ currentSlide, totalSlides }: ShipProps) {
  // Calculate progress percentage
  const progress = currentSlide / (totalSlides - 1)

  return (
    <div className="fixed bottom-24 left-0 w-full z-10 pointer-events-none">
      <div className="container mx-auto px-4 relative h-12">
        {/* Progress line */}
        <div className="absolute bottom-6 left-0 w-full h-1 bg-blue-900/30 rounded">
          <motion.div
            className="h-full bg-blue-400 rounded"
            initial={{ width: "0%" }}
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Ship icon */}
        <motion.div
          initial={{ left: "0%" }}
          animate={{ left: `${progress * 100}%` }}
          transition={{ duration: 0.5 }}
          className="absolute bottom-0"
          style={{ marginLeft: "-12px" }}
        >
          <div className="relative">
            <ShipIcon className="w-8 h-8 text-blue-400" />
            <motion.div
              className="absolute -bottom-1 -right-6 w-8 h-3 bg-blue-400/30 rounded-full blur-sm"
              animate={{
                width: ["8px", "16px", "8px"],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                duration: 1.5,
                ease: "easeInOut",
              }}
            />
          </div>
        </motion.div>
      </div>
    </div>
  )
}
