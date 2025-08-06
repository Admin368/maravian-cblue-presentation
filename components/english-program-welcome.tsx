"use client";

import { motion } from "framer-motion";
import { MapPin, Globe, Users, BookOpen, GraduationCap } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useSocket } from "@/hooks/use-socket";

export default function EnglishProgramWelcomeSection() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [scrollMode, setScrollMode] = useState("none");
  const { socket } = useSocket();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const admin = urlParams.get("admin") === "true";
    setIsAdmin(admin);

    if (socket) {
      socket.on("malawi-scrollModeChange", (mode: string) => {
        setScrollMode(mode);
      });

      return () => {
        socket.off("malawi-scrollModeChange");
      };
    }
  }, [socket]);

  const handleScrollClick = (elementId: string) => {
    if (isAdmin && scrollMode === "div-select") {
      socket?.emit("malawi-scrollToElement", elementId);

      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

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
        {/* Main Title */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex items-center justify-center mb-6">
            <BookOpen className="w-16 h-16 text-blue-400 mr-4" />
            <div>
              <h1 className="text-6xl font-bold mb-2 bg-gradient-to-r from-blue-400 via-teal-400 to-green-400 text-transparent bg-clip-text">
                English Program
              </h1>
              <p className="text-2xl text-gray-300">
                Cultural Learning Experience
              </p>
            </div>
          </div>
        </motion.div>

        {/* Subtitle */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex items-center justify-center mb-4">
            <MapPin className="w-8 h-8 text-teal-400 mr-3" />
            <h2 className="text-3xl font-semibold text-white">
              Malawi: The Warm Heart of Africa
            </h2>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            An interactive presentation for preparing english students for
            international work and travel experiences
          </p>
        </motion.div>

        {/* Presenter Information */}
        <motion.div variants={itemVariants} className="mb-12">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700 max-w-2xl mx-auto">
            <div className="flex items-center justify-center mb-4">
              <GraduationCap className="w-8 h-8 text-purple-400 mr-3" />
              <h3 className="text-2xl font-semibold text-white">
                Presented by Paul
              </h3>
            </div>
            <p className="text-gray-300 text-lg">
              Your English instructor and cultural guide for this learning
              journey
            </p>
          </div>
        </motion.div>

        {/* Learning Objectives */}
        <motion.div
          variants={itemVariants}
          className="mb-12"
          id="learning-objectives"
        >
          {isAdmin && scrollMode === "div-select" && (
            <button
              onClick={() => handleScrollClick("learning-objectives")}
              className="absolute top-4 right-4 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full z-10"
              title="Scroll everyone to this section"
            >
              <MapPin className="w-4 h-4" />
            </button>
          )}
          <h3 className="text-2xl font-bold mb-6 text-blue-400">
            What You'll Learn Today
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: MapPin,
                title: "Cultural Awareness",
                description:
                  "Understanding Malawian customs, traditions, and social norms",
              },
              {
                icon: Globe,
                title: "Travel Preparation",
                description:
                  "Practical tips for living and working in a different country",
              },
              {
                icon: Users,
                title: "Communication Skills",
                description:
                  "Cross-cultural communication and English language practice",
              },
              {
                icon: BookOpen,
                title: "Comparative Analysis",
                description:
                  "Comparing Chinese and Malawian cultures and systems",
              },
              {
                icon: GraduationCap,
                title: "Professional Development",
                description:
                  "Building skills for international career opportunities",
              },
              {
                icon: MapPin,
                title: "Interactive Learning",
                description:
                  "Engaging activities and discussions to reinforce learning",
              },
            ].map((objective, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-slate-600"
              >
                <objective.icon className="w-8 h-8 text-blue-400 mx-auto mb-4" />
                <h4 className="text-lg font-semibold mb-2 text-white">
                  {objective.title}
                </h4>
                <p className="text-gray-300 text-sm">{objective.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Interactive Features */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="bg-gradient-to-r from-purple-800/50 to-blue-800/50 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30">
            <h3 className="text-2xl font-bold mb-4 text-purple-400">
              Interactive Features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div className="flex items-start">
                <Users className="w-6 h-6 text-green-400 mr-3 mt-1" />
                <div>
                  <h4 className="font-semibold text-white mb-2">
                    Team-Based Learning
                  </h4>
                  <p className="text-gray-300 text-sm">
                    Join a team and participate in interactive quizzes and
                    discussions
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <BookOpen className="w-6 h-6 text-blue-400 mr-3 mt-1" />
                <div>
                  <h4 className="font-semibold text-white mb-2">
                    Q&A Sessions
                  </h4>
                  <p className="text-gray-300 text-sm">
                    Ask questions and get immediate feedback from your
                    instructor
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Globe className="w-6 h-6 text-teal-400 mr-3 mt-1" />
                <div>
                  <h4 className="font-semibold text-white mb-2">
                    Cultural Comparisons
                  </h4>
                  <p className="text-gray-300 text-sm">
                    Compare and contrast Chinese and Malawian cultures
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <GraduationCap className="w-6 h-6 text-purple-400 mr-3 mt-1" />
                <div>
                  <h4 className="font-semibold text-white mb-2">
                    Practical Skills
                  </h4>
                  <p className="text-gray-300 text-sm">
                    Learn real-world skills for international experiences
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div variants={itemVariants}>
          <p className="text-lg text-gray-300 mb-4">
            Ready to explore Malawi's rich culture and prepare for your
            international journey?
          </p>
          <p className="text-sm text-gray-400">
            Navigate through the presentation or participate in the interactive
            quiz
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
