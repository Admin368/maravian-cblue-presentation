"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
  MapPin,
  Target,
  HelpCircle,
  CheckCircle,
  XCircle,
  Plane,
  DollarSign,
  MessageCircle,
  Users,
  Shield,
  Car,
  UtensilsCrossed,
  Landmark,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useSocket } from "@/hooks/use-socket";
import { Button } from "@/components/ui/button";

interface MalawiSlide {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  images: string[];
  keyPoints: string[];
  practicalTips: string[];
  culturalComparisons: string[];
  questions?: Array<{
    question: string;
    answer: string;
    type: "comprehension" | "comparison" | "practical" | "critical";
  }>;
}

interface Team {
  score: number;
  members: Array<{ id: string; name: string }>;
}

interface MalawiGameState {
  isActive: boolean;
  teams: Record<string, Team>;
  currentQuestion: {
    slideIndex: number;
    questionIndex: number;
    question: string;
    correctAnswer: string;
  } | null;
  currentAnswerer: {
    studentId: string;
    name: string;
    team: string;
    socketId: string;
  } | null;
  showAnswer: boolean;
}

interface MalawiSlideSectionProps {
  slide: MalawiSlide;
  gameState: MalawiGameState;
  isAdmin: boolean;
  onAskQuestion: (slideIndex: number, questionIndex: number) => void;
}

const getIconComponent = (iconName: string) => {
  const icons: Record<string, any> = {
    plane: Plane,
    dollar: DollarSign,
    message: MessageCircle,
    users: Users,
    shield: Shield,
    car: Car,
    utensils: UtensilsCrossed,
    landmark: Landmark,
    mappin: MapPin,
  };
  return icons[iconName] || MapPin;
};

