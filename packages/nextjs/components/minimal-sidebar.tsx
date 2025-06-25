"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Coins, Home, Trophy, PlusCircle, User, Menu, X } from "lucide-react";

export function MinimalSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const navItems = [
    {
      href: "/",
      icon: Home,
      label: "Daily Puzzle",
      subtitle: "Today's Challenge",
    },
    {
      href: "/dashboard",
      icon: User,
      label: "My Progress",
      subtitle: "Stats & Rank",
    },
    {
      href: "/leaderboard",
      icon: Trophy,
      label: "Leaderboard",
      subtitle: "Top Players",
    },
    {
      href: "/create",
      icon: PlusCircle,
      label: "Create",
      subtitle: "Make Puzzle",
    },
  ];

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-white border border-gray-200 rounded-lg shadow-minimal hover-lift"
      >
        {isOpen ? (
          <X className="w-5 h-5 text-gray-600" />
        ) : (
          <Menu className="w-5 h-5 text-gray-600" />
        )}
      </button>

      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 backdrop-minimal z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-80 bg-white z-40 transform transition-all duration-300 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 border-r border-gray-200`}
      >
        {/* Sidebar Content */}
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white text-lg font-semibold">P</span>
              </div>
              <div>
                <h1 className="text-heading text-lg">Puzzle Adventure</h1>
                <p className="text-caption">Daily Challenges</p>
              </div>
            </div>

            {/* Token Balance */}
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Coins className="w-4 h-4 text-warning" />
                  <span className="text-subheading text-sm">Tokens</span>
                </div>
                <span className="text-heading font-semibold">1,247</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => isMobile && setIsOpen(false)}
                >
                  <div
                    className={`group p-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-primary text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`p-1.5 rounded ${isActive ? "bg-white/20" : "bg-gray-200 group-hover:bg-gray-300"}`}
                      >
                        <item.icon
                          className={`w-4 h-4 ${isActive ? "text-white" : "text-gray-600"}`}
                        />
                      </div>
                      <div className="flex-1">
                        <div
                          className={`font-medium text-sm ${isActive ? "text-white" : "text-gray-900"}`}
                        >
                          {item.label}
                        </div>
                        <div
                          className={`text-xs ${isActive ? "text-white/80" : "text-gray-500"}`}
                        >
                          {item.subtitle}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            {/* Status */}
            <div className="bg-gray-50 rounded-lg p-3 mb-3 border border-gray-200">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">7</span>
                </div>
                <div>
                  <p className="text-subheading text-sm">Day Streak</p>
                  <p className="text-caption text-xs">Keep it up!</p>
                </div>
              </div>
            </div>

            {/* Version */}
            <div className="text-center">
              <div className="inline-block p-2 bg-gray-100 rounded-lg border border-gray-200">
                <span className="text-caption text-xs">Version 1.0</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
