"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import WelcomeSection from "@/components/welcome-section";
import CountrySection from "@/components/country-section";
import ThankYouSection from "@/components/thank-you-section";
import { useSocket } from "@/hooks/use-socket";
import { Ship } from "@/components/ship-animation";
import { countries } from "@/data/countries";
import { Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Enum for scroll modes
enum ScrollMode {
  NONE = "none",
  EVERY_SCROLL = "everyscroll",
  DIV_SELECT = "div-select",
}

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPresentationActive, setIsPresentationActive] = useState(false);
  const [scrollMode, setScrollMode] = useState<ScrollMode>(ScrollMode.NONE);
  const [targetElement, setTargetElement] = useState<string | null>(null);
  const { socket } = useSocket();

  const totalSlides = countries.length + 2; // Welcome + countries + thank you slide

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
      socket.on("changeSlide", (slideIndex: number) => {
        setCurrentSlide(slideIndex);
        scrollToTop(); // Scroll to top when slide changes
      });

      socket.on("presentationActiveChange", (isActive: boolean) => {
        setIsPresentationActive(isActive);
      });

      socket.on("scrollModeChange", (mode: ScrollMode) => {
        setScrollMode(mode);
      });

      socket.on("scrollToElement", (elementId: string) => {
        setTargetElement(elementId);
      });

      socket.on(
        "presentationState",
        (state: {
          currentSlide: number;
          isActive: boolean;
          scrollMode?: ScrollMode;
          targetElement?: string | null;
        }) => {
          // When joining, get the current state from the server
          setCurrentSlide(state.currentSlide);
          setIsPresentationActive(state.isActive);
          if (state.scrollMode) setScrollMode(state.scrollMode);
          if (state.targetElement) setTargetElement(state.targetElement);
        }
      );

      return () => {
        socket.off("changeSlide");
        socket.off("presentationActiveChange");
        socket.off("scrollToElement");
        socket.off("scrollModeChange");
        socket.off("presentationState");
      };
    }
  }, [socket]);
  useEffect(() => {
    // Scroll to top whenever the slide changes
    scrollToTop();
  }, [currentSlide]);

  useEffect(() => {
    // Handle scrolling to a specific element when targetElement changes
    if (targetElement) {
      const element = document.getElementById(targetElement);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
      // Reset target element after scrolling
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
          // Get normalized scroll position (0-100%)
          const scrollPosition = window.scrollY;
          const maxScroll = document.body.scrollHeight - window.innerHeight;
          const scrollPercentage = Math.min(
            Math.max((scrollPosition / maxScroll) * 100, 0),
            100
          );

          // Emit scroll position to all clients
          socket?.emit("scrollPosition", {
            position: scrollPosition,
            percentage: scrollPercentage,
          });
        }
        throttleTimer = null;
      }, 100); // Throttle to avoid too many events
    };

    if (isPresentationActive) {
      if (isAdmin && scrollMode === "everyscroll") {
        window.addEventListener("scroll", handleScroll);
      } else if (!isAdmin) {
        // Non-admin clients listen for scroll position updates
        socket?.on("scrollToPosition", (data: { position: number }) => {
          window.scrollTo({
            top: data.position,
            behavior: "smooth",
          });
        });
      }
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      socket?.off("scrollToPosition");
      if (throttleTimer) {
        clearTimeout(throttleTimer);
      }
    };
  }, [isPresentationActive, isAdmin, scrollMode, socket]);
  const handleNext = () => {
    if (currentSlide < totalSlides - 1) {
      const nextSlide = currentSlide + 1;
      setCurrentSlide(nextSlide);
      scrollToTop(); // Scroll to top when moving to next slide

      // Only emit socket event if presentation is active and user is admin
      if (isPresentationActive && isAdmin) {
        socket?.emit("controlSlide", nextSlide);
      }
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      const prevSlide = currentSlide - 1;
      setCurrentSlide(prevSlide);
      scrollToTop(); // Scroll to top when moving to previous slide

      // Only emit socket event if presentation is active and user is admin
      if (isPresentationActive && isAdmin) {
        socket?.emit("controlSlide", prevSlide);
      }
    }
  };
  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    scrollToTop(); // Scroll to top when jumping to a specific slide

    // Only emit socket event if presentation is active and user is admin
    if (isPresentationActive && isAdmin) {
      socket?.emit("controlSlide", index);
    }
  };
  const togglePresentation = () => {
    const newState = !isPresentationActive;
    setIsPresentationActive(newState);
    socket?.emit("togglePresentation", newState);
  };

  const changeScrollMode = (mode: ScrollMode) => {
    setScrollMode(mode);
    if (isPresentationActive && isAdmin) {
      socket?.emit("setScrollMode", mode);
    }
  };

  const handleScrollToElement = (elementId: string) => {
    if (isPresentationActive && isAdmin) {
      socket?.emit("scrollToElement", elementId);
    }

    // Local scroll handling
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
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
      {/* Content */}{" "}
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
          ) : currentSlide === totalSlides - 1 ? (
            <motion.div
              key="thank-you"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="min-h-[calc(100vh-4rem)]"
            >
              <ThankYouSection />
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
        {/* Admin controls */}
        {isAdmin && (
          <div className="fixed top-4 right-4 z-20 flex items-center space-x-4">
            {/* Scroll mode dropdown */}{" "}
            {isPresentationActive && (
              <div>
                <DropdownMenu>
                  <DropdownMenuTrigger className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                    Scroll Mode: {scrollMode}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-52">
                    <DropdownMenuItem
                      onClick={() => changeScrollMode(ScrollMode.NONE)}
                    >
                      <span className="font-medium">None</span>
                      {scrollMode === ScrollMode.NONE && (
                        <Check className="w-4 h-4 ml-auto" />
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => changeScrollMode(ScrollMode.EVERY_SCROLL)}
                    >
                      <span className="font-medium">Every Scroll</span>
                      {scrollMode === ScrollMode.EVERY_SCROLL && (
                        <Check className="w-4 h-4 ml-auto" />
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => changeScrollMode(ScrollMode.DIV_SELECT)}
                    >
                      <span className="font-medium">Div Select</span>
                      {scrollMode === ScrollMode.DIV_SELECT && (
                        <Check className="w-4 h-4 ml-auto" />
                      )}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <div className="bg-slate-800/80 text-xs mt-2 p-2 rounded absolute right-0 w-52">
                  {scrollMode === ScrollMode.NONE && (
                    <p>Users control their own scrolling</p>
                  )}
                  {scrollMode === ScrollMode.EVERY_SCROLL && (
                    <p>
                      All users' views follow your scrolling position in
                      real-time
                    </p>
                  )}
                  {scrollMode === ScrollMode.DIV_SELECT && (
                    <p>
                      Click on element badges to focus users' view on specific
                      sections
                    </p>
                  )}
                </div>
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
              {isPresentationActive
                ? "Stop Presentation"
                : "Start Presentation"}
            </button>
          </div>
        )}{" "}
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
        </div>{" "}
        {/* Navigation controls - shown to admin when presentation is active, or to everyone when not in presentation mode */}
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
