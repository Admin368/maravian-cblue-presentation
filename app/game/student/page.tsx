"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSocket } from "@/hooks/use-socket";
import { Hand, Users, Trophy, Zap, LogOut, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Student {
  name: string;
  team: string;
  socketId: string;
  isAnswering: boolean;
}

interface Team {
  score: number;
  members: Array<{ id: string; name: string }>;
}

interface GameState {
  isActive: boolean;
  teams: Record<string, Team>;
  currentAnswerer: {
    studentId: string;
    name: string;
    team: string;
    socketId: string;
  } | null;
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

export default function StudentPage() {
  const [studentName, setStudentName] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("");
  const [studentId, setStudentId] = useState("");
  const [hasJoined, setHasJoined] = useState(false);
  const [gameState, setGameState] = useState<GameState>({
    isActive: false,
    teams: {},
    currentAnswerer: null,
  });
  const [currentQuestion, setCurrentQuestion] = useState<QuestionData | null>(
    null
  );
  const [canAnswer, setCanAnswer] = useState(false);
  const [answerResult, setAnswerResult] = useState<any>(null);
  const [hasAlreadyAnswered, setHasAlreadyAnswered] = useState(false);
  const [alreadyAnsweredMessage, setAlreadyAnsweredMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const { socket } = useSocket();

  useEffect(() => {
    // Generate random student ID
    const id = Math.random().toString(36).substring(2, 15);
    setStudentId(id);

    // Load saved user data from localStorage
    const savedName = localStorage.getItem("game-student-name");
    const savedTeam = localStorage.getItem("game-student-team");

    if (savedName) {
      setStudentName(savedName);
    }
    if (savedTeam) {
      setSelectedTeam(savedTeam);
    }

    // Auto-join if both name and team are saved
    if (savedName && savedTeam && socket) {
      setHasJoined(true);
      // Emit join event automatically
      socket.emit("game-join", {
        studentId: id,
        name: savedName,
        team: savedTeam,
      });
    }

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
        setCanAnswer(true);
        setAnswerResult(null);
        // Reset already answered state for new question
        setHasAlreadyAnswered(false);
        setAlreadyAnsweredMessage("");
      });

      socket.on("student-answering", (answerer: any) => {
        setGameState((prev) => ({ ...prev, currentAnswerer: answerer }));
        setCanAnswer(false);
      });

      socket.on("answer-result", (result: any) => {
        setAnswerResult(result);
        setGameState((prev) => ({
          ...prev,
          teams: result.teams,
          currentAnswerer: null,
        }));
        setCanAnswer(false);
      });

      socket.on("answerer-cleared", () => {
        setGameState((prev) => ({ ...prev, currentAnswerer: null }));
        setCanAnswer(true);
      });

      socket.on("game-status-change", (isActive: boolean) => {
        setGameState((prev) => ({ ...prev, isActive }));
        if (!isActive) {
          setCurrentQuestion(null);
          setCanAnswer(false);
          setAnswerResult(null);
        }
      });

      socket.on("game-finished", (results: any) => {
        setAnswerResult(results);
        setCanAnswer(false);
      });

      // Listen for already answered event (one-student mode)
      socket.on("already-answered", (data: any) => {
        console.log("Already answered:", data);
        setHasAlreadyAnswered(true);
        setCanAnswer(false);
        setAlreadyAnsweredMessage(
          data.message || "You have already answered in this game session."
        );
      });

      // Listen for one-student mode changes
      socket.on("one-student-mode-toggled", (enabled: boolean) => {
        console.log("One student mode:", enabled);
        if (!enabled) {
          // If one-student mode is disabled, reset already answered state
          setHasAlreadyAnswered(false);
          setAlreadyAnsweredMessage("");
          if (currentQuestion && !gameState.currentAnswerer) {
            setCanAnswer(true);
          }
        }
      });

      return () => {
        socket.off("game-state");
        socket.off("teams-updated");
        socket.off("question-display");
        socket.off("student-answering");
        socket.off("answer-result");
        socket.off("answerer-cleared");
        socket.off("game-status-change");
        socket.off("game-finished");
        socket.off("already-answered");
        socket.off("one-student-mode-toggled");
      };
    }
  }, [socket]);

  const joinGame = () => {
    if (studentName.trim() && selectedTeam && socket) {
      // Save to localStorage
      localStorage.setItem("game-student-name", studentName.trim());
      localStorage.setItem("game-student-team", selectedTeam);

      socket.emit("game-join", {
        studentId,
        name: studentName.trim(),
        team: selectedTeam,
      });
      setHasJoined(true);
    }
  };

  const logout = () => {
    // Clear localStorage
    localStorage.removeItem("game-student-name");
    localStorage.removeItem("game-student-team");

    // Reset state
    setHasJoined(false);
    setStudentName("");
    setSelectedTeam("");
    setCurrentQuestion(null);
    setCanAnswer(false);
    setAnswerResult(null);
    setIsEditing(false);

    // Disconnect from socket if needed
    if (socket) {
      socket.disconnect();
      // Reconnect for next user
      setTimeout(() => {
        socket.connect();
      }, 100);
    }
  };

  const handleEditInfo = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (studentName.trim() && selectedTeam && socket) {
      // Save to localStorage
      localStorage.setItem("game-student-name", studentName.trim());
      localStorage.setItem("game-student-team", selectedTeam);

      // Rejoin with new info
      socket.emit("game-join", {
        studentId,
        name: studentName.trim(),
        team: selectedTeam,
      });
      setIsEditing(false);
    }
  };

  const requestAnswer = () => {
    if (socket && canAnswer && !gameState.currentAnswerer) {
      socket.emit("game-answer-request", { studentId });
    }
  };

  const teams = ["Team 1", "Team 2", "Team 3", "Team 4", "Team 5"];

  // Check if current student is answering
  const isCurrentAnswerer = gameState.currentAnswerer?.studentId === studentId;

  // Get current student's team info
  const myTeam = gameState.teams[selectedTeam];

  // Get sorted teams for display
  const sortedTeams = Object.entries(gameState.teams)
    .sort(([, a], [, b]) => b.score - a.score)
    .map(([name, data]) => ({ name, ...data }));

  if (!hasJoined) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          <Card className="p-8 bg-black/40 backdrop-blur-sm border-2 border-purple-500/30">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-pink-500 bg-clip-text text-transparent">
                🌍 Join the Game!
              </h1>
              <p className="text-gray-300">
                Enter your details to start playing
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Your Name
                </label>
                <Input
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Enter your name"
                  className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Choose Your Team
                </label>
                <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                  <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                    <SelectValue placeholder="Select a team" />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map((team) => (
                      <SelectItem key={team} value={team}>
                        {team}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={joinGame}
                disabled={!studentName.trim() || !selectedTeam}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg py-3"
              >
                Join Game! 🚀
              </Button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400">
                Student ID:{" "}
                <code className="bg-gray-700 px-2 py-1 rounded text-yellow-400">
                  {studentId}
                </code>
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-10 opacity-20">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-white rounded-full"
              style={{
                width: Math.random() * 4 + 1,
                height: Math.random() * 4 + 1,
                left: Math.random() * 100 + "%",
                top: Math.random() * 100 + "%",
              }}
              animate={{
                y: [-20, -100],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Edit and Logout Buttons */}
        <div className="absolute top-4 right-4 flex gap-2">
          {!isEditing && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Button
                onClick={handleEditInfo}
                variant="outline"
                className="bg-blue-600/20 border-blue-500/30 text-blue-300 hover:bg-blue-600/40 hover:text-white transition-all duration-200"
              >
                <Edit3 className="w-4 h-4 mr-1" />
                Edit
              </Button>
            </motion.div>
          )}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              onClick={logout}
              variant="outline"
              className="bg-red-600/20 border-red-500/30 text-red-300 hover:bg-red-600/40 hover:text-white transition-all duration-200"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </motion.div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1
            className="text-4xl font-bold mb-2 bg-gradient-to-r from-yellow-400 to-pink-500 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Welcome, {studentName}! 👋
          </motion.h1>
          <motion.p
            className="text-lg text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Team:{" "}
            <span className="font-bold text-purple-400">{selectedTeam}</span>
            {myTeam && (
              <span className="ml-4">
                Score:{" "}
                <span className="font-bold text-yellow-400">
                  {myTeam.score}
                </span>
              </span>
            )}
          </motion.p>
        </div>

        {/* Edit Form */}
        {isEditing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto mb-8"
          >
            <Card className="p-6 bg-black/40 backdrop-blur-sm border-2 border-blue-500/30">
              <h3 className="text-xl font-bold text-center mb-4 text-blue-400">
                Edit Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Your Name
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter your name"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Select Team
                  </label>
                  <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                    <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white">
                      <SelectValue placeholder="Choose your team" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      {Object.keys(gameState.teams).map((team) => (
                        <SelectItem
                          key={team}
                          value={team}
                          className="text-white"
                        >
                          {team} ({gameState.teams[team].members.length}{" "}
                          members, Score: {gameState.teams[team].score})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    onClick={handleSaveEdit}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={!studentName.trim() || !selectedTeam}
                  >
                    Save Changes
                  </Button>
                  <Button
                    onClick={() => setIsEditing(false)}
                    variant="outline"
                    className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Game Area */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {!gameState.isActive ? (
                <motion.div
                  key="waiting"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="text-center p-12 bg-black/30 rounded-3xl backdrop-blur-sm"
                >
                  <div className="text-6xl mb-4">⏳</div>
                  <h2 className="text-3xl font-bold mb-4">
                    Game Starting Soon!
                  </h2>
                  <p className="text-xl text-gray-300">
                    Wait for your teacher to start the game...
                  </p>
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

                  <Card className="p-6 bg-black/40 backdrop-blur-sm border-2 border-purple-500/30">
                    <div className="mb-6">
                      <img
                        src={currentQuestion.landmark.image_url}
                        alt="Mystery landmark"
                        className="w-full max-w-xl mx-auto rounded-2xl shadow-2xl"
                      />
                    </div>

                    <h3 className="text-2xl font-bold mb-6 text-yellow-400">
                      Which country is this landmark in?
                    </h3>

                    {/* Answer Button or Already Answered Message */}
                    {hasAlreadyAnswered ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-6 bg-orange-500/20 rounded-xl border-2 border-orange-500/50"
                      >
                        <div className="text-center">
                          <div className="text-4xl mb-4">🚫</div>
                          <h3 className="text-xl font-bold text-orange-400 mb-2">
                            Already Answered!
                          </h3>
                          <p className="text-gray-300">
                            {alreadyAnsweredMessage}
                          </p>
                        </div>
                      </motion.div>
                    ) : !gameState.currentAnswerer && canAnswer ? (
                      <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          onClick={requestAnswer}
                          className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-2xl py-4 px-8 rounded-2xl transform transition-all duration-200 shadow-lg hover:shadow-2xl"
                        >
                          <Hand className="w-8 h-8 mr-3" />I Have Answer! ✋
                        </Button>
                      </motion.div>
                    ) : gameState.currentAnswerer ? (
                      <div className="p-6 bg-yellow-500/20 rounded-xl border-2 border-yellow-500/50">
                        {isCurrentAnswerer ? (
                          <div className="text-center">
                            <motion.div
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ repeat: Infinity, duration: 1.5 }}
                            >
                              <Zap className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
                            </motion.div>
                            <h3 className="text-2xl font-bold text-yellow-400 mb-2">
                              It's your turn! 🌟
                            </h3>
                            <p className="text-lg text-gray-300">
                              Give your answer to the teacher!
                            </p>
                          </div>
                        ) : (
                          <div className="text-center">
                            <div className="text-xl font-bold mb-2">
                              {gameState.currentAnswerer.name} is answering...
                            </div>
                            <div className="text-gray-300">
                              Team: {gameState.currentAnswerer.team}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="p-4 bg-gray-700/50 rounded-xl">
                        <p className="text-gray-400">
                          Waiting for next question...
                        </p>
                      </div>
                    )}

                    {/* Answer Result */}
                    {answerResult && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mt-6"
                      >
                        {answerResult.winner ? (
                          <div className="p-6 bg-gradient-to-r from-yellow-500 via-pink-500 to-purple-500 rounded-xl">
                            <Trophy className="w-12 h-12 mx-auto mb-4 text-yellow-300" />
                            <h3 className="text-2xl font-bold mb-2">
                              Game Over!
                            </h3>
                            <p className="text-xl">
                              🏆 Winner: {answerResult.winner.name}
                            </p>
                          </div>
                        ) : (
                          <div
                            className={`p-6 rounded-xl ${
                              answerResult.isCorrect
                                ? "bg-gradient-to-r from-green-500 to-blue-500"
                                : "bg-gradient-to-r from-red-500 to-pink-500"
                            }`}
                          >
                            <div className="text-xl font-bold mb-2">
                              {answerResult.isCorrect
                                ? "✅ Correct!"
                                : "❌ Incorrect"}
                            </div>
                            <div className="text-lg mb-2">
                              {answerResult.answerer.name} (
                              {answerResult.answerer.team})
                            </div>
                            {answerResult.isCorrect && (
                              <div className="text-lg">
                                +{answerResult.points} points!
                              </div>
                            )}
                            <div className="mt-3 text-lg">
                              Answer:{" "}
                              <strong>
                                {answerResult.correctAnswer?.toUpperCase()}
                              </strong>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  key="game-active"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center p-12 bg-black/30 rounded-3xl backdrop-blur-sm"
                >
                  <div className="text-6xl mb-4">🎯</div>
                  <h2 className="text-3xl font-bold mb-4">Game is Active!</h2>
                  <p className="text-xl text-gray-300">
                    Waiting for the first question...
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* My Team */}
            {myTeam && (
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-6 bg-purple-500/20 backdrop-blur-sm rounded-xl border-2 border-purple-500/50"
              >
                <h3 className="text-xl font-bold mb-3 text-purple-400 flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  My Team
                </h3>
                <div className="text-center mb-4">
                  <div className="text-2xl font-bold">{selectedTeam}</div>
                  <div className="text-3xl font-bold text-yellow-400">
                    {myTeam.score} pts
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-gray-400 mb-2">
                    Team Members:
                  </div>
                  {myTeam.members.map((member, index) => (
                    <div
                      key={member.id}
                      className={`text-sm p-2 rounded ${
                        member.id === studentId
                          ? "bg-purple-600/30 font-bold"
                          : "bg-gray-700/30"
                      }`}
                    >
                      {member.name} {member.id === studentId && "(You)"}
                    </div>
                  ))}
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
              <h3 className="text-xl font-bold mb-4 text-yellow-400 flex items-center">
                <Trophy className="w-5 h-5 mr-2" />
                Leaderboard
              </h3>
              <div className="space-y-3">
                {sortedTeams.map((team, index) => (
                  <motion.div
                    key={team.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className={`flex justify-between items-center p-3 rounded-lg ${
                      team.name === selectedTeam
                        ? "bg-purple-600/30 border-2 border-purple-500/50"
                        : index === 0
                        ? "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30"
                        : "bg-gray-700/30"
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="text-xl mr-2">
                        {index === 0
                          ? "👑"
                          : index === 1
                          ? "🥈"
                          : index === 2
                          ? "🥉"
                          : `${index + 1}.`}
                      </span>
                      <div className="font-bold">{team.name}</div>
                    </div>
                    <div className="font-bold text-yellow-400">
                      {team.score}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
