"use client";

import { motion } from "framer-motion";
import {
  BookOpen,
  GraduationCap,
  Globe,
  Users,
  Star,
  MessageCircle,
  MapPin,
  CheckCircle,
} from "lucide-react";

export default function EnglishProgramThankYou() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6 },
    },
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto"
      >
        {/* Main Thank You */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex items-center justify-center mb-6">
            <GraduationCap className="w-16 h-16 text-green-400 mr-4" />
            <div>
              <h1 className="text-6xl font-bold mb-2 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 text-transparent bg-clip-text">
                Thank You!
              </h1>
              <p className="text-2xl text-gray-300">English Program Complete</p>
            </div>
          </div>
        </motion.div>

        {/* Presenter Acknowledgment */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700 max-w-2xl mx-auto">
            <div className="flex items-center justify-center mb-4">
              <BookOpen className="w-8 h-8 text-blue-400 mr-3" />
              <h2 className="text-2xl font-semibold text-white">
                Presented by Paul
              </h2>
            </div>
            <p className="text-gray-300 text-lg mb-4">
              Thank you for participating in today's Malawi cultural learning
              experience!
            </p>
            <p className="text-gray-400">
              Your English instructor and cultural guide
            </p>
          </div>
        </motion.div>

        {/* Learning Summary */}
        <motion.div variants={itemVariants} className="mb-12">
          <h3 className="text-2xl font-bold mb-6 text-blue-400">
            What We Covered Today
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: MapPin,
                title: "Malawi Overview",
                description: "Geography, culture, and first impressions",
              },
              {
                icon: Globe,
                title: "Travel Essentials",
                description: "Arrival, money, transportation, and safety",
              },
              {
                icon: Users,
                title: "Cultural Understanding",
                description: "Tribes, etiquette, and social norms",
              },
              {
                icon: MessageCircle,
                title: "Communication",
                description: "Language advantages and cultural nuances",
              },
              {
                icon: BookOpen,
                title: "Practical Skills",
                description: "Food, landmarks, and daily life",
              },
              {
                icon: CheckCircle,
                title: "Comparative Analysis",
                description: "China vs Malawi differences and similarities",
              },
            ].map((topic, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-slate-600"
              >
                <topic.icon className="w-8 h-8 text-green-400 mx-auto mb-4" />
                <h4 className="text-lg font-semibold mb-2 text-white">
                  {topic.title}
                </h4>
                <p className="text-gray-300 text-sm">{topic.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Key Takeaways */}
        <motion.div variants={itemVariants} className="mb-12">
          <div className="bg-gradient-to-r from-purple-800/50 to-blue-800/50 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30">
            <h3 className="text-2xl font-bold mb-6 text-purple-400">
              Key Takeaways for International Success
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div className="space-y-4">
                <div className="flex items-start">
                  <Star className="w-5 h-5 text-yellow-400 mr-3 mt-1" />
                  <div>
                    <h4 className="font-semibold text-white mb-1">
                      Cultural Sensitivity
                    </h4>
                    <p className="text-gray-300 text-sm">
                      Respect local customs and traditions
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Star className="w-5 h-5 text-yellow-400 mr-3 mt-1" />
                  <div>
                    <h4 className="font-semibold text-white mb-1">
                      Language Advantage
                    </h4>
                    <p className="text-gray-300 text-sm">
                      Use English proficiency as a key asset
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Star className="w-5 h-5 text-yellow-400 mr-3 mt-1" />
                  <div>
                    <h4 className="font-semibold text-white mb-1">
                      Preparation is Key
                    </h4>
                    <p className="text-gray-300 text-sm">
                      Research and prepare before traveling
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Star className="w-5 h-5 text-yellow-400 mr-3 mt-1" />
                  <div>
                    <h4 className="font-semibold text-white mb-1">
                      Adaptability
                    </h4>
                    <p className="text-gray-300 text-sm">
                      Be flexible and open to new experiences
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Star className="w-5 h-5 text-yellow-400 mr-3 mt-1" />
                  <div>
                    <h4 className="font-semibold text-white mb-1">
                      Cross-Cultural Skills
                    </h4>
                    <p className="text-gray-300 text-sm">
                      Build bridges between cultures
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Star className="w-5 h-5 text-yellow-400 mr-3 mt-1" />
                  <div>
                    <h4 className="font-semibold text-white mb-1">
                      Professional Growth
                    </h4>
                    <p className="text-gray-300 text-sm">
                      Use international experience for career development
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Next Steps */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="bg-green-800/30 backdrop-blur-sm rounded-2xl p-8 border border-green-500/30">
            <h3 className="text-2xl font-bold mb-4 text-green-400">
              Continue Your Learning Journey
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <BookOpen className="w-8 h-8 text-green-400 mx-auto mb-3" />
                <h4 className="font-semibold text-white mb-2">Study Further</h4>
                <p className="text-gray-300 text-sm">
                  Research more about Malawi and other cultures
                </p>
              </div>
              <div className="text-center">
                <Users className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                <h4 className="font-semibold text-white mb-2">
                  Practice English
                </h4>
                <p className="text-gray-300 text-sm">
                  Continue improving your English communication skills
                </p>
              </div>
              <div className="text-center">
                <Globe className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                <h4 className="font-semibold text-white mb-2">
                  Plan Adventures
                </h4>
                <p className="text-gray-300 text-sm">
                  Apply what you've learned to future travel plans
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Final Message */}
        <motion.div variants={itemVariants}>
          <p className="text-xl text-gray-300 mb-4">
            Best of luck with your international endeavors!
          </p>
          <p className="text-lg text-gray-400 mb-4">
            Remember: The world is waiting for your unique perspective and
            skills.
          </p>
          <p className="text-sm text-gray-500">
            English Program - Preparing students for global success
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
