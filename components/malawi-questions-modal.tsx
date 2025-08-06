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
  ChevronLeft,
  ChevronRight,
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
  oneStudentPerQuestion?: boolean;
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

interface MalawiQuestionsModalProps {
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
  onToggleOneStudentMode: (enabled: boolean) => void;
}

export default function MalawiQuestionsModal({
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
  onToggleOneStudentMode,
}: MalawiQuestionsModalProps) {
  const [selectedSlide, setSelectedSlide] = useState(currentSlide);

  // Get sorted teams by score
  const sortedTeams = Object.entries(gameState.teams).sort(
    ([, a], [, b]) => b.score - a.score
  );

  const currentSlideData = slides[selectedSlide - 1]; // -1 because slide 0 is welcome

  const getQuestionTypeColor = (type: string) => {
    switch (type) {
      case "comprehension":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "comparison":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "practical":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "critical":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getQuestionTypeIcon = (type: string) => {
    switch (type) {
      case "comprehension":
        return <HelpCircle className="w-4 h-4" />;
      case "comparison":
        return <Target className="w-4 h-4" />;
      case "practical":
        return <Star className="w-4 h-4" />;
      case "critical":
        return <Crown className="w-4 h-4" />;
      default:
        return <HelpCircle className="w-4 h-4" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
        >
          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="w-full h-full max-w-7xl max-h-[95vh] bg-slate-900/95 backdrop-blur-lg border border-slate-700 rounded-xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-700 bg-slate-800/50">
              <div className="flex items-center">
                <Trophy className="w-8 h-8 text-yellow-500 mr-3" />
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Questions Control Center
                  </h2>
                  <p className="text-gray-400">
                    Manage questions and team responses
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-3 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 h-[calc(100%-5rem)] overflow-auto">
              {/* Left Column: Game Status & Current Question */}
              <div className="space-y-6">
                {/* Game Status Card */}
                <Card className="p-6 bg-slate-800/50 border-slate-700">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div
                        className={`w-4 h-4 rounded-full mr-3 ${
                          gameState.isActive ? "bg-green-500" : "bg-red-500"
                        }`}
                      />
                      <span className="text-white font-medium text-lg">
                        Questions {gameState.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    {isAdmin && (
                      <Button
                        onClick={onToggleGame}
                        size="lg"
                        className={
                          gameState.isActive
                            ? "bg-red-600 hover:bg-red-700"
                            : "bg-green-600 hover:bg-green-700"
                        }
                      >
                        {gameState.isActive ? (
                          <>
                            <Pause className="w-5 h-5 mr-2" />
                            Stop Questions
                          </>
                        ) : (
                          <>
                            <Play className="w-5 h-5 mr-2" />
                            Start Questions
                          </>
                        )}
                      </Button>
                    )}
                  </div>

                  {/* One Student Per Question Toggle */}
                  {isAdmin && (
                    <div className="mt-4 pt-4 border-t border-slate-600">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-white font-medium">
                            One Student Per Question
                          </span>
                          <p className="text-gray-400 text-sm mt-1">
                            Only allow one student to answer each question
                          </p>
                        </div>
                        <Button
                          onClick={() =>
                            onToggleOneStudentMode(
                              !gameState.oneStudentPerQuestion
                            )
                          }
                          variant={
                            gameState.oneStudentPerQuestion
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          className={
                            gameState.oneStudentPerQuestion
                              ? "bg-blue-600 hover:bg-blue-700"
                              : "border-gray-600 text-gray-300 hover:bg-gray-800"
                          }
                        >
                          {gameState.oneStudentPerQuestion
                            ? "Enabled"
                            : "Disabled"}
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>

                {/* Current Question */}
                {gameState.currentQuestion && (
                  <Card className="p-6 bg-yellow-600/10 border-yellow-500/30">
                    <div className="flex items-center mb-4">
                      <HelpCircle className="w-6 h-6 text-yellow-400 mr-3" />
                      <span className="text-yellow-400 font-medium text-lg">
                        Active Question
                      </span>
                    </div>
                    <div className="bg-slate-800/50 p-4 rounded-lg mb-4">
                      <p className="text-white text-lg leading-relaxed">
                        {gameState.currentQuestion.question}
                      </p>
                    </div>

                    {gameState.currentAnswerer && (
                      <div className="bg-blue-600/20 border border-blue-500/30 p-4 rounded-lg mb-4">
                        <p className="text-blue-400 mb-3">
                          <strong className="text-white">
                            {gameState.currentAnswerer.name}
                          </strong>{" "}
                          from{" "}
                          <strong className="text-white">
                            {gameState.currentAnswerer.team}
                          </strong>{" "}
                          is answering...
                        </p>
                        {isAdmin && (
                          <div className="flex space-x-3">
                            <Button
                              onClick={() => onApproveAnswer(true, 10)}
                              className="bg-green-600 hover:bg-green-700 flex-1"
                              size="lg"
                            >
                              <CheckCircle className="w-5 h-5 mr-2" />
                              Correct (10 pts)
                            </Button>
                            <Button
                              onClick={() => onApproveAnswer(false)}
                              variant="destructive"
                              className="flex-1"
                              size="lg"
                            >
                              <XCircle className="w-5 h-5 mr-2" />
                              Incorrect
                            </Button>
                          </div>
                        )}
                      </div>
                    )}

                    {gameState.showAnswer && (
                      <div className="bg-green-600/20 border border-green-500/30 p-4 rounded-lg mb-4">
                        <div className="flex items-center mb-2">
                          <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                          <span className="text-green-400 font-medium">
                            Correct Answer:
                          </span>
                        </div>
                        <p className="text-white">
                          {gameState.currentQuestion.correctAnswer}
                        </p>
                      </div>
                    )}

                    {isAdmin && gameState.currentAnswerer && (
                      <Button
                        onClick={onClearAnswerer}
                        variant="outline"
                        className="w-full"
                        size="lg"
                      >
                        Clear Current Answerer
                      </Button>
                    )}
                  </Card>
                )}

                {/* Teams Leaderboard */}
                <Card className="p-6 bg-slate-800/50 border-slate-700">
                  <div className="flex items-center mb-4">
                    <Trophy className="w-6 h-6 text-yellow-500 mr-3" />
                    <span className="text-white font-medium text-lg">
                      Team Scores
                    </span>
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
                            <Crown className="w-5 h-5 text-yellow-400 mr-2" />
                          )}
                          <span className="font-medium text-white">
                            {teamName}
                          </span>
                          <span className="text-gray-400 text-sm ml-2">
                            ({team.members.length} members)
                          </span>
                        </div>
                        <span className="font-bold text-xl text-white">
                          {team.score}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Middle Column: Slide Selector */}
              <div className="space-y-6">
                <Card className="p-6 bg-slate-800/50 border-slate-700">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-white font-medium text-lg">
                      Select Slide
                    </span>
                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={() =>
                          setSelectedSlide(Math.max(1, selectedSlide - 1))
                        }
                        variant="outline"
                        size="sm"
                        disabled={selectedSlide <= 1}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <span className="text-gray-400 px-3">
                        {selectedSlide} / {slides.length}
                      </span>
                      <Button
                        onClick={() =>
                          setSelectedSlide(
                            Math.min(slides.length, selectedSlide + 1)
                          )
                        }
                        variant="outline"
                        size="sm"
                        disabled={selectedSlide >= slides.length}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                    {slides.map((slide, index) => (
                      <button
                        key={slide.id}
                        onClick={() => setSelectedSlide(index + 1)}
                        className={`p-3 rounded-lg text-left transition-colors ${
                          selectedSlide === index + 1
                            ? "bg-blue-600 text-white"
                            : "bg-slate-700/50 text-gray-300 hover:bg-slate-700"
                        }`}
                      >
                        <div className="text-xs font-medium mb-1">
                          Slide {index + 1}
                        </div>
                        <div className="text-xs truncate">{slide.title}</div>
                      </button>
                    ))}
                  </div>
                </Card>

                {/* Current Slide Info */}
                {currentSlideData && (
                  <Card className="p-6 bg-slate-800/50 border-slate-700">
                    <h3 className="text-white font-medium text-lg mb-2">
                      {currentSlideData.title}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Slide {selectedSlide} •{" "}
                      {currentSlideData.questions?.length || 0} questions
                      available
                    </p>
                  </Card>
                )}
              </div>

              {/* Right Column: Questions */}
              <div className="space-y-6">
                <Card className="p-6 bg-slate-800/50 border-slate-700">
                  <div className="flex items-center mb-4">
                    <HelpCircle className="w-6 h-6 text-blue-400 mr-3" />
                    <span className="text-white font-medium text-lg">
                      Available Questions
                    </span>
                  </div>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {currentSlideData?.questions?.map((question, index) => {
                      const isCurrentQuestion =
                        gameState.currentQuestion?.slideIndex ===
                          selectedSlide &&
                        gameState.currentQuestion?.questionIndex === index;

                      return (
                        <div
                          key={index}
                          className={`border rounded-lg p-4 relative ${
                            isCurrentQuestion
                              ? "bg-yellow-500/20 border-yellow-400 ring-2 ring-yellow-400/50"
                              : getQuestionTypeColor(question.type)
                          }`}
                        >
                          {isCurrentQuestion && (
                            <div className="absolute top-2 right-2">
                              <span className="bg-yellow-500 text-black text-xs px-2 py-1 rounded-full font-bold">
                                ACTIVE
                              </span>
                            </div>
                          )}
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center">
                              {getQuestionTypeIcon(question.type)}
                              <span className="ml-2 text-sm font-medium capitalize">
                                {question.type}
                              </span>
                            </div>
                            <span className="text-xs px-2 py-1 bg-black/20 rounded">
                              Q{index + 1}
                            </span>
                          </div>
                          <p className="text-sm mb-3 leading-relaxed">
                            {question.question}
                          </p>
                          <div className="bg-black/20 p-2 rounded mb-3">
                            <span className="text-xs font-medium">Answer:</span>
                            <p className="text-sm mt-1">{question.answer}</p>
                          </div>
                          {isAdmin && (
                            <Button
                              onClick={() =>
                                onAskQuestion(selectedSlide, index)
                              }
                              className="w-full bg-blue-600 hover:bg-blue-700"
                              size="sm"
                              disabled={!gameState.isActive}
                            >
                              {gameState.currentQuestion !== null
                                ? "Replace Current Question"
                                : "Ask This Question"}
                            </Button>
                          )}
                        </div>
                      );
                    }) || (
                      <div className="text-center py-8">
                        <HelpCircle className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                        <p className="text-gray-400">
                          No questions available for this slide
                        </p>
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
