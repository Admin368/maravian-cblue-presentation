"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSocket } from "@/hooks/use-socket";
import { MessageSquare, Send, ArrowLeft } from "lucide-react";
import Link from "next/link";

// Define the QA message type
interface QAMessage {
  id: string;
  socketId: string;
  timestamp: string;
  question: string;
  userName: string;
}

export default function QAPage() {
  const [messages, setMessages] = useState<QAMessage[]>([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [userName, setUserName] = useState("");
  const [isQAEnabled, setIsQAEnabled] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    // Check if user is admin
    const urlParams = new URLSearchParams(window.location.search);
    const admin = urlParams.get("admin") === "true";
    setIsAdmin(admin);

    if (socket) {
      // Listen for QA status changes
      socket.on("qa-status-change", (enabled: boolean) => {
        setIsQAEnabled(enabled);
      });

      // Listen for new QA messages
      socket.on("qa-message-received", (message: QAMessage) => {
        setMessages((prev) => [...prev, message]);
      });

      // Get initial state on connection
      socket.on("presentationState", (state: any) => {
        if (state.qaEnabled !== undefined) {
          setIsQAEnabled(state.qaEnabled);
        }
        if (state.qaMessages && Array.isArray(state.qaMessages)) {
          setMessages(state.qaMessages);
        }
      });

      return () => {
        socket.off("qa-status-change");
        socket.off("qa-message-received");
        socket.off("presentationState");
      };
    }
  }, [socket]);

  // Toggle QA feature (admin only)
  const toggleQA = () => {
    if (isAdmin && socket) {
      const newStatus = !isQAEnabled;
      socket.emit("toggle-qa", newStatus);
      setIsQAEnabled(newStatus);
    }
  };

  // Submit a new question
  const submitQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (newQuestion.trim() && socket && isQAEnabled) {
      socket.emit("qa-message", {
        question: newQuestion,
        userName: userName || "Anonymous",
      });
      setNewQuestion("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/"
            className="text-blue-400 hover:text-blue-300 flex items-center gap-2"
          >
            <ArrowLeft size={20} />
            <span>Back to Presentation</span>
          </Link>
          {isAdmin && (
            <button
              onClick={toggleQA}
              className={`px-4 py-2 rounded-lg ${
                isQAEnabled
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              Q&A {isQAEnabled ? "Enabled" : "Disabled"}
            </button>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center mb-8">
            <MessageSquare className="text-blue-400 w-8 h-8 mr-3" />
            <h1 className="text-3xl font-bold">Q&A Session</h1>
          </div>

          {/* Display disabled message if QA is not enabled */}
          {!isQAEnabled && !isAdmin && (
            <div className="bg-slate-800 rounded-lg p-6 text-center text-gray-300 mb-8">
              Q&A session is currently disabled by the presenter.
            </div>
          )}

          {/* Question submission form */}
          {(isQAEnabled || isAdmin) && (
            <div className="bg-slate-800 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4 text-blue-300">
                Ask a Question
              </h2>
              <form onSubmit={submitQuestion} className="space-y-4">
                <div>
                  <label
                    htmlFor="userName"
                    className="text-gray-300 mb-1 block"
                  >
                    Your Name (Optional)
                  </label>
                  <input
                    type="text"
                    id="userName"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 text-white"
                    placeholder="Anonymous"
                  />
                </div>
                <div>
                  <label
                    htmlFor="question"
                    className="text-gray-300 mb-1 block"
                  >
                    Your Question
                  </label>
                  <textarea
                    id="question"
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    className="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 text-white min-h-24"
                    placeholder="Type your question here..."
                    disabled={!isQAEnabled && !isAdmin}
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!newQuestion.trim() || (!isQAEnabled && !isAdmin)}
                >
                  Submit Question <Send size={16} />
                </button>
              </form>
            </div>
          )}

          {/* Messages list */}
          <div className="bg-slate-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-blue-300 flex items-center">
              <MessageSquare size={18} className="mr-2" /> Questions Asked
            </h2>

            {messages.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                No questions have been asked yet.
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-slate-700 rounded-lg p-4"
                  >
                    <div className="flex justify-between mb-2">
                      <span className="font-medium text-blue-300">
                        {message.userName}
                      </span>
                      <span className="text-sm text-gray-400">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-gray-200">{message.question}</p>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
