"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { QrCode, Users, Trophy, Menu, X, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MalawiNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navItems = [
    {
      href: "/malawi",
      label: "Presentation",
      icon: MapPin,
      className:
        "bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800",
    },
    {
      href: "/malawi/qr",
      label: "QR Code",
      icon: QrCode,
      className:
        "bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600",
    },
    {
      href: "/malawi/student",
      label: "Questions",
      icon: Users,
      className:
        "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600",
    },
    {
      href: "/game",
      label: "Guess the Country",
      icon: Trophy,
      className:
        "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600",
    },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-slate-900/95 to-slate-800/95 backdrop-blur-sm border-b border-slate-700/50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <Link href="/malawi" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-white">
              Malawi Presentation
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    className={cn(
                      "text-white font-medium py-2 px-4 rounded-lg shadow-md transform transition-all duration-200 hover:scale-105",
                      item.className
                    )}
                  >
                    <IconComponent className="w-4 h-4 mr-2" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMenu}
              className="p-2 text-white hover:bg-slate-700/50"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-2 sm:px-3 bg-slate-800/95 border-t border-slate-700/50">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="block"
                  >
                    <Button
                      className={cn(
                        "w-full text-white font-medium py-2 px-4 rounded-lg shadow-md transform transition-all duration-200 hover:scale-105",
                        item.className
                      )}
                    >
                      <IconComponent className="w-4 h-4 mr-2" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
