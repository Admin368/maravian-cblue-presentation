"use client"

import { motion } from "framer-motion"
import { Anchor, ShipIcon, Globe, Users } from "lucide-react"
import Image from "next/image"

const teamMembers = [
  {
    name: "Team Member 1",
    country: "Malawi",
    school: "Computer Science School",
    photo: "/placeholder.svg?height=150&width=150",
  },
  {
    name: "Team Member 2",
    country: "Jamaica",
    school: "Computer Science School",
    photo: "/placeholder.svg?height=150&width=150",
  },
  {
    name: "Team Member 3",
    country: "Indonesia",
    school: "Computer Science School",
    photo: "/placeholder.svg?height=150&width=150",
  },
  {
    name: "Team Member 4",
    country: "Ethiopia",
    school: "Computer Science School",
    photo: "/placeholder.svg?height=150&width=150",
  },
]

export default function WelcomeSection() {
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
    <div className="min-h-screen flex flex-col items-center justify-center py-12">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-center max-w-4xl mx-auto"
      >
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex items-center justify-center mb-4">
            <Anchor className="text-blue-400 w-12 h-12 mr-3" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 text-transparent bg-clip-text">
              C Blue
            </h1>
            <ShipIcon className="text-blue-400 w-12 h-12 ml-3" />
          </div>
          <p className="text-xl text-gray-300">Organized by China Merchants Group</p>
        </motion.div>

        <motion.div variants={itemVariants} className="mb-12">
          <h2 className="text-4xl font-bold mb-4 text-white">
            Team <span className="text-yellow-400">Winners</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Exploring global landmarks and their connection to the Yangtze River through the lens of logistics and
            shipping.
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="mb-12">
          <div className="relative w-full h-64 rounded-xl overflow-hidden">
            <Image
              src="/placeholder.svg?height=400&width=800"
              alt="Team Winners Group Photo"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
            <div className="absolute bottom-4 left-4 bg-slate-900/70 px-4 py-2 rounded-lg">
              <p className="text-white font-medium">Team Winners at C Blue Event</p>
            </div>
          </div>
        </motion.div>

        <motion.h3 variants={itemVariants} className="text-2xl font-semibold mb-6 flex items-center justify-center">
          <Users className="mr-2" /> Our Team Members
        </motion.h3>

        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-2 border-blue-400">
                <Image src={member.photo || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
              </div>
              <h4 className="text-lg font-semibold">{member.name}</h4>
              <div className="flex items-center justify-center mt-1">
                <Globe className="w-4 h-4 mr-1 text-blue-400" />
                <p className="text-sm text-gray-300">{member.country}</p>
              </div>
              <p className="text-sm text-gray-400 mt-1">{member.school}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}
