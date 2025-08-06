"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Monitor, GraduationCap, Globe } from "lucide-react";

export default function GameHomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'url(\'data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.4"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\')',
          }}
        ></div>
        {/* Floating elements */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white rounded-full opacity-10"
            style={{
              width: Math.random() * 8 + 4,
              height: Math.random() * 8 + 4,
              left: Math.random() * 100 + "%",
              top: Math.random() * 100 + "%",
            }}
            animate={{
              y: [-20, -100],
              x: [0, Math.random() * 100 - 50],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: Math.random() * 4 + 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <h1 className="text-7xl font-bold mb-6 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 bg-clip-text text-transparent">
              🌍 Guess the Country! 🏛️
            </h1>
            <p className="text-2xl text-gray-300 max-w-3xl mx-auto">
              An exciting educational game where students identify famous
              landmarks and learn about countries around the world!
            </p>
          </motion.div>

          {/* Game modes */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Teacher/Presentation Mode */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <Card className="p-8 bg-black/40 backdrop-blur-sm border-2 border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 group h-full">
                <div className="text-center">
                  <div className="mb-6 relative">
                    <div className="w-24 h-24 mx-auto bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Monitor className="w-12 h-12 text-white" />
                    </div>
                    <motion.div
                      className="absolute -top-2 -right-2 bg-yellow-500 text-black text-xs px-2 py-1 rounded-full font-bold"
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      TEACHER
                    </motion.div>
                  </div>

                  <h2 className="text-3xl font-bold mb-4 text-purple-400">
                    Presentation Mode
                  </h2>
                  <p className="text-gray-300 mb-6 text-lg">
                    Control the game, display questions on the big screen, and
                    manage team scores. Perfect for classroom presentations!
                  </p>

                  <div className="space-y-3 mb-6 text-left">
                    <div className="flex items-center text-sm text-gray-400">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      Load and display landmark questions
                    </div>
                    <div className="flex items-center text-sm text-gray-400">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      Manage student answers and scoring
                    </div>
                    <div className="flex items-center text-sm text-gray-400">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      Real-time leaderboard display
                    </div>
                    <div className="flex items-center text-sm text-gray-400">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      Full teacher control panel
                    </div>
                  </div>

                  <Link href="/game/teacher">
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg py-3 group-hover:scale-105 transition-transform duration-200">
                      <GraduationCap className="w-5 h-5 mr-2" />
                      Start as Teacher
                    </Button>
                  </Link>
                </div>
              </Card>
            </motion.div>

            {/* Student Mode */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <Card className="p-8 bg-black/40 backdrop-blur-sm border-2 border-blue-500/30 hover:border-blue-400/50 transition-all duration-300 group h-full">
                <div className="text-center">
                  <div className="mb-6 relative">
                    <div className="w-24 h-24 mx-auto bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Users className="w-12 h-12 text-white" />
                    </div>
                    <motion.div
                      className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      STUDENT
                    </motion.div>
                  </div>

                  <h2 className="text-3xl font-bold mb-4 text-blue-400">
                    Student Mode
                  </h2>
                  <p className="text-gray-300 mb-6 text-lg">
                    Join your team, compete with classmates, and test your
                    geography knowledge! Answer first to get the chance to
                    speak.
                  </p>

                  <div className="space-y-3 mb-6 text-left">
                    <div className="flex items-center text-sm text-gray-400">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      Join one of 5 competitive teams
                    </div>
                    <div className="flex items-center text-sm text-gray-400">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      Quick-tap to request answering
                    </div>
                    <div className="flex items-center text-sm text-gray-400">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      Track your team's progress
                    </div>
                    <div className="flex items-center text-sm text-gray-400">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      Real-time game participation
                    </div>
                  </div>

                  <Link href="/game/student">
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-lg py-3 group-hover:scale-105 transition-transform duration-200">
                      <Users className="w-5 h-5 mr-2" />
                      Join as Student
                    </Button>
                  </Link>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Game Features */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="mt-16"
          >
            <Card className="p-8 bg-gradient-to-r from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-gray-600/30">
              <h3 className="text-3xl font-bold mb-6 text-center text-yellow-400 flex items-center justify-center">
                <Globe className="w-8 h-8 mr-3" />
                Game Features
              </h3>

              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-4xl mb-3">🏛️</div>
                  <h4 className="text-xl font-bold mb-2 text-purple-400">
                    Famous Landmarks
                  </h4>
                  <p className="text-white-400">
                    Explore iconic landmarks from around the world including the
                    Eiffel Tower, Great Wall of China, Machu Picchu, and many
                    more!
                  </p>
                </div>

                <div>
                  <div className="text-4xl mb-3">🎯</div>
                  <h4 className="text-xl font-bold mb-2 text-blue-400">
                    Team Competition
                  </h4>
                  <p className="text-white-400">
                    5 teams compete for points. Get 1 point for correct country,
                    2 points for detailed explanations about the landmark or
                    country!
                  </p>
                </div>

                <div>
                  <div className="text-4xl mb-3">⚡</div>
                  <h4 className="text-xl font-bold mb-2 text-green-400">
                    Real-time Interaction
                  </h4>
                  <p className="text-white-400">
                    Fast-paced gameplay with instant feedback, live
                    leaderboards, and synchronized screens for the ultimate
                    classroom experience!
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Instructions */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="mt-12"
          >
            <Card className="p-6 bg-yellow-500/10 backdrop-blur-sm border border-yellow-500/30">
              <h4 className="text-2xl font-bold mb-4 text-yellow-400 text-center">
                🚀 Quick Start Guide
              </h4>
              <div className="grid md:grid-cols-2 gap-6 text-left">
                <div>
                  <h5 className="font-bold text-lg mb-3 text-purple-400">
                    For Teachers:
                  </h5>
                  <ol className="space-y-2 text-gray-300">
                    <li>1. Click "Start as Teacher"</li>
                    <li>2. Load questions from the landmark database</li>
                    <li>3. Start the game and display first question</li>
                    <li>4. Approve/reject student answers and award points</li>
                    <li>5. Continue until all questions are answered!</li>
                  </ol>
                </div>
                <div>
                  <h5 className="font-bold text-lg mb-3 text-blue-400">
                    For Students:
                  </h5>
                  <ol className="space-y-2 text-gray-300">
                    <li>1. Click "Join as Student"</li>
                    <li>2. Enter your name and choose a team</li>
                    <li>3. Wait for the game to start</li>
                    <li>4. Press "I Have Answer" to be selected</li>
                    <li>5. Give your answer when chosen!</li>
                  </ol>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Back to main presentation link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            className="mt-12"
          >
            <Link href="/">
              <Button
                variant="outline"
                className="text-gray-400 border-gray-600 hover:bg-gray-700"
              >
                ← Back to Main Presentation
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
