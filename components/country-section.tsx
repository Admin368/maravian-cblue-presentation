"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Anchor, Ship, Waves, MapPin, Target } from "lucide-react";
import type { CountryData } from "@/types";
import { useState, useEffect } from "react";
import { useSocket } from "@/hooks/use-socket";

interface CountrySectionProps {
  country: CountryData;
}

export default function CountrySection({ country }: CountrySectionProps) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [scrollMode, setScrollMode] = useState("none");
  const [focusedImageIndex, setFocusedImageIndex] = useState(0); // Track the focused image index
  const { socket } = useSocket();

  // Check if user is admin
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const admin = urlParams.get("admin") === "true";
    setIsAdmin(admin);

    if (socket) {
      socket.on("scrollModeChange", (mode: string) => {
        console.log("Scroll mode changed to:", mode);
        setScrollMode(mode);
      });

      // Listen for image focus change events
      socket.on(
        "imageFocusChange",
        (data: { countryId: string; imageIndex: number }) => {
          if (data.countryId === country.id) {
            setFocusedImageIndex(data.imageIndex);
          }
        }
      );

      return () => {
        socket.off("scrollModeChange");
        socket.off("imageFocusChange");
      };
    }
  }, [socket, country.id]);
  // Handle thumbnail click to change the focused image
  const handleImageFocus = (index: number) => {
    setFocusedImageIndex(index);

    // If admin, send the focus change to everyone
    if (isAdmin) {
      console.log(
        `Admin changing focus to image ${index} for country ${country.id}`
      );
      socket?.emit("imageFocusChange", {
        countryId: country.id,
        imageIndex: index,
      });
    }
  };

  const handleScrollClick = (elementId: string) => {
    if (isAdmin && scrollMode === "div-select") {
      socket?.emit("scrollToElement", elementId);

      // Local scrolling
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

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
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-teal-400 text-transparent bg-clip-text">
            {country.name}
          </h2>
          <div className="flex items-center justify-center">
            <MapPin className="w-5 h-5 mr-2 text-blue-400" />
            <h3 className="text-2xl font-semibold text-white">
              {country.landmark}
            </h3>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <motion.div variants={itemVariants} className="order-2 lg:order-1">
            {" "}
            <div className="space-y-8">
              {country.bulletSections.map((section) => (
                <div
                  key={section.id}
                  id={`${country.id}-${section.id}`}
                  className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 relative"
                >
                  {isAdmin && scrollMode === "div-select" && (
                    <button
                      onClick={() =>
                        handleScrollClick(`${country.id}-${section.id}`)
                      }
                      className="absolute -top-3 -right-3 bg-blue-600 hover:bg-blue-700 text-white p-1 rounded-full z-10"
                      title="Scroll everyone to this section"
                    >
                      <Target className="w-4 h-4" />
                    </button>
                  )}
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-500/20 p-2 rounded-lg mr-3">
                      {section.id === "similarities" ? (
                        <Waves className="w-6 h-6 text-blue-400" />
                      ) : section.id === "shipping" ? (
                        <Ship className="w-6 h-6 text-blue-400" />
                      ) : section.id === "industries" ? (
                        <Anchor className="w-6 h-6 text-blue-400" />
                      ) : (
                        <MapPin className="w-6 h-6 text-blue-400" />
                      )}
                    </div>
                    <h4 className="text-xl font-semibold">{section.title}</h4>
                  </div>
                  <ul className="space-y-2 text-gray-300">
                    {section.points.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-blue-400 mr-2">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>{" "}
          <motion.div
            id={`${country.id}-gallery`}
            variants={itemVariants}
            className="order-1 lg:order-2 relative"
          >
            {isAdmin && scrollMode === "div-select" && (
              <button
                onClick={() => handleScrollClick(`${country.id}-gallery`)}
                className="absolute -top-3 -right-3 bg-blue-600 hover:bg-blue-700 text-white p-1 rounded-full z-10"
                title="Scroll everyone to this section"
              >
                <Target className="w-4 h-4" />
              </button>
            )}{" "}
            <div className="space-y-4">
              {" "}
              {/* Main focused image */}
              <div
                className="relative rounded-xl overflow-hidden"
                style={{ height: "400px" }}
              >
                <Image
                  src={country.images[focusedImageIndex] || "/placeholder.svg"}
                  alt={`${country.name} - ${country.landmark}`}
                  fill
                  className="object-cover transition-transform duration-500"
                />
                {isAdmin && (
                  <div className="absolute bottom-4 right-4 bg-blue-600/70 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                    Click thumbnails below to share images
                  </div>
                )}
              </div>
              {/* Thumbnails */}
              <div className="grid grid-cols-4 gap-2">
                {country.images.slice(0, 8).map((image, index) => (
                  <div
                    key={index}
                    className={`relative rounded-xl overflow-hidden cursor-pointer ${
                      focusedImageIndex === index ? "ring-2 ring-blue-500" : ""
                    }`}
                    style={{ height: "90px" }}
                    onClick={() => handleImageFocus(index)}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${country.name} - ${country.landmark} thumbnail`}
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
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