export default function MalawiSlideSection({
  slide,
  gameState,
  isAdmin,
  onAskQuestion,
}: MalawiSlideSectionProps) {
  const [isAdmin_local, setIsAdmin_local] = useState(false);
  const [scrollMode, setScrollMode] = useState("none");
  const [focusedImageIndex, setFocusedImageIndex] = useState(0);
  const { socket } = useSocket();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const admin = urlParams.get("admin") === "true";
    setIsAdmin_local(admin);

    if (socket) {
      socket.on("malawi-scrollModeChange", (mode: string) => {
        setScrollMode(mode);
      });

      socket.on(
        "malawi-imageFocusChange",
        (data: { slideId: string; imageIndex: number }) => {
          if (data.slideId === slide.id) {
            setFocusedImageIndex(data.imageIndex);
          }
        }
      );

      return () => {
        socket.off("malawi-scrollModeChange");
        socket.off("malawi-imageFocusChange");
      };
    }
  }, [socket, slide.id]);

  const handleImageFocus = (index: number) => {
    setFocusedImageIndex(index);

    if (isAdmin_local) {
      socket?.emit("malawi-imageFocusChange", {
        slideId: slide.id,
        imageIndex: index,
      });
    }
  };

  const handleScrollClick = (elementId: string) => {
    if (isAdmin_local && scrollMode === "div-select") {
      socket?.emit("malawi-scrollToElement", elementId);

      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const IconComponent = getIconComponent(slide.icon);

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
    <div className="min-h-screen py-12">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-blue-500/20 p-3 rounded-lg mr-4">
              <IconComponent className="w-8 h-8 text-blue-400" />
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 text-transparent bg-clip-text">
              {slide.title}
            </h2>
          </div>
          <div className="flex items-center justify-center">
            <MapPin className="w-5 h-5 mr-2 text-blue-400" />
            <h3 className="text-2xl font-semibold text-white">
              {slide.subtitle}
            </h3>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Content Sections */}
          <motion.div variants={itemVariants} className="order-2 lg:order-1">
            <div className="space-y-8">
              {/* Key Points */}
              <div
                id={`${slide.id}-keypoints`}
                className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 relative"
              >
                {isAdmin_local && scrollMode === "div-select" && (
                  <button
                    onClick={() => handleScrollClick(`${slide.id}-keypoints`)}
                    className="absolute -top-3 -right-3 bg-blue-600 hover:bg-blue-700 text-white p-1 rounded-full z-10"
                    title="Scroll everyone to this section"
                  >
                    <Target className="w-4 h-4" />
                  </button>
                )}
                <div className="flex items-center mb-4">
                  <div className="bg-blue-500/20 p-2 rounded-lg mr-3">
                    <CheckCircle className="w-6 h-6 text-blue-400" />
                  </div>
                  <h4 className="text-xl font-semibold">Key Points</h4>
                </div>
                <ul className="space-y-2 text-gray-300">
                  {slide.keyPoints.map((point, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-400 mr-2">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Practical Tips */}
              <div
                id={`${slide.id}-tips`}
                className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 relative"
              >
                {isAdmin_local && scrollMode === "div-select" && (
                  <button
                    onClick={() => handleScrollClick(`${slide.id}-tips`)}
                    className="absolute -top-3 -right-3 bg-blue-600 hover:bg-blue-700 text-white p-1 rounded-full z-10"
                    title="Scroll everyone to this section"
                  >
                    <Target className="w-4 h-4" />
                  </button>
                )}
                <div className="flex items-center mb-4">
                  <div className="bg-green-500/20 p-2 rounded-lg mr-3">
                    <Target className="w-6 h-6 text-green-400" />
                  </div>
                  <h4 className="text-xl font-semibold">Practical Tips</h4>
                </div>
                <ul className="space-y-2 text-gray-300">
                  {slide.practicalTips.map((tip, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-400 mr-2">✓</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cultural Comparisons */}
              <div
                id={`${slide.id}-comparisons`}
                className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 relative"
              >
                {isAdmin_local && scrollMode === "div-select" && (
                  <button
                    onClick={() => handleScrollClick(`${slide.id}-comparisons`)}
                    className="absolute -top-3 -right-3 bg-blue-600 hover:bg-blue-700 text-white p-1 rounded-full z-10"
                    title="Scroll everyone to this section"
                  >
                    <Target className="w-4 h-4" />
                  </button>
                )}
                <div className="flex items-center mb-4">
                  <div className="bg-purple-500/20 p-2 rounded-lg mr-3">
                    <Users className="w-6 h-6 text-purple-400" />
                  </div>
                  <h4 className="text-xl font-semibold">
                    Cultural Comparisons
                  </h4>
                </div>
                <ul className="space-y-2 text-gray-300">
                  {slide.culturalComparisons.map((comparison, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-purple-400 mr-2">↔</span>
                      <span>{comparison}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Image Gallery */}
          <motion.div
            id={`${slide.id}-gallery`}
            variants={itemVariants}
            className="order-1 lg:order-2 relative"
          >
            {isAdmin_local && scrollMode === "div-select" && (
              <button
                onClick={() => handleScrollClick(`${slide.id}-gallery`)}
                className="absolute -top-3 -right-3 bg-blue-600 hover:bg-blue-700 text-white p-1 rounded-full z-10"
                title="Scroll everyone to this section"
              >
                <Target className="w-4 h-4" />
              </button>
            )}

            <div className="space-y-4">
              {/* Main focused image */}
              <div
                className="relative rounded-xl overflow-hidden"
                style={{ height: "400px" }}
              >
                <Image
                  src={slide.images[focusedImageIndex] || "/placeholder.svg"}
                  alt={`${slide.title} - ${slide.subtitle}`}
                  fill
                  className="object-cover transition-transform duration-500"
                />
                {isAdmin_local && (
                  <div className="absolute bottom-4 right-4 bg-blue-600/70 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                    Click thumbnails below to share images
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {slide.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {slide.images.slice(0, 8).map((image, index) => (
                    <div
                      key={index}
                      className={`relative rounded-xl overflow-hidden cursor-pointer ${
                        focusedImageIndex === index
                          ? "ring-2 ring-blue-500"
                          : ""
                      }`}
                      style={{ height: "90px" }}
                      onClick={() => handleImageFocus(index)}
                    >
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`${slide.title} thumbnail`}
                        fill
                        className="object-cover transition-transform hover:scale-105 duration-300"
                      />
                      {focusedImageIndex === index && (
                        <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                          <div className="bg-blue-600 rounded-full p-1">
                            <Target className="w-3 h-3 text-white" />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Questions Section for Admin and Game Mode */}
        {isAdmin && slide.questions && slide.questions.length > 0 && (
          <motion.div variants={itemVariants} className="mt-12">
            <div className="bg-gradient-to-r from-purple-800/50 to-blue-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30">
              <div className="flex items-center mb-6">
                <div className="bg-purple-500/20 p-2 rounded-lg mr-3">
                  <HelpCircle className="w-6 h-6 text-purple-400" />
                </div>
                <h4 className="text-xl font-semibold">Discussion Questions</h4>
                {gameState.isActive && (
                  <span className="ml-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm">
                    Game Active
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {slide.questions.map((q, index) => (
                  <div
                    key={index}
                    className="bg-slate-800/50 p-4 rounded-lg border border-slate-600"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-sm text-gray-300 flex-1">
                        {q.question}
                      </p>
                      {gameState.isActive && (
                        <Button
                          onClick={() => onAskQuestion(1, index)} // Assuming slide index logic
                          size="sm"
                          className="ml-2 bg-green-600 hover:bg-green-700"
                        >
                          Ask
                        </Button>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          q.type === "comprehension"
                            ? "bg-blue-500/20 text-blue-400"
                            : q.type === "comparison"
                            ? "bg-purple-500/20 text-purple-400"
                            : q.type === "practical"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-orange-500/20 text-orange-400"
                        }`}
                      >
                        {q.type}
                      </span>
                      {!gameState.isActive && (
                        <span className="text-xs text-gray-500">
                          Answer: {q.answer}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Current Question Display */}
        {gameState.currentQuestion && (
          <motion.div
            variants={itemVariants}
            className="mt-8 bg-yellow-600/20 border border-yellow-500/30 rounded-xl p-6"
          >
            <div className="flex items-center mb-4">
              <HelpCircle className="w-6 h-6 text-yellow-400 mr-3" />
              <h4 className="text-xl font-semibold text-yellow-400">
                Current Question
              </h4>
            </div>
            <p className="text-lg mb-4">{gameState.currentQuestion.question}</p>

            {gameState.currentAnswerer && (
              <div className="bg-blue-600/20 p-4 rounded-lg mb-4">
                <p className="text-blue-400">
                  <strong>{gameState.currentAnswerer.name}</strong> from{" "}
                  <strong>{gameState.currentAnswerer.team}</strong> is
                  answering...
                </p>
              </div>
            )}

            {gameState.showAnswer && (
              <div className="bg-green-600/20 p-4 rounded-lg">
                <p className="text-green-400">
                  <strong>Answer:</strong>{" "}
                  {gameState.currentQuestion.correctAnswer}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
