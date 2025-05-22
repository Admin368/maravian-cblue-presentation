"use client";

import { useState, useEffect } from "react";
import { useSocket } from "@/hooks/use-socket";
import { countries } from "@/data/countries";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Monitor } from "lucide-react";

export default function AdminPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { socket, isConnected } = useSocket();
  const totalSlides = countries.length + 2; // Welcome + countries + thank you

  useEffect(() => {
    if (socket) {
      socket.on("changeSlide", (slideIndex: number) => {
        setCurrentSlide(slideIndex);
      });

      return () => {
        socket.off("changeSlide");
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

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Monitor className="mr-2 h-6 w-6" />C Blue Presentation Controls
          </CardTitle>
          <CardDescription>
            Control the presentation slides for all connected viewers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">
                Connection Status:
                <span
                  className={
                    isConnected ? "text-green-500 ml-2" : "text-red-500 ml-2"
                  }
                >
                  {isConnected ? "Connected" : "Disconnected"}
                </span>
              </div>
              <div className="text-sm font-medium">
                Current Slide: {currentSlide + 1} of {totalSlides}
              </div>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <Button
                  key={index}
                  variant={currentSlide === index ? "default" : "outline"}
                  onClick={() => goToSlide(index)}
                  className="h-10 w-10 p-0"
                >
                  {index + 1}
                </Button>
              ))}
            </div>

            <div className="flex justify-between">
              <Button
                onClick={handlePrev}
                disabled={currentSlide === 0}
                variant="outline"
                className="flex items-center"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>

              <Button
                onClick={handleNext}
                disabled={currentSlide === totalSlides - 1}
                className="flex items-center"
              >
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="rounded-lg border p-4">
              <h3 className="font-medium mb-2">Current Slide Content:</h3>{" "}
              <p>
                {currentSlide === 0
                  ? "Welcome Page"
                  : currentSlide === totalSlides - 1
                  ? "Thank You Page"
                  : `${countries[currentSlide - 1].name} - ${
                      countries[currentSlide - 1].landmark
                    }`}
              </p>
            </div>

            <div className="text-sm text-gray-500">
              <p>
                Open the main presentation in another window to see the changes
                in real-time.
              </p>
              <p className="mt-1">
                Main presentation URL:{" "}
                <a
                  href="/"
                  target="_blank"
                  className="text-blue-600 hover:underline"
                  rel="noreferrer"
                >
                  Open Presentation
                </a>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
