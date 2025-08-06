"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Hand, Users, Trophy } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useSocket } from "@/hooks/use-socket";
import { Ship } from "@/components/ship-animation";
import EnglishProgramWelcomeSection from "@/components/english-program-welcome";
import EnglishProgramThankYou from "@/components/english-program-thankyou";
import {
  QANotification,
  QAButton,
  QAModal,
  QASidebar,
} from "@/components/qa-components";
import MalawiSlideSection from "@/components/malawi-slide-section";
import MalawiGameSidebar from "@/components/malawi-game-sidebar";
import { malawiSlides } from "@/data/malawi";

// Enum for scroll modes
enum ScrollMode {
  NONE = "none",
  EVERY_SCROLL = "everyscroll",
  DIV_SELECT = "div-select",
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

export default function MalawiPresentationPage() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPresentationActive, setIsPresentationActive] = useState(false);
  const [scrollMode, setScrollMode] = useState<ScrollMode>(ScrollMode.NONE);
  const [targetElement, setTargetElement] = useState<string | null>(null);
  const [isQAEnabled, setIsQAEnabled] = useState(false);
  const [qaModalOpen, setQaModalOpen] = useState(false);
  const [qaSidebarOpen, setQaSidebarOpen] = useState(false);
  const [qaMessages, setQaMessages] = useState<
    Array<{
      id: string;
      socketId: string;
      question: string;
      userName: string;
      timestamp: string;
    }>
  >([]);
  const [qaNotification, setQaNotification] = useState<string | null>(null);

  // Game state
  const [gameMode, setGameMode] = useState(false);
  const [gameSidebarOpen, setGameSidebarOpen] = useState(false);
  const [gameState, setGameState] = useState<MalawiGameState>({
    isActive: false,
    teams: {
      "Team 1": { score: 0, members: [] },
      "Team 2": { score: 0, members: [] },
      "Team 3": { score: 0, members: [] },
      "Team 4": { score: 0, members: [] },
      "Team 5": { score: 0, members: [] },
    },
    currentQuestion: null,
    currentAnswerer: null,
    showAnswer: false,
  });

  const { socket } = useSocket();

  const totalSlides = malawiSlides.length + 2; // Welcome + slides + thank you

  // Function to scroll to top of the page
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    // Check if user is admin from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const admin = urlParams.get("admin") === "true";
    setIsAdmin(admin);

    if (socket) {
      // Existing presentation events
      socket.on("malawi-changeSlide", (slideIndex: number) => {
        setCurrentSlide(slideIndex);
        scrollToTop();
      });

      socket.on("malawi-presentationActiveChange", (isActive: boolean) => {
        setIsPresentationActive(isActive);
      });

      socket.on("malawi-scrollModeChange", (mode: ScrollMode) => {
        setScrollMode(mode);
      });

      socket.on("malawi-scrollToElement", (elementId: string) => {
        setTargetElement(elementId);
      });

      // QA events
      socket.on("malawi-qa-status-change", (enabled: boolean) => {
        setIsQAEnabled(enabled);
      });

      socket.on("malawi-qa-message-received", (message: any) => {
        setQaMessages((prev) => [...prev, message]);
        setQaNotification(`New question from ${message.userName}`);
        setTimeout(() => setQaNotification(null), 3000);
      });

      // Game events
      socket.on("malawi-game-status-change", (isActive: boolean) => {
        setGameState((prev) => ({ ...prev, isActive }));
      });

      socket.on("malawi-teams-updated", (teams: Record<string, Team>) => {
        setGameState((prev) => ({ ...prev, teams }));
      });

      socket.on("malawi-question-asked", (questionData: any) => {
        setGameState((prev) => ({
          ...prev,
          currentQuestion: questionData,
          showAnswer: false,
        }));
      });

      socket.on("malawi-student-answering", (answerer: any) => {
        setGameState((prev) => ({ ...prev, currentAnswerer: answerer }));
      });

      socket.on("malawi-answer-result", (result: any) => {
        setGameState((prev) => ({
          ...prev,
          showAnswer: true,
          teams: result.teams,
          currentAnswerer: null,
        }));
      });

      socket.on("malawi-answerer-cleared", () => {
        setGameState((prev) => ({ ...prev, currentAnswerer: null }));
      });

      // Listen for game mode changes - redirect non-admins to student interface
      socket.on("malawi-game-mode-change", (gameModeActive: boolean) => {
        if (gameModeActive && !isAdmin) {
          // Redirect non-admin users to student interface when questions mode is activated
          router.push("/malawi/student");
        }
      });

      socket.on("malawi-presentationState", (state: any) => {
        setCurrentSlide(state.currentSlide);
        setIsPresentationActive(state.isActive);
        if (state.scrollMode) setScrollMode(state.scrollMode);
        if (state.targetElement) setTargetElement(state.targetElement);
        if (state.qaEnabled !== undefined) setIsQAEnabled(state.qaEnabled);
        if (state.qaMessages) setQaMessages(state.qaMessages);
        if (state.gameState) setGameState(state.gameState);
      });

      return () => {
        socket.off("malawi-changeSlide");
        socket.off("malawi-presentationActiveChange");
        socket.off("malawi-scrollToElement");
        socket.off("malawi-scrollModeChange");
        socket.off("malawi-presentationState");
        socket.off("malawi-qa-status-change");
        socket.off("malawi-qa-message-received");
        socket.off("malawi-game-status-change");
        socket.off("malawi-teams-updated");
        socket.off("malawi-question-asked");
        socket.off("malawi-student-answering");
        socket.off("malawi-answer-result");
        socket.off("malawi-answerer-cleared");
        socket.off("malawi-game-mode-change");
      };
    }
  }, [socket]);

  useEffect(() => {
    scrollToTop();
  }, [currentSlide]);

  useEffect(() => {
    if (targetElement) {
      const element = document.getElementById(targetElement);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
      if (!isAdmin) {
        setTargetElement(null);
      }
    }
  }, [targetElement, isAdmin]);

  // Track scroll position for "everyscroll" mode
  useEffect(() => {
    let throttleTimer: ReturnType<typeof setTimeout> | null = null;

    const handleScroll = () => {
      if (throttleTimer !== null) return;

      throttleTimer = setTimeout(() => {
        if (isPresentationActive && isAdmin && scrollMode === "everyscroll") {
          const scrollPosition = window.scrollY;
          const maxScroll = document.body.scrollHeight - window.innerHeight;
          const scrollPercentage = Math.min(
            Math.max((scrollPosition / maxScroll) * 100, 0),
            100
          );

          socket?.emit("malawi-scrollPosition", {
            position: scrollPosition,
            percentage: scrollPercentage,
          });
        }
        throttleTimer = null;
      }, 100);
    };

    if (isPresentationActive) {
      if (isAdmin && scrollMode === "everyscroll") {
        window.addEventListener("scroll", handleScroll);
      } else if (!isAdmin) {
        socket?.on("malawi-scrollToPosition", (data: { position: number }) => {
          window.scrollTo({
            top: data.position,
            behavior: "smooth",
          });
        });
      }
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      socket?.off("malawi-scrollToPosition");
      if (throttleTimer) {
        clearTimeout(throttleTimer);
      }
    };
  }, [isPresentationActive, isAdmin, scrollMode, socket]);

  const handleNext = () => {
    if (currentSlide < totalSlides - 1) {
      const nextSlide = currentSlide + 1;
      setCurrentSlide(nextSlide);
      scrollToTop();

      if (isPresentationActive && isAdmin) {
        socket?.emit("malawi-controlSlide", nextSlide);
      }
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      const prevSlide = currentSlide - 1;
      setCurrentSlide(prevSlide);
      scrollToTop();

      if (isPresentationActive && isAdmin) {
        socket?.emit("malawi-controlSlide", prevSlide);
      }
    }
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    scrollToTop();

    if (isPresentationActive && isAdmin) {
      socket?.emit("malawi-controlSlide", index);
    }
  };

  const togglePresentation = () => {
    const newState = !isPresentationActive;
    setIsPresentationActive(newState);
    socket?.emit("malawi-togglePresentation", newState);
  };

  const changeScrollMode = (mode: ScrollMode) => {
    setScrollMode(mode);
    if (isPresentationActive && isAdmin) {
      socket?.emit("malawi-setScrollMode", mode);
    }
  };

  const handleScrollToElement = (elementId: string) => {
    if (isPresentationActive && isAdmin) {
      socket?.emit("malawi-scrollToElement", elementId);
    }

    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // QA related functions
  const toggleQAFeature = () => {
    if (isAdmin && socket) {
      const newStatus = !isQAEnabled;
      socket.emit("malawi-toggle-qa", newStatus);
      setIsQAEnabled(newStatus);
    }
  };

  const toggleQAView = () => {
    setQaModalOpen(true);
  };

  const submitQuestion = (question: string, userName: string) => {
    if (socket && question.trim()) {
      socket.emit("malawi-qa-message", {
        question,
        userName: userName || "Anonymous",
      });

      setQaNotification("Your question has been submitted!");
      setTimeout(() => setQaNotification(null), 3000);
    }
  };

  // Game functions
  const toggleGameMode = () => {
    const newGameMode = !gameMode;
    setGameMode(newGameMode);

    // Emit game mode change to server
    if (socket) {
      socket.emit("malawi-toggle-game-mode", newGameMode);
    }

    if (newGameMode) {
      setGameSidebarOpen(true);
    }
  };

  const toggleGameStatus = () => {
    if (isAdmin && socket) {
      const newStatus = !gameState.isActive;
      socket.emit("malawi-toggle-game", newStatus);
    }
  };

  const askQuestion = (slideIndex: number, questionIndex: number) => {
    if (isAdmin && socket) {
      const slide = malawiSlides[slideIndex - 1]; // -1 because slide 0 is welcome
      if (slide && slide.questions && slide.questions[questionIndex]) {
        const questionData = {
          slideIndex,
          questionIndex,
          question: slide.questions[questionIndex].question,
          correctAnswer: slide.questions[questionIndex].answer,
        };
        socket.emit("malawi-ask-question", questionData);
      }
    }
  };

  const approveAnswer = (isCorrect: boolean, points: number = 1) => {
    if (isAdmin && socket && gameState.currentAnswerer) {
      socket.emit("malawi-answer-result", { isCorrect, points });
    }
  };

  const clearAnswerer = () => {
    if (isAdmin && socket) {
      socket.emit("malawi-clear-answerer");
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white overflow-hidden">
      {/* Ocean waves background */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute bottom-0 w-full h-24 bg-blue-500 animate-wave"></div>
        <div className="absolute bottom-0 w-full h-32 bg-blue-600 animate-wave-slow"></div>
      </div>

      {/* Ship animation */}
      <Ship currentSlide={currentSlide} totalSlides={totalSlides} />

      {/* QA Components */}
      <QANotification message={qaNotification} />
      <QAButton
        isAdmin={isAdmin}
        isQAEnabled={isQAEnabled}
        toggleQAView={toggleQAView}
        toggleQAFeature={isAdmin ? toggleQAFeature : undefined}
      />
      <QAModal
        isOpen={qaModalOpen}
        onClose={() => setQaModalOpen(false)}
        onSubmit={submitQuestion}
        isQAEnabled={isQAEnabled}
      />
      <QASidebar
        isOpen={qaSidebarOpen}
        onClose={() => setQaSidebarOpen(false)}
        messages={qaMessages}
      />

      {/* Game Sidebar */}
      <MalawiGameSidebar
        isOpen={gameSidebarOpen}
        onClose={() => setGameSidebarOpen(false)}
        gameState={gameState}
        isAdmin={isAdmin}
        currentSlide={currentSlide}
        slides={malawiSlides}
        onToggleGame={toggleGameStatus}
        onAskQuestion={askQuestion}
        onApproveAnswer={approveAnswer}
        onClearAnswerer={clearAnswerer}
      />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {currentSlide === 0 ? (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="min-h-[calc(100vh-4rem)]"
            >
              <EnglishProgramWelcomeSection />
            </motion.div>
          ) : currentSlide === totalSlides - 1 ? (
            <motion.div
              key="thank-you"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="min-h-[calc(100vh-4rem)]"
            >
              <EnglishProgramThankYou />
            </motion.div>
          ) : (
            <motion.div
              key={`malawi-slide-${currentSlide}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="min-h-[calc(100vh-4rem)]"
            >
              <MalawiSlideSection
                slide={malawiSlides[currentSlide - 1]}
                gameState={gameState}
                isAdmin={isAdmin}
                onAskQuestion={askQuestion}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Links */}
        <div className="fixed top-4 left-4 z-20 flex space-x-2">
          <Link href="/malawi/qr">
            <Button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105">
              📱 Student QR Code
            </Button>
          </Link>
        </div>

        {/* Admin controls */}
        <div className="fixed top-4 right-4 z-20 flex items-center space-x-4">
          {/* QA message viewer button */}
          {(isAdmin || isQAEnabled) && qaMessages.length > 0 && (
            <button
              onClick={() => setQaSidebarOpen(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Questions ({qaMessages.length})
            </button>
          )}

          {/* Game button */}
          {isAdmin && (
            <button
              onClick={toggleGameMode}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center ${
                gameMode
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-gray-600 hover:bg-gray-700"
              } text-white`}
            >
              <Trophy className="w-4 h-4 mr-2" />
              {gameMode ? "Questions Active" : "Enable Questions"}
            </button>
          )}

          {/* Admin controls */}
          {isAdmin && (
            <div className="flex items-center space-x-4">
              {/* Scroll mode dropdown */}
              {isPresentationActive && (
                <div>
                  <select
                    value={scrollMode}
                    onChange={(e) =>
                      changeScrollMode(e.target.value as ScrollMode)
                    }
                    className="px-3 py-2 bg-gray-700 text-white rounded-lg"
                  >
                    <option value="none">No Sync</option>
                    <option value="everyscroll">Sync Scroll</option>
                    <option value="div-select">Target Elements</option>
                  </select>
                </div>
              )}
              <button
                onClick={togglePresentation}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  isPresentationActive
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                } text-white`}
              >
                {isPresentationActive ? "Presentation ON" : "Presentation OFF"}
              </button>
            </div>
          )}
        </div>

        {/* Game Status Indicator */}
        {gameState.isActive && (
          <div className="fixed top-20 right-4 z-20">
            <div className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center">
              <Trophy className="w-4 h-4 mr-2" />
              Game Active
            </div>
          </div>
        )}

        {/* Game sidebar toggle */}
        {gameMode && (
          <div className="fixed bottom-8 left-8 z-20">
            <button
              onClick={() => setGameSidebarOpen(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <Users className="w-4 h-4 mr-2" />
              Game Controls
            </button>
          </div>
        )}

        {/* Navigation dots */}
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                currentSlide === index
                  ? "bg-blue-400 w-6"
                  : "bg-gray-400 opacity-70"
              }`}
              disabled={isPresentationActive && !isAdmin}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Navigation controls */}
        {(isAdmin || !isPresentationActive) && (
          <div className="fixed bottom-8 right-8 flex space-x-4 z-20">
            <button
              onClick={handlePrev}
              disabled={currentSlide === 0}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              disabled={currentSlide === totalSlides - 1}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
