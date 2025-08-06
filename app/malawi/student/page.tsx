"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSocket } from "@/hooks/use-socket";
import { Hand, Users, Trophy, Zap, LogOut, Edit3, MapPin } from "lucide-react";
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

interface MalawiGameState {
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
  slideIndex: number;
  questionIndex: number;
  question: string;
  correctAnswer: string;
}

export default function MalawiStudentPage() {
  const [studentName, setStudentName] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("");
  const [studentId, setStudentId] = useState("");
  const [hasJoined, setHasJoined] = useState(false);
  const [gameState, setGameState] = useState<MalawiGameState>({
    isActive: false,
    teams: {
      "Team 1": { score: 0, members: [] },
      "Team 2": { score: 0, members: [] },
      "Team 3": { score: 0, members: [] },
      "Team 4": { score: 0, members: [] },
      "Team 5": { score: 0, members: [] },
    },
    currentAnswerer: null,
  });
  const [currentQuestion, setCurrentQuestion] = useState<QuestionData | null>(
    null
  );
  const [canAnswer, setCanAnswer] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [lastResult, setLastResult] = useState<{
    isCorrect: boolean;
    points: number;
    correctAnswer: string;
    answerer: any;
  } | null>(null);

  const { socket } = useSocket();

  useEffect(() => {
    // Generate unique student ID
    const id = Math.random().toString(36).substring(2, 15);
    setStudentId(id);

    if (socket) {
      // Listen for game state updates
      socket.on("malawi-game-state", (state: MalawiGameState) => {
        setGameState(state);
      });

      // Listen for teams updates
      socket.on("malawi-teams-updated", (teams: Record<string, Team>) => {
        setGameState((prev) => ({ ...prev, teams }));
      });

      // Listen for game status changes
      socket.on("malawi-game-status-change", (isActive: boolean) => {
        setGameState((prev) => ({ ...prev, isActive }));
      });

      // Listen for questions
      socket.on("malawi-question-asked", (questionData: QuestionData) => {
        setCurrentQuestion(questionData);
        setCanAnswer(true);
        setShowResult(false);
      });

      // Listen for answerer updates
      socket.on("malawi-student-answering", (answerer: any) => {
        setGameState((prev) => ({ ...prev, currentAnswerer: answerer }));
        setCanAnswer(false);
      });

      // Listen for answer results
      socket.on("malawi-answer-result", (result: any) => {
        setLastResult(result);
        setShowResult(true);
        setGameState((prev) => ({
          ...prev,
          teams: result.teams,
          currentAnswerer: null,
        }));
        setCanAnswer(false);
        // Hide result after 5 seconds
        setTimeout(() => {
          setShowResult(false);
          setCurrentQuestion(null);
        }, 5000);
      });

      // Listen for answerer cleared
      socket.on("malawi-answerer-cleared", () => {
        setGameState((prev) => ({ ...prev, currentAnswerer: null }));
        setCanAnswer(!!currentQuestion);
      });

      // Listen for one-student mode toggle
      socket.on("malawi-one-student-mode-toggled", (enabled: boolean) => {
        // Handle one student per question mode if needed
      });

      return () => {
        socket.off("malawi-game-state");
        socket.off("malawi-teams-updated");
        socket.off("malawi-game-status-change");
        socket.off("malawi-question-asked");
        socket.off("malawi-student-answering");
        socket.off("malawi-answer-result");
        socket.off("malawi-answerer-cleared");
        socket.off("malawi-one-student-mode-toggled");
      };
    }
  }, [socket, currentQuestion]);

  const handleJoinGame = () => {
    if (studentName.trim() && selectedTeam && socket) {
      socket.emit("malawi-game-join", {
        studentId,
        name: studentName.trim(),
        team: selectedTeam,
      });
      setHasJoined(true);
    }
  };

  const handleAnswerRequest = () => {
    if (socket && canAnswer && !gameState.currentAnswerer) {
      socket.emit("malawi-game-answer-request", {
        studentId,
        questionData: currentQuestion,
      });
    }
  };

  const handleEditInfo = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (studentName.trim() && selectedTeam && socket) {
      // Leave current team and rejoin with new info
      socket.emit("malawi-game-join", {
        studentId,
        name: studentName.trim(),
        team: selectedTeam,
      });
      setIsEditing(false);
    }
  };

  const handleLeaveGame = () => {
    setHasJoined(false);
    setCurrentQuestion(null);
    setCanAnswer(false);
    setShowResult(false);
    // Socket will handle cleanup on disconnect
  };

  // Get sorted teams by score
  const sortedTeams = Object.entries(gameState.teams).sort(
    ([, a], [, b]) => b.score - a.score
  );

  const myTeam = gameState.teams[selectedTeam];
  const isMyTurn = gameState.currentAnswerer?.studentId === studentId;

  if (!hasJoined) {
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
          <div className="max-w-md mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <div className="flex items-center justify-center mb-4">
                <MapPin className="w-8 h-8 text-blue-400 mr-3" />
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 text-transparent bg-clip-text">
                  English Program
                </h1>
              </div>
              <p className="text-gray-300">
                Join your team and participate in Paul's cultural learning
                experience!
              </p>
            </motion.div>

            <Card className="p-6 bg-black/40 backdrop-blur-sm border-2 border-purple-500/30">
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
                      {Object.entries(gameState.teams).map(
                        ([teamName, team]) => (
                          <SelectItem
                            key={teamName}
                            value={teamName}
                            className="text-white"
                          >
                            {teamName} ({team.members.length} members)
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={handleJoinGame}
                  disabled={!studentName.trim() || !selectedTeam}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Join Game
                </Button>
              </div>
            </Card>

            {/* Game Status */}
            <div className="mt-6 text-center">
              <div
                className={`inline-flex items-center px-4 py-2 rounded-full ${
                  gameState.isActive
                    ? "bg-green-600/20 text-green-400"
                    : "bg-red-600/20 text-red-400"
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full mr-2 ${
                    gameState.isActive ? "bg-green-400" : "bg-red-400"
                  }`}
                />
                Game {gameState.isActive ? "Active" : "Inactive"}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <MapPin className="w-6 h-6 text-blue-400 mr-2" />
            <h1 className="text-2xl font-bold">
              English Program - Cultural Learning
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            {!isEditing && (
              <Button
                onClick={handleEditInfo}
                size="sm"
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                <Edit3 className="w-4 h-4 mr-1" />
                Edit
              </Button>
            )}
            <Button
              onClick={handleLeaveGame}
              size="sm"
              variant="outline"
              className="border-red-600 text-red-400 hover:bg-red-900/20"
            >
              <LogOut className="w-4 h-4 mr-1" />
              Leave
            </Button>
          </div>
        </div>

        {/* Edit Form */}
        {isEditing && (
          <Card className="p-4 mb-6 bg-yellow-600/20 border-yellow-500/30">
            <h3 className="text-lg font-semibold mb-4 text-yellow-400">
              Edit Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Your Name
                </label>
                <Input
                  type="text"
                  placeholder="Enter your name"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="bg-gray-800/50 border-gray-600 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Team
                </label>
                <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                  <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white">
                    <SelectValue placeholder="Choose team" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    {Object.entries(gameState.teams).map(([teamName, team]) => (
                      <SelectItem
                        key={teamName}
                        value={teamName}
                        className="text-white"
                      >
                        {teamName} ({team.members.length} members)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex space-x-2 mt-4">
              <Button
                onClick={handleSaveEdit}
                size="sm"
                className="bg-green-600 hover:bg-green-700"
              >
                Save Changes
              </Button>
              <Button
                onClick={() => setIsEditing(false)}
                size="sm"
                variant="outline"
                className="border-gray-600"
              >
                Cancel
              </Button>
            </div>
          </Card>
        )}

        {/* Player Info */}
        <Card className="p-4 mb-6 bg-blue-600/20 border-blue-500/30">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-blue-400">{studentName}</h2>
              <p className="text-gray-300">Team: {selectedTeam}</p>
              {myTeam && (
                <p className="text-sm text-gray-400">
                  Team Score: {myTeam.score} points • {myTeam.members.length}{" "}
                  members
                </p>
              )}
            </div>
            <div
              className={`px-3 py-2 rounded-full text-sm ${
                gameState.isActive
                  ? "bg-green-600/20 text-green-400"
                  : "bg-red-600/20 text-red-400"
              }`}
            >
              {gameState.isActive ? "Game Active" : "Game Inactive"}
            </div>
          </div>
        </Card>

        {/* Current Question */}
        <AnimatePresence>
          {currentQuestion && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6"
            >
              <Card className="p-6 bg-purple-600/20 border-purple-500/30">
                <div className="flex items-center mb-4">
                  <Zap className="w-6 h-6 text-yellow-500 mr-2" />
                  <h3 className="text-xl font-bold text-purple-400">
                    Question
                  </h3>
                </div>
                <p className="text-lg mb-6 text-gray-100">
                  {currentQuestion.question}
                </p>

                {gameState.currentAnswerer ? (
                  <div className="bg-blue-600/20 p-4 rounded-lg">
                    {isMyTurn ? (
                      <div className="text-center">
                        <div className="animate-pulse">
                          <Hand className="w-12 h-12 text-yellow-500 mx-auto mb-2" />
                        </div>
                        <p className="text-yellow-400 font-bold text-lg">
                          You are answering! Speak clearly to the teacher.
                        </p>
                      </div>
                    ) : (
                      <p className="text-blue-400 text-center">
                        <strong>{gameState.currentAnswerer.name}</strong> from{" "}
                        <strong>{gameState.currentAnswerer.team}</strong> is
                        answering...
                      </p>
                    )}
                  </div>
                ) : canAnswer ? (
                  <div className="text-center">
                    <Button
                      onClick={handleAnswerRequest}
                      size="lg"
                      className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105"
                    >
                      <Hand className="w-6 h-6 mr-2" />
                      Raise Hand to Answer
                    </Button>
                  </div>
                ) : (
                  <div className="text-center text-gray-400">
                    <p>Wait for the next question...</p>
                  </div>
                )}
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Answer Result */}
        <AnimatePresence>
          {showResult && lastResult && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="mb-6"
            >
              <Card
                className={`p-6 ${
                  lastResult.isCorrect
                    ? "bg-green-600/20 border-green-500/30"
                    : "bg-red-600/20 border-red-500/30"
                }`}
              >
                <div className="text-center">
                  <div className="mb-4">
                    {lastResult.isCorrect ? (
                      <Trophy className="w-16 h-16 text-green-500 mx-auto" />
                    ) : (
                      <div className="w-16 h-16 mx-auto bg-red-500/20 rounded-full flex items-center justify-center">
                        <span className="text-3xl">😔</span>
                      </div>
                    )}
                  </div>
                  <h3
                    className={`text-2xl font-bold mb-2 ${
                      lastResult.isCorrect ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {lastResult.isCorrect ? "Correct!" : "Incorrect"}
                  </h3>
                  <p className="text-gray-300 mb-4">
                    <strong>{lastResult.answerer.name}</strong> from{" "}
                    <strong>{lastResult.answerer.team}</strong>
                    {lastResult.isCorrect
                      ? ` earned ${lastResult.points} point${
                          lastResult.points !== 1 ? "s" : ""
                        }!`
                      : " didn't get the point this time."}
                  </p>
                  <div className="bg-slate-800/50 p-3 rounded-lg">
                    <p className="text-sm text-gray-400">Correct answer:</p>
                    <p className="text-white font-medium">
                      {lastResult.correctAnswer}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Team Scores */}
        <Card className="p-6 bg-slate-800/50 border-slate-700">
          <div className="flex items-center mb-6">
            <Trophy className="w-6 h-6 text-yellow-500 mr-2" />
            <h3 className="text-xl font-bold">Team Scores</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedTeams.map(([teamName, team], index) => (
              <div
                key={teamName}
                className={`p-4 rounded-xl ${
                  teamName === selectedTeam
                    ? "bg-blue-600/30 border-2 border-blue-500"
                    : index === 0
                    ? "bg-yellow-500/20 border border-yellow-500/30"
                    : "bg-slate-700/50 border border-slate-600"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    {index === 0 && (
                      <Trophy className="w-5 h-5 text-yellow-500 mr-2" />
                    )}
                    <span className="font-bold">{teamName}</span>
                  </div>
                  <span className="text-2xl font-bold">{team.score}</span>
                </div>
                <div className="text-sm text-gray-400">
                  {team.members.length} member
                  {team.members.length !== 1 ? "s" : ""}
                </div>
                {teamName === selectedTeam && (
                  <div className="mt-2 text-xs text-blue-400">Your team</div>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
