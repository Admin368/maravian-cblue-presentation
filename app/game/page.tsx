"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSocket } from "@/hooks/use-socket";
import { Crown, Users, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import landmarks from "@/data/landmarks_data.js";

interface Landmark {
  country: string;
  name: string;
  image_url: string;
}

interface Team {
  score: number;
  members: Array<{ id: string; name: string }>;
}

interface GameState {
  isActive: boolean;
  currentQuestion: number;
  currentLandmark: Landmark | null;
  questions: Landmark[];
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
  landmark: Landmark;
  questionNumber: number;
  totalQuestions: number;
}

export default function GamePage() {
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
  const [isTeacher, setIsTeacher] = useState(false);
  const [isStartingGame, setIsStartingGame] = useState(false);
  const [oneStudentMode, setOneStudentMode] = useState(false);
  const [questionsList, setQuestionsList] = useState<Landmark[]>([]);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(
    new Set()
  );

  const { socket } = useSocket();

  useEffect(() => {
    // Check if user is teacher from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const teacher = urlParams.get("teacher") === "true";
    setIsTeacher(teacher);

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

      socket.on("questions-loaded", (count: number) => {
        console.log(`Questions loaded: ${count} questions`);
        // The questions are loaded on the server, update local state if needed
      });

      socket.on("one-student-mode-toggled", (enabled: boolean) => {
        setOneStudentMode(enabled);
      });

      socket.on("questions-list", (questions: Landmark[]) => {
        setQuestionsList(questions);
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
        socket.off("questions-loaded");
        socket.off("one-student-mode-toggled");
        socket.off("questions-list");
      };
    }
  }, [socket]);

  const loadQuestions = () => {
    // Shuffle landmarks data that's already imported
    const shuffled = [...landmarks]
      .sort(() => Math.random() - 0.5)
      .slice(0, 15);
    console.log("Loading questions:", shuffled.length, "landmarks");
    socket?.emit("game-load-questions", shuffled);
  };

  const startGame = () => {
    // Auto-load questions if not already loaded
    if (gameState.questions.length === 0) {
      loadQuestions();
      // Wait for questions to load before starting the game
      setTimeout(() => {
        socket?.emit("game-toggle", true);
        // Automatically start the first question when the game starts
        setTimeout(() => {
          socket?.emit("game-next-question");
        }, 300);
      }, 800); // Give time for questions to load
    } else {
      socket?.emit("game-toggle", true);
      // Automatically start the first question when the game starts
      setTimeout(() => {
        socket?.emit("game-next-question");
      }, 500); // Small delay to ensure game state is updated
    }
  };

  const stopGame = () => {
    socket?.emit("game-toggle", false);
    setCurrentQuestion(null);
    setShowResults(false);
  };

  const nextQuestion = () => {
    socket?.emit("game-next-question");
  };

  const previousQuestion = () => {
    socket?.emit("game-previous-question");
  };

  const approveAnswer = (points: number) => {
    socket?.emit("game-answer-result", { isCorrect: true, points });
  };

  const rejectAnswer = () => {
    socket?.emit("game-answer-result", { isCorrect: false, points: 0 });
  };

  const clearAnswerer = () => {
    socket?.emit("game-clear-answerer");
  };

  const toggleOneStudentMode = () => {
    socket?.emit("toggle-one-student-mode");
  };

  const jumpToQuestion = (questionIndex: number) => {
    socket?.emit("jump-to-question", questionIndex);
  };

  const requestQuestionsList = () => {
    socket?.emit("get-questions-list");
  };

  // Get sorted teams for leaderboard
  const sortedTeams = Object.entries(gameState.teams)
    .sort(([, a], [, b]) => b.score - a.score)
    .map(([name, data]) => ({ name, ...data }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white relative overflow-hidden">
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

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1
            className="text-6xl font-bold mb-4 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            🌍 Guess the Country! 🏛️
          </motion.h1>
          <motion.p
            className="text-xl text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Can you identify these famous landmarks?
          </motion.p>
        </div>

        {/* Game Status & Controls */}
        {isTeacher && (
          <motion.div
            className="mb-8 p-6 bg-black/30 rounded-xl backdrop-blur-sm"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <h2 className="text-2xl font-bold mb-4 text-yellow-400">
              Teacher Controls
            </h2>
            <div className="space-y-4">
              {/* Main Game Controls */}
              <div className="flex gap-4 flex-wrap">
                <Button
                  onClick={loadQuestions}
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={gameState.isActive}
                >
                  Load Questions
                </Button>
                <Button
                  onClick={gameState.isActive ? stopGame : startGame}
                  className={
                    gameState.isActive
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-green-600 hover:bg-green-700"
                  }
                >
                  {gameState.isActive ? "Stop Game" : "Start Game"}
                </Button>

                {/* One Student Mode Toggle */}
                <Button
                  onClick={toggleOneStudentMode}
                  className={
                    oneStudentMode
                      ? "bg-orange-600 hover:bg-orange-700"
                      : "bg-gray-600 hover:bg-gray-700"
                  }
                >
                  {oneStudentMode ? "One Student ON" : "One Student OFF"}
                </Button>

                {/* Get Questions List */}
                {gameState.questions.length > 0 && (
                  <Button
                    onClick={requestQuestionsList}
                    className="bg-cyan-600 hover:bg-cyan-700"
                  >
                    Show Questions
                  </Button>
                )}
              </div>

              {/* Game Controls */}
              {gameState.isActive && (
                <div className="flex gap-4 flex-wrap">
                  <Button
                    onClick={previousQuestion}
                    className="bg-indigo-600 hover:bg-indigo-700"
                    disabled={
                      !gameState.questions.length ||
                      gameState.currentQuestion <= 0
                    }
                  >
                    Previous Question
                  </Button>
                  <Button
                    onClick={nextQuestion}
                    className="bg-purple-600 hover:bg-purple-700"
                    disabled={!gameState.questions.length}
                  >
                    Next Question
                  </Button>
                  {gameState.currentAnswerer && (
                    <>
                      <Button
                        onClick={() => approveAnswer(1)}
                        className="bg-green-500 hover:bg-green-600"
                      >
                        Correct (+1 pt)
                      </Button>
                      <Button
                        onClick={() => approveAnswer(2)}
                        className="bg-green-400 hover:bg-green-500"
                      >
                        Excellent (+2 pts)
                      </Button>
                      <Button
                        onClick={rejectAnswer}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        Incorrect
                      </Button>
                      <Button
                        onClick={clearAnswerer}
                        className="bg-gray-500 hover:bg-gray-600"
                      >
                        Clear
                      </Button>
                    </>
                  )}
                </div>
              )}

              {/* Questions Navigation */}
              {isTeacher && questionsList.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-3 text-cyan-400">
                    Questions Navigation
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 max-h-40 overflow-y-auto">
                    {questionsList.map((question, index) => (
                      <Button
                        key={index}
                        onClick={() => jumpToQuestion(index)}
                        className={`text-xs p-2 h-auto ${
                          gameState.currentQuestion === index
                            ? "bg-yellow-600 hover:bg-yellow-700 border-2 border-yellow-400"
                            : "bg-gray-600 hover:bg-gray-700"
                        }`}
                        title={`${question.name}, ${question.country}`}
                      >
                        <div className="flex flex-col items-center">
                          <span className="font-bold">Q{index + 1}</span>
                          <span className="text-xs truncate w-full">
                            {question.country}
                          </span>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Question Display */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {showResults && gameResults ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="text-center p-8 bg-gradient-to-r from-yellow-500 via-pink-500 to-purple-500 rounded-3xl"
                >
                  <Crown className="w-20 h-20 mx-auto mb-4 text-yellow-300" />
                  <h2 className="text-4xl font-bold mb-6">Game Over!</h2>
                  <div className="text-2xl mb-4">
                    🏆 Winner:{" "}
                    <span className="font-bold">{gameResults.winner.name}</span>
                  </div>
                  <div className="text-xl">
                    Final Score:{" "}
                    <span className="font-bold">
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
                  className="text-center"
                >
                  <div className="mb-6">
                    <div className="text-lg text-gray-300 mb-2">
                      Question {currentQuestion.questionNumber} of{" "}
                      {currentQuestion.totalQuestions}
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
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

                  <Card className="p-8 bg-black/40 backdrop-blur-sm border-2 border-purple-500/30">
                    <div className="mb-6">
                      <img
                        src={currentQuestion.landmark.image_url}
                        alt="Mystery landmark"
                        className="w-full max-w-2xl mx-auto rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <h3 className="text-3xl font-bold mb-4 text-yellow-400">
                      Which country is this landmark in?
                    </h3>

                    {/* Teacher Answer Display - Always visible to teacher */}
                    {isTeacher && currentQuestion && (
                      <div className="mt-4 p-4 bg-gray-800/50 rounded-lg border border-gray-600">
                        <h4 className="text-sm font-semibold text-gray-300 mb-2">
                          Teacher Answer:
                        </h4>
                        <div className="text-lg font-bold text-green-400">
                          <MapPin className="inline w-5 h-5 mr-2" />
                          {currentQuestion.landmark.country.toUpperCase()}
                        </div>
                        <div className="text-sm text-gray-400 mt-1">
                          {currentQuestion.landmark.name}
                        </div>
                      </div>
                    )}

                    {gameState.showAnswer && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mt-6 p-6 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl"
                      >
                        <h4 className="text-2xl font-bold mb-2">
                          {currentQuestion.landmark.name}
                        </h4>
                        <div className="text-xl">
                          <MapPin className="inline w-6 h-6 mr-2" />
                          {currentQuestion.landmark.country.toUpperCase()}
                        </div>
                      </motion.div>
                    )}
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  key="waiting"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center p-12 bg-black/30 rounded-3xl backdrop-blur-sm"
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
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Current Answerer */}
            {gameState.currentAnswerer && (
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-6 bg-yellow-500/20 backdrop-blur-sm rounded-xl border-2 border-yellow-500/50"
              >
                <h3 className="text-xl font-bold mb-3 text-yellow-400 flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Now Answering
                </h3>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {gameState.currentAnswerer.name}
                  </div>
                  <div className="text-lg text-gray-300">
                    {gameState.currentAnswerer.team}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Leaderboard */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="p-6 bg-black/30 backdrop-blur-sm rounded-xl"
            >
              <h3 className="text-2xl font-bold mb-4 text-purple-400 flex items-center">
                <Crown className="w-6 h-6 mr-2" />
                Leaderboard
              </h3>
              <div className="space-y-3">
                {sortedTeams.map((team, index) => (
                  <motion.div
                    key={team.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className={`flex justify-between items-center p-4 rounded-lg ${
                      index === 0
                        ? "bg-gradient-to-r from-yellow-500/30 to-orange-500/30 border-2 border-yellow-500/50"
                        : "bg-gray-700/50"
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">
                        {index === 0
                          ? "👑"
                          : index === 1
                          ? "🥈"
                          : index === 2
                          ? "🥉"
                          : "🏅"}
                      </span>
                      <div>
                        <div className="font-bold text-lg">{team.name}</div>
                        <div className="text-sm text-gray-400 flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {team.members.length} members
                        </div>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-yellow-400">
                      {team.score}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Instructions */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="p-6 bg-blue-500/20 backdrop-blur-sm rounded-xl border border-blue-500/30"
            >
              <h3 className="text-xl font-bold mb-3 text-blue-400">
                How to Play
              </h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Look at the landmark image</li>
                <li>• Press "I Have Answer" to be selected</li>
                <li>• Guess the country in English</li>
                <li>• Get 1 point for correct country</li>
                <li>• Get 2 points for detailed explanation</li>
                <li>• First to answer gets the chance!</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
