"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Anchor, Ship, Waves, MapPin } from "lucide-react"
import type { CountryData } from "@/types"

interface CountrySectionProps {
  country: CountryData
}

export default function CountrySection({ country }: CountrySectionProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
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
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-6xl mx-auto">
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-teal-400 text-transparent bg-clip-text">
            {country.name}
          </h2>
          <div className="flex items-center justify-center">
            <MapPin className="w-5 h-5 mr-2 text-blue-400" />
            <h3 className="text-2xl font-semibold text-white">{country.landmark}</h3>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <motion.div variants={itemVariants} className="order-2 lg:order-1">
            <div className="space-y-8">
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-500/20 p-2 rounded-lg mr-3">
                    <Waves className="w-6 h-6 text-blue-400" />
                  </div>
                  <h4 className="text-xl font-semibold">Similarities and Differences</h4>
                </div>
                <ul className="space-y-2 text-gray-300">
                  {country.similarities.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-400 mr-2">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-500/20 p-2 rounded-lg mr-3">
                    <Ship className="w-6 h-6 text-blue-400" />
                  </div>
                  <h4 className="text-xl font-semibold">Shipping Industry Benefits</h4>
                </div>
                <ul className="space-y-2 text-gray-300">
                  {country.shipping.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-400 mr-2">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-500/20 p-2 rounded-lg mr-3">
                    <Anchor className="w-6 h-6 text-blue-400" />
                  </div>
                  <h4 className="text-xl font-semibold">Adjacent Industries</h4>
                </div>
                <ul className="space-y-2 text-gray-300">
                  {country.industries.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-400 mr-2">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-500/20 p-2 rounded-lg mr-3">
                    <MapPin className="w-6 h-6 text-blue-400" />
                  </div>
                  <h4 className="text-xl font-semibold">Importance to Country</h4>
                </div>
                <ul className="space-y-2 text-gray-300">
                  {country.importance.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-400 mr-2">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="order-1 lg:order-2">
            <div className="grid grid-cols-2 gap-4 h-full">
              {country.images.slice(0, 4).map((image, index) => (
                <div
                  key={index}
                  className={`relative rounded-xl overflow-hidden ${index === 0 ? "col-span-2 row-span-2" : ""}`}
                  style={{ height: index === 0 ? "400px" : "190px" }}
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${country.name} - ${country.landmark}`}
                    fill
                    className="object-cover transition-transform hover:scale-105 duration-500"
                  />
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
