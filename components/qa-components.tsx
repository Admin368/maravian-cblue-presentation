"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send } from "lucide-react";

interface QAButtonProps {
  isAdmin: boolean;
  isQAEnabled: boolean;
  toggleQAView: () => void;
  toggleQAFeature?: () => void;
}

export function QAButton({
  isAdmin,
  isQAEnabled,
  toggleQAView,
  toggleQAFeature,
}: QAButtonProps) {
  // Pulsing animation for the button
  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        repeatType: "reverse" as const,
      },
    },
  };

  return (
    <div className="fixed bottom-24 right-8 z-30 flex flex-col items-end space-y-2">
      {isAdmin && (
        <button
          onClick={toggleQAFeature}
          className={`mb-2 px-4 py-2 rounded-lg text-sm ${
            isQAEnabled
              ? "bg-green-600 hover:bg-green-700"
              : "bg-red-600 hover:bg-red-700"
          } text-white transition-all`}
        >
          Q&A {isQAEnabled ? "Enabled" : "Disabled"}
        </button>
      )}

      {(isQAEnabled || isAdmin) && (
        <motion.button
          variants={pulseVariants}
          animate="pulse"
          onClick={toggleQAView}
          className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg flex items-center justify-center transition-all hover:rotate-12"
          style={{ width: "50px", height: "50px" }}
        >
          <MessageSquare size={24} />
        </motion.button>
      )}
    </div>
  );
}

interface QAModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (question: string, name: string) => void;
  isQAEnabled: boolean;
}

export function QAModal({
  isOpen,
  onClose,
  onSubmit,
  isQAEnabled,
}: QAModalProps) {
  const [question, setQuestion] = useState("");
  const [name, setName] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);

  // Close modal when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim()) {
      onSubmit(question, name || "Anonymous");
      setQuestion("");
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40 p-4">
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="bg-slate-800 rounded-lg w-full max-w-md p-6 shadow-xl"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-blue-300 flex items-center">
                <MessageSquare size={20} className="mr-2" />
                Ask a Question
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {!isQAEnabled ? (
              <p className="text-center text-gray-400 py-8">
                Q&A feature is currently disabled by the presenter.
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="text-gray-300 text-sm block mb-1"
                  >
                    Your Name (Optional)
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 rounded-md bg-slate-700 border border-slate-600 text-white"
                    placeholder="Anonymous"
                  />
                </div>
                <div>
                  <label
                    htmlFor="question"
                    className="text-gray-300 text-sm block mb-1"
                  >
                    Your Question
                  </label>
                  <textarea
                    id="question"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    className="w-full p-2 rounded-md bg-slate-700 border border-slate-600 text-white min-h-20"
                    placeholder="Type your question here..."
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
                    disabled={!question.trim()}
                  >
                    Submit <Send size={16} className="ml-2" />
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

interface QANotificationProps {
  message: string | null;
}

export function QANotification({ message }: QANotificationProps) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="fixed top-16 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white py-3 px-6 rounded-lg shadow-lg z-50 opacity-65"
        >
          <p className="flex items-center">
            <MessageSquare size={18} className="mr-2" />
            {message}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function QASidebar({
  isOpen,
  onClose,
  messages,
}: {
  isOpen: boolean;
  onClose: () => void;
  messages: Array<{
    id: string;
    question: string;
    userName: string;
    timestamp: string;
  }>;
}) {
  return (
    <div
      className={`fixed top-0 right-0 h-full bg-slate-900 shadow-xl z-40 transition-all duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
      style={{ width: "350px" }}
    >
      <div className="p-4 h-full flex flex-col">
        <div className="flex justify-between items-center mb-4 border-b border-slate-700 pb-3">
          <h2 className="text-xl font-bold text-white flex items-center">
            <MessageSquare size={20} className="mr-2 text-blue-400" />
            Q&A Messages
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto">
          {messages.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              No questions have been asked yet.
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map((msg) => (
                <div key={msg.id} className="bg-slate-800 rounded-md p-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-blue-300">
                      {msg.userName}
                    </span>
                    <span className="text-gray-400">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-gray-200">{msg.question}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-slate-700 mt-4">
          <a
            href="/qa"
            className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Go to Full Q&A Page
          </a>
        </div>
      </div>
    </div>
  );
}
