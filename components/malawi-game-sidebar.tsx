"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Trophy,
  Users,
  Play,
  Pause,
  HelpCircle,
  CheckCircle,
  XCircle,
  Crown,
  Star,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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

interface MalawiSlide {
  id: string;
  title: string;
  questions?: Array<{
    question: string;
    answer: string;
    type: "comprehension" | "comparison" | "practical" | "critical";
  }>;
}

interface MalawiGameSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  gameState: MalawiGameState;
  isAdmin: boolean;
  currentSlide: number;
  slides: MalawiSlide[];
  onToggleGame: () => void;
  onAskQuestion: (slideIndex: number, questionIndex: number) => void;
  onApproveAnswer: (isCorrect: boolean, points?: number) => void;
  onClearAnswerer: () => void;
}

export default function MalawiGameSidebar({
  isOpen,
  onClose,
  gameState,
  isAdmin,
  currentSlide,
  slides,
  onToggleGame,
  onAskQuestion,
  onApproveAnswer,
  onClearAnswerer,
}: MalawiGameSidebarProps) {
  const [selectedSlide, setSelectedSlide] = useState(currentSlide);

  // Get sorted teams by score
  const sortedTeams = Object.entries(gameState.teams).sort(
    ([, a], [, b]) => b.score - a.score
  );

  const currentSlideData = slides[selectedSlide - 1]; // -1 because slide 0 is welcome

  const getQuestionTypeColor = (type: string) => {
    switch (type) {
      case "comprehension":
        return "bg-blue-500/20 text-blue-400";
      case "comparison":
        return "bg-purple-500/20 text-purple-400";
      case "practical":
        return "bg-green-500/20 text-green-400";
      case "critical":
        return "bg-orange-500/20 text-orange-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-96 bg-slate-900/95 backdrop-blur-lg border-l border-slate-700 z-50 overflow-y-auto"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <Trophy className="w-6 h-6 text-yellow-500 mr-2" />
                  <h2 className="text-xl font-bold text-white">
                    Questions Controls
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Game Status */}
              <Card className="p-4 mb-6 bg-slate-800/50 border-slate-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div
                      className={`w-3 h-3 rounded-full mr-2 ${
                        gameState.isActive ? "bg-green-500" : "bg-red-500"
                      }`}
                    />
                    <span className="text-white font-medium">
                      Questions {gameState.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  {isAdmin && (
                    <Button
                      onClick={onToggleGame}
                      size="sm"
                      className={
                        gameState.isActive
                          ? "bg-red-600 hover:bg-red-700"
                          : "bg-green-600 hover:bg-green-700"
                      }
                    >
                      {gameState.isActive ? (
                        <>
                          <Pause className="w-4 h-4 mr-1" />
                          Stop
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-1" />
                          Start
                        </>
                      )}
                    </Button>
                  )}
                </div>

                {/* Current Question Display */}
                {gameState.currentQuestion && (
                  <div className="bg-yellow-600/20 border border-yellow-500/30 rounded-lg p-3 mb-4">
                    <div className="flex items-center mb-2">
                      <HelpCircle className="w-4 h-4 text-yellow-400 mr-2" />
                      <span className="text-yellow-400 font-medium">
                        Active Question
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 mb-3">
                      {gameState.currentQuestion.question}
                    </p>

                    {gameState.currentAnswerer && (
                      <div className="bg-blue-600/20 p-2 rounded mb-3">
                        <p className="text-blue-400 text-sm">
                          <strong>{gameState.currentAnswerer.name}</strong> from{" "}
                          <strong>{gameState.currentAnswerer.team}</strong> is
                          answering
                        </p>
                        {isAdmin && (
                          <div className="flex space-x-2 mt-2">
                            <Button
                              onClick={() => onApproveAnswer(true, 1)}
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Correct (1pt)
                            </Button>
                            <Button
                              onClick={() => onApproveAnswer(false)}
                              size="sm"
                              className="bg-red-600 hover:bg-red-700"
                            >
                              <XCircle className="w-3 h-3 mr-1" />
                              Wrong
                            </Button>
                            <Button
                              onClick={onClearAnswerer}
                              size="sm"
                              variant="outline"
                              className="border-gray-600"
                            >
                              Clear
                            </Button>
                          </div>
                        )}
                      </div>
                    )}

                    {gameState.showAnswer && (
                      <div className="bg-green-600/20 p-2 rounded">
                        <p className="text-green-400 text-sm">
                          <strong>Answer:</strong>{" "}
                          {gameState.currentQuestion.correctAnswer}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </Card>

              {/* Team Scores */}
              <Card className="p-4 mb-6 bg-slate-800/50 border-slate-700">
                <div className="flex items-center mb-4">
                  <Users className="w-5 h-5 text-blue-400 mr-2" />
                  <h3 className="text-lg font-semibold text-white">
                    Team Scores
                  </h3>
                </div>
                <div className="space-y-3">
                  {sortedTeams.map(([teamName, team], index) => (
                    <div
                      key={teamName}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        index === 0
                          ? "bg-yellow-500/20 border border-yellow-500/30"
                          : "bg-slate-700/50"
                      }`}
                    >
                      <div className="flex items-center">
                        {index === 0 && (
                          <Crown className="w-4 h-4 text-yellow-500 mr-2" />
                        )}
                        {index === 1 && (
                          <Star className="w-4 h-4 text-gray-400 mr-2" />
                        )}
                        {index === 2 && (
                          <Star className="w-4 h-4 text-amber-600 mr-2" />
                        )}
                        <span className="font-medium text-white">
                          {teamName}
                        </span>
                        <span className="text-xs text-gray-400 ml-2">
                          ({team.members.length} members)
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-bold text-lg text-white">
                          {team.score}
                        </span>
                        <span className="text-sm text-gray-400 ml-1">pts</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Question Selection */}
              {isAdmin && gameState.isActive && (
                <Card className="p-4 bg-slate-800/50 border-slate-700">
                  <div className="flex items-center mb-4">
                    <Target className="w-5 h-5 text-purple-400 mr-2" />
                    <h3 className="text-lg font-semibold text-white">
                      Ask Questions
                    </h3>
                  </div>

                  {/* Slide Selector */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Select Slide:
                    </label>
                    <select
                      value={selectedSlide}
                      onChange={(e) => setSelectedSlide(Number(e.target.value))}
                      className="w-full p-2 bg-slate-700 text-white rounded-lg border border-slate-600"
                    >
                      {slides.map((slide, index) => (
                        <option key={slide.id} value={index + 1}>
                          {index + 1}. {slide.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Questions from Selected Slide */}
                  {currentSlideData && currentSlideData.questions && (
                    <div className="space-y-3 text-white">
                      <h4 className="text-sm font-medium text-gray-300">
                        Available Questions:
                      </h4>
                      {currentSlideData.questions.map((question, index) => (
                        <div
                          key={index}
                          className="bg-slate-700/50 p-3 rounded-lg border border-slate-600"
                        >
                          <p className="text-sm mb-2">{question.question}</p>
                          <div className="flex items-center justify-between">
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${getQuestionTypeColor(
                                question.type
                              )}`}
                            >
                              {question.type}
                            </span>
                            <Button
                              onClick={() =>
                                onAskQuestion(selectedSlide, index)
                              }
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              <HelpCircle className="w-3 h-3 mr-1" />
                              Ask
                            </Button>
                          </div>
                          <div className="mt-2 text-xs text-gray-500">
                            Answer: {question.answer}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {(!currentSlideData ||
                    !currentSlideData.questions ||
                    currentSlideData.questions.length === 0) && (
                    <div className="text-center text-gray-400 py-4">
                      No questions available for this slide
                    </div>
                  )}
                </Card>
              )}

              {/* Join Instructions for Students */}
              {!isAdmin && (
                <Card className="p-4 bg-blue-800/20 border-blue-500/30">
                  <div className="text-center">
                    <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Join the Game
                    </h3>
                    <p className="text-sm text-gray-300 mb-4">
                      Scan the QR code or go to the student page to join a team
                      and answer questions!
                    </p>
                    <Button
                      onClick={() => window.open("/malawi/student", "_blank")}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Open Student Page
                    </Button>
                  </div>
                </Card>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
