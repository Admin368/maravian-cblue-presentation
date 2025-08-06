"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSocket } from "@/hooks/use-socket";
import { Crown, Users, MapPin, Clock, Trophy, QrCode } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Team {
  score: number;
  members: Array<{ id: string; name: string }>;
}

interface GameState {
  isActive: boolean;
  currentQuestion: number;
  currentLandmark: any;
  questions: any[];
  teams: Record<string, Team>;
  currentAnswerer: {
    studentId: string;
    name: string;
    team: string;
    socketId: string;
  } | null;
  showAnswer: boolean;
}

interface QuestionData {
  landmark: {
    country: string;
    name: string;
    image_url: string;
  };
  questionNumber: number;
  totalQuestions: number;
}

interface AnswerLog {
  id: string;
  studentName: string;
  team: string;
  country: string;
  points: number;
  isCorrect: boolean;
  timestamp: Date;
  questionNumber: number;
}

export default function PresentationPage() {
  const [gameState, setGameState] = useState<GameState>({
    isActive: false,
    currentQuestion: 0,
    currentLandmark: null,
    questions: [],
    teams: {},
    currentAnswerer: null,
    showAnswer: false,
  });

  const [currentQuestion, setCurrentQuestion] = useState<QuestionData | null>(
    null
  );
  const [showResults, setShowResults] = useState(false);
  const [gameResults, setGameResults] = useState<any>(null);
  const [showQRCode, setShowQRCode] = useState(false);
  const [answerLog, setAnswerLog] = useState<AnswerLog[]>([]);

  const { socket } = useSocket();

  useEffect(() => {
    if (socket) {
      // Game event listeners
      socket.on("game-state", (state: GameState) => {
        setGameState(state);
      });

      socket.on("teams-updated", (teams: Record<string, Team>) => {
        setGameState((prev) => ({ ...prev, teams }));
      });

      socket.on("question-display", (questionData: QuestionData) => {
        setCurrentQuestion(questionData);
        setShowResults(false);
      });

      socket.on("student-answering", (answerer: any) => {
        setGameState((prev) => ({ ...prev, currentAnswerer: answerer }));
      });

      socket.on("answer-result", (result: any) => {
        setGameState((prev) => ({
          ...prev,
          teams: result.teams,
          showAnswer: true,
        }));

        // Add to answer log
        if (result.answerer && currentQuestion) {
          const logEntry: AnswerLog = {
            id: Date.now().toString(),
            studentName: result.answerer.name,
            team: result.answerer.team,
            country: currentQuestion.landmark.country,
            points: result.points || 0,
            isCorrect: result.isCorrect,
            timestamp: new Date(),
            questionNumber: currentQuestion.questionNumber,
          };
          setAnswerLog((prev) => [logEntry, ...prev.slice(0, 9)]); // Keep last 10 entries
        }
      });

      socket.on("game-finished", (results: any) => {
        setGameResults(results);
        setShowResults(true);
      });

      socket.on("answerer-cleared", () => {
        setGameState((prev) => ({ ...prev, currentAnswerer: null }));
      });

      socket.on("game-status-change", (isActive: boolean) => {
        setGameState((prev) => ({ ...prev, isActive }));
      });

      socket.on("show-qr-code", (show: boolean) => {
        setShowQRCode(show);
      });

      return () => {
        socket.off("game-state");
        socket.off("teams-updated");
        socket.off("question-display");
        socket.off("student-answering");
        socket.off("answer-result");
        socket.off("game-finished");
        socket.off("answerer-cleared");
        socket.off("game-status-change");
        socket.off("show-qr-code");
      };
    }
  }, [socket, currentQuestion]);

  // Get sorted teams for leaderboard
  const sortedTeams = Object.entries(gameState.teams)
    .sort(([, a], [, b]) => b.score - a.score)
    .map(([name, data]) => ({ name, ...data }))
    .slice(0, 8); // Show top 8 teams

  return (
    <div className="h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'url(\'data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.4"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\')',
          }}
        ></div>
      </div>

      <div className="h-full p-4 relative z-10 grid grid-rows-[auto,1fr,300px] gap-4">
        {/* Header */}
        <div className="text-center">
          <motion.h1
            className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
          >
            🌍 Guess the Country! 🏛️
          </motion.h1>
        </div>

        {/* Main Content - 3 Columns */}
        <div className="grid grid-cols-12 gap-4 min-h-0">
          {/* Left Column - Leaderboard */}
          <div className="col-span-3">
            <Card className="h-full p-4 bg-black/40 backdrop-blur-sm border-2 border-purple-500/30 overflow-hidden">
              <h3 className="text-xl font-bold mb-4 text-purple-400 flex items-center">
                <Crown className="w-5 h-5 mr-2" />
                Leaderboard
              </h3>
              <div
                className="space-y-2 overflow-y-auto"
                style={{ maxHeight: "calc(100% - 60px)" }}
              >
                {sortedTeams.map((team, index) => (
                  <motion.div
                    key={team.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className={`flex justify-between items-center p-3 rounded-lg ${
                      index === 0
                        ? "bg-gradient-to-r from-yellow-500/30 to-orange-500/30 border border-yellow-500/50"
                        : "bg-gray-700/30"
                    }`}
                  >
                    <div className="flex items-center min-w-0">
                      <span className="text-lg mr-2 flex-shrink-0 text-white">
                        {index === 0
                          ? "👑"
                          : index === 1
                          ? "🥈"
                          : index === 2
                          ? "🥉"
                          : `${index + 1}.`}
                      </span>
                      <div className="min-w-0">
                        <div className="font-bold truncate text-white">
                          {team.name}
                        </div>
                        <div className="text-xs text-gray-200 flex items-center">
                          <Users className="w-3 h-3 mr-1" />
                          {team.members.length}
                        </div>
                      </div>
                    </div>
                    <div className="text-lg font-bold text-yellow-400 flex-shrink-0">
                      {team.score}
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </div>

          {/* Center Column - Main Question Display */}
          <div className="col-span-6">
            <Card className="h-full p-6 bg-black/40 backdrop-blur-sm border-2 border-purple-500/30">
              <AnimatePresence mode="wait">
                {showQRCode ? (
                  <motion.div
                    key="qr-code"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="h-full flex flex-col items-center justify-center text-center"
                  >
                    <QrCode className="w-24 h-24 mb-6 text-blue-400" />
                    <h2 className="text-3xl font-bold mb-4 text-blue-400">
                      Join the Game!
                    </h2>
                    <div className="text-xl text-gray-300 mb-6">
                      Scan QR code or visit:
                    </div>
                    <div className="text-2xl font-bold text-yellow-400 bg-black/50 p-4 rounded-lg">
                      {typeof window !== "undefined"
                        ? window.location.origin
                        : ""}
                      /game/student
                    </div>
                    {/* QR Code placeholder - you can integrate a real QR code library */}
                    <div className="mt-6 w-48 h-48 bg-white rounded-lg flex items-center justify-center">
                      <div className="text-black font-bold">QR CODE</div>
                    </div>
                  </motion.div>
                ) : showResults && gameResults ? (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="h-full flex flex-col items-center justify-center text-center text-white"
                  >
                    <Crown className="w-20 h-20 mb-6 text-yellow-300" />
                    <h2 className="text-4xl font-bold mb-6">Game Over!</h2>
                    <div className="text-3xl mb-4">
                      🏆 Winner:{" "}
                      <span className="font-bold text-yellow-400">
                        {gameResults.winner.name}
                      </span>
                    </div>
                    <div className="text-2xl">
                      Final Score:{" "}
                      <span className="font-bold text-yellow-400">
                        {gameResults.winner.score} points
                      </span>
                    </div>
                  </motion.div>
                ) : currentQuestion ? (
                  <motion.div
                    key="question"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    className="h-full flex flex-col"
                  >
                    <div className="mb-4">
                      <div className="text-lg text-gray-300 mb-2 text-center">
                        Question {currentQuestion.questionNumber} of{" "}
                        {currentQuestion.totalQuestions}
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                          style={{
                            width: `${
                              (currentQuestion.questionNumber /
                                currentQuestion.totalQuestions) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col items-center justify-center">
                      <img
                        src={currentQuestion.landmark.image_url}
                        alt="Mystery landmark"
                        className="max-w-full max-h-80 rounded-2xl shadow-2xl mb-6"
                        style={{ objectFit: "contain" }}
                      />
                      <h3 className="text-2xl md:text-3xl font-bold text-yellow-400 mb-4 text-center">
                        Which country is this landmark in?
                      </h3>
                      <div className="flex flex-col md:flex-row gap-4 w-full">
                        {/* Current Answerer Display */}
                        {gameState.currentAnswerer && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-4 bg-yellow-500/20 rounded-xl border-2 border-yellow-500/50 text-center flex-1"
                          >
                            <Clock className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
                            <div className="text-xl font-bold">
                              {gameState.currentAnswerer.name}
                            </div>
                            <div className="text-lg text-gray-300">
                              {gameState.currentAnswerer.team}
                            </div>
                          </motion.div>
                        )}

                        {gameState.showAnswer && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-4 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl text-center flex-1"
                          >
                            <h4 className="text-xl font-bold mb-2">
                              {currentQuestion.landmark.name}
                            </h4>
                            <div className="text-lg flex items-center justify-center">
                              <MapPin className="w-5 h-5 mr-2" />
                              {currentQuestion.landmark.country.toUpperCase()}
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="waiting"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-full flex flex-col items-center justify-center text-center"
                  >
                    <div className="text-6xl mb-4">🎮</div>
                    <h2 className="text-3xl font-bold mb-4">Ready to Play!</h2>
                    <p className="text-xl text-gray-300">
                      {gameState.isActive
                        ? "Waiting for the first question..."
                        : "Game will start soon!"}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </div>

          {/* Right Column - Answer Log */}
          <div className="col-span-3">
            <Card className="h-full p-4 bg-black/40 backdrop-blur-sm border-2 border-green-500/30 overflow-hidden">
              <h3 className="text-xl font-bold mb-4 text-green-400 flex items-center">
                <Trophy className="w-5 h-5 mr-2" />
                Answer Log
              </h3>
              <div
                className="space-y-2 overflow-y-auto h-full"
                style={{ maxHeight: "calc(100% - 60px)" }}
                // style={{ maxHeight: "calc(100% - 150px)" }}
              >
                {answerLog.length === 0 ? (
                  <div className="text-center text-gray-400 mt-8">
                    <div className="text-3xl mb-2">📝</div>
                    <div className="text-sm">Answers will appear here</div>
                  </div>
                ) : (
                  answerLog.map((entry) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`p-3 rounded-lg ${
                        entry.isCorrect
                          ? "bg-green-500/20 border border-green-500/30"
                          : "bg-red-500/20 border border-red-500/30"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-bold text-sm truncate text-white">
                          {entry.studentName}
                        </div>
                        <div
                          className={`text-xs px-2 py-1 rounded ${
                            entry.isCorrect
                              ? "bg-green-500/30 text-green-300"
                              : "bg-red-500/30 text-red-300"
                          }`}
                        >
                          {entry.isCorrect ? `+${entry.points}` : "0"}
                        </div>
                      </div>
                      <div className="text-xs text-gray-200 mb-1">
                        {entry.team}
                      </div>
                      <div className="text-xs font-bold text-white">
                        {entry.country.toUpperCase()}
                      </div>
                      <div className="text-xs text-gray-300">
                        Q{entry.questionNumber}
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </Card>
          </div>
        </div>

        {/* Bottom instructions or status */}
        <div className="text-center">
          <div className="text-gray-400">
            Presentation Mode - Full Screen Recommended
          </div>
        </div>
      </div>
    </div>
  );
}
