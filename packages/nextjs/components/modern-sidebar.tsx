"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Coins, Home, Trophy, PlusCircle, User, Menu, X } from "lucide-react";

export function ModernSidebar() {
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
    { href: "/", icon: Home, label: "Daily Puzzle", subtitle: "Solve & Earn" },
    {
      href: "/dashboard",
      icon: User,
      label: "My Companion",
      subtitle: "Beast Pirates",
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
      label: "Create Puzzle",
      subtitle: "Share & Challenge",
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
        className="lg:hidden fixed top-4 left-4 z-50 p-3 modern-card shadow-medium modern-hover soft-glow"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-[#F4C430]" />
        ) : (
          <Menu className="w-6 h-6 text-[#F4C430]" />
        )}
      </button>

      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 modern-backdrop z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-80 bg-gradient-to-b from-[#2a2d66] to-[#1e2147] z-40 transform transition-all duration-300 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 shadow-strong border-r border-[#F4C430]/20`}
      >
        {/* Subtle Pattern Overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="grid-pattern h-full w-full"></div>
        </div>

        {/* Sidebar Content */}
        <div className="relative z-10 h-full flex flex-col smooth-fade-in">
          {/* Header */}
          <div className="p-6 border-b border-[#F4C430]/20">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#F4C430] to-[#e6b800] rounded-xl flex items-center justify-center shadow-medium soft-glow">
                <span className="text-2xl">🍡</span>
              </div>
              <div>
                <h1 className="text-[#F4C430] font-bold text-lg leading-tight">
                  Otama's Adventure
                </h1>
                <p className="text-[#F9C5D5] text-sm font-medium">
                  Kibi Dango Quest
                </p>
              </div>
            </div>

            {/* KIBI Balance */}
            <div className="glass-card p-3 border-accent">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Coins className="w-5 h-5 text-[#F4C430] gentle-float" />
                  <span className="text-[#F5F5F5] font-semibold">$KIBI</span>
                </div>
                <span className="text-[#F4C430] font-bold text-lg accent-text">
                  1,247
                </span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item, index) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => isMobile && setIsOpen(false)}
                >
                  <div
                    className={`group relative p-4 rounded-xl transition-all duration-300 ${
                      isActive
                        ? "glass-card border-accent shadow-medium soft-glow"
                        : "bg-light hover:bg-medium modern-hover"
                    }`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`p-2 rounded-lg transition-all duration-300 ${
                          isActive
                            ? "bg-accent text-[#2A2D66] shadow-soft"
                            : "bg-medium text-[#F9C5D5] group-hover:text-[#F5F5F5] group-hover:bg-accent group-hover:text-[#2A2D66]"
                        }`}
                      >
                        <item.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div
                          className={`font-semibold transition-colors duration-300 ${
                            isActive
                              ? "text-[#F4C430]"
                              : "text-[#F5F5F5] group-hover:text-[#F9C5D5]"
                          }`}
                        >
                          {item.label}
                        </div>
                        <div
                          className={`text-sm transition-colors duration-300 ${
                            isActive
                              ? "text-[#F9C5D5]"
                              : "text-[#F9C5D5]/70 group-hover:text-[#F9C5D5]"
                          }`}
                        >
                          {item.subtitle}
                        </div>
                      </div>
                    </div>

                    {/* Active Indicator */}
                    {isActive && (
                      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-[#F4C430] rounded-l-full shadow-soft soft-glow"></div>
                    )}
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-[#F4C430]/20">
            {/* Otama Character */}
            <div className="glass-card p-4 mb-4 border-soft">
              <div className="flex items-center space-x-3">
                <div className="text-3xl gentle-float">👧</div>
                <div>
                  <p className="text-[#F9C5D5] text-sm font-medium">
                    Otama says:
                  </p>
                  <p className="text-[#F5F5F5] text-xs">
                    "Keep solving puzzles and help more friends!"
                  </p>
                </div>
              </div>
            </div>

            {/* App Version */}
            <div className="text-center">
              <div className="inline-block p-3 glass-card border-accent">
                <div className="w-8 h-8 bg-gradient-to-br from-[#F4C430] to-[#8B5FBF] rounded-full flex items-center justify-center shadow-soft">
                  <span className="text-[#2A2D66] font-bold text-sm">v1</span>
                </div>
              </div>
              <p className="text-[#F9C5D5] text-xs mt-2 font-medium">
                Puzzle Adventure
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
