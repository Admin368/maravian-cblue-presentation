"use client";

import { motion } from "framer-motion";
import { Anchor, ShipIcon, Globe, Users, Target } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useSocket } from "@/hooks/use-socket";

const teamMembers = [
  {
    name: "Corey Hakim Johnson",
    country: "Jamaica",
    school: "",
    photo: "https://maravianwebservices.com/images/photos/cblue/cjay.jpg",
  },
  {
    name: "Paul Ernest Kachule",
    country: "Malawi",
    school: "Wuhan University of Technology",
    photo: "https://maravianwebservices.com/images/photos/csda/Paul Crop.jpg",
  },
  {
    name: "Thanaporn Nukhao",
    country: "Thailand",
    school: "Dalian maritime university",
    photo: "https://maravianwebservices.com/images/photos/cblue/fight.jpg",
  },
  {
    name: "Pattaravit Taruwan",
    country: "Thailand",
    school: "South west jiao tong University",
    photo: "https://maravianwebservices.com/images/photos/cblue/mark.jpg",
  },
  {
    name: "SISAY MULETA",
    country: "Ethiopia",
    school: "South west jiao tong University",
    photo: "https://maravianwebservices.com/images/photos/cblue/sis.jpg",
  },
  {
    name: "Fauzia Yasmin",
    country: "Bangladesh",
    school: "Wuhan University of Technology",
    photo: "https://maravianwebservices.com/images/photos/cblue/fauzia.jpg",
  },
  {
    name: "Cyan",
    country: "China, Hong Kong",
    school: "Cblue",
    photo: "https://maravianwebservices.com/images/photos/cblue/",
  },
];

export default function WelcomeSection() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [scrollMode, setScrollMode] = useState("none");
  const { socket } = useSocket();

  // Check if user is admin
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const admin = urlParams.get("admin") === "true";
    setIsAdmin(admin);

    if (socket) {
      socket.on("scrollModeChange", (mode: string) => {
        setScrollMode(mode);
      });

      return () => {
        socket.off("scrollModeChange");
      };
    }
  }, [socket]);

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
        staggerChildren: 0.2,
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
    <div className="min-h-screen flex flex-col items-center justify-center py-12">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-center max-w-4xl mx-auto"
      >
        {" "}
        <motion.div
          id="welcome-intro"
          variants={itemVariants}
          className="mb-8 relative"
        >
          {isAdmin && scrollMode === "div-select" && (
            <button
              onClick={() => handleScrollClick("welcome-intro")}
              className="absolute -top-3 -right-3 bg-blue-600 hover:bg-blue-700 text-white p-1 rounded-full z-10"
              title="Scroll everyone to this section"
            >
              <Target className="w-4 h-4" />
            </button>
          )}
          <div className="flex items-center justify-center mb-4">
            <Anchor className="text-blue-400 w-12 h-12 mr-3" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 text-transparent bg-clip-text">
              C Blue
            </h1>
            <ShipIcon className="text-blue-400 w-12 h-12 ml-3" />
          </div>
          <p className="text-xl text-gray-300">
            Organized by China Merchants Group
          </p>
        </motion.div>{" "}
        <motion.div
          id="welcome-team"
          variants={itemVariants}
          className="mb-12 relative"
        >
          {isAdmin && scrollMode === "div-select" && (
            <button
              onClick={() => handleScrollClick("welcome-team")}
              className="absolute -top-3 -right-3 bg-blue-600 hover:bg-blue-700 text-white p-1 rounded-full z-10"
              title="Scroll everyone to this section"
            >
              <Target className="w-4 h-4" />
            </button>
          )}
          <h2 className="text-4xl font-bold mb-4 text-white">
            Team <span className="text-yellow-400">Winners</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Exploring global landmarks and their connection to the Yangtze River
            through the lens of logistics and shipping.
          </p>
        </motion.div>{" "}
        <motion.div
          id="welcome-photo"
          variants={itemVariants}
          className="mb-12 relative"
        >
          {isAdmin && scrollMode === "div-select" && (
            <button
              onClick={() => handleScrollClick("welcome-photo")}
              className="absolute -top-3 -right-3 bg-blue-600 hover:bg-blue-700 text-white p-1 rounded-full z-10"
              title="Scroll everyone to this section"
            >
              <Target className="w-4 h-4" />
            </button>
          )}
          <div className="relative w-full h-64 rounded-xl overflow-hidden">
            <Image
              src="https://maravianwebservices.com/images/photos/cblue/group1.png"
              alt="Team Winners Group Photo"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
            <div className="absolute bottom-4 left-4 bg-slate-900/70 px-4 py-2 rounded-lg">
              <p className="text-white font-medium">
                Team Winners at C Blue Event
              </p>
            </div>
          </div>
        </motion.div>{" "}
        <motion.h3
          id="welcome-members-title"
          variants={itemVariants}
          className="text-2xl font-semibold mb-6 flex items-center justify-center relative"
        >
          {isAdmin && scrollMode === "div-select" && (
            <button
              onClick={() => handleScrollClick("welcome-members-title")}
              className="absolute -top-3 -right-3 bg-blue-600 hover:bg-blue-700 text-white p-1 rounded-full z-10"
              title="Scroll everyone to this section"
            >
              <Target className="w-4 h-4" />
            </button>
          )}
          <Users className="mr-2" /> Our Team Members
        </motion.h3>
        <motion.div
          id="welcome-members"
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative"
        >
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-2 border-blue-400">
                <Image
                  src={member.photo || "/placeholder.svg"}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              </div>
              <h4 className="text-lg font-semibold">{member.name}</h4>
              <div className="flex items-center justify-center mt-1">
                <Globe className="w-4 h-4 mr-1 text-blue-400" />
                <p className="text-sm text-gray-300">{member.country}</p>
              </div>
              <p className="text-sm text-gray-400 mt-1">{member.school}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
