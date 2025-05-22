"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import WelcomeSection from "@/components/welcome-section";
import CountrySection from "@/components/country-section";
import { useSocket } from "@/hooks/use-socket";
import { Ship } from "@/components/ship-animation";
import { countries } from "@/data/countries";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPresentationActive, setIsPresentationActive] = useState(false);
  const { socket } = useSocket();

  const totalSlides = countries.length + 1; // Welcome + countries

  useEffect(() => {
    // Check if user is admin from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const admin = urlParams.get("admin") === "true";
    setIsAdmin(admin);

    if (socket) {
      socket.on("changeSlide", (slideIndex: number) => {
        setCurrentSlide(slideIndex);
      });

      socket.on("presentationActiveChange", (isActive: boolean) => {
        setIsPresentationActive(isActive);
      });

      socket.on(
        "presentationState",
        (state: { currentSlide: number; isActive: boolean }) => {
          // When joining, get the current state from the server
          setCurrentSlide(state.currentSlide);
          setIsPresentationActive(state.isActive);
        }
      );

      return () => {
        socket.off("changeSlide");
        socket.off("presentationActiveChange");
        socket.off("presentationState");
      };
    }
  }, [socket]);

  const handleNext = () => {
    if (currentSlide < totalSlides - 1) {
      const nextSlide = currentSlide + 1;
      setCurrentSlide(nextSlide);
      socket?.emit("controlSlide", nextSlide);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      const prevSlide = currentSlide - 1;
      setCurrentSlide(prevSlide);
      socket?.emit("controlSlide", prevSlide);
    }
  };
  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    socket?.emit("controlSlide", index);
  };

  const togglePresentation = () => {
    const newState = !isPresentationActive;
    setIsPresentationActive(newState);
    socket?.emit("togglePresentation", newState);
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
              <WelcomeSection />
            </motion.div>
          ) : (
            <motion.div
              key={`country-${currentSlide}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="min-h-[calc(100vh-4rem)]"
            >
              <CountrySection country={countries[currentSlide - 1]} />
            </motion.div>
          )}
        </AnimatePresence>{" "}
        {/* Admin toggle for presentation mode */}
        {isAdmin && (
          <div className="fixed top-4 right-4 z-20">
            <button
              onClick={togglePresentation}
              className={`px-4 py-2 rounded-lg transition-colors ${
                isPresentationActive
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              } text-white`}
            >
              {isPresentationActive
                ? "Stop Presentation"
                : "Start Presentation"}
            </button>
          </div>
        )}
        {/* Navigation dots */}
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() =>
                (isAdmin || isPresentationActive) && goToSlide(index)
              }
              className={`w-3 h-3 rounded-full transition-all ${
                currentSlide === index
                  ? "bg-blue-400 w-6"
                  : "bg-gray-400 opacity-70"
              }`}
              disabled={!isAdmin && !isPresentationActive}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        {/* Navigation controls - shown for admin and users when presentation is active */}
        {(isAdmin || isPresentationActive) && (
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
