"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Coins, Home, Trophy, PlusCircle, User, Menu, X } from "lucide-react";

export function JapaneseSidebar() {
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
    { href: "/", icon: Home, label: "Daily Puzzle", subtitle: "今日の謎" },
    {
      href: "/dashboard",
      icon: User,
      label: "Pirate Companion",
      subtitle: "海賊の仲間",
    },
    {
      href: "/leaderboard",
      icon: Trophy,
      label: "Honor Board",
      subtitle: "名誉の板",
    },
    {
      href: "/create",
      icon: PlusCircle,
      label: "Create Puzzle",
      subtitle: "謎を作る",
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
        className="lg:hidden fixed top-4 left-4 z-50 p-3 wano-kibi text-[#2A2D66] rounded-full shadow-lg hover:shadow-xl transition-all duration-300 kibi-glow"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-[#2A2D66]/40 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-80 wano-kimono z-40 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 shadow-2xl border-r-4 border-[#F4C430]/30`}
      >
        {/* Traditional Pattern Overlay */}
        <div className="absolute inset-0 opacity-20">
          <div className="seigaiha-pattern h-full w-full"></div>
        </div>

        {/* Kimono Texture Overlay */}
        <div className="absolute inset-0 kimono-texture opacity-30"></div>

        {/* Sidebar Content */}
        <div className="relative z-10 h-full flex flex-col">
          {/* Header */}
          <div className="p-6 border-b-2 border-[#F4C430]/30">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 wano-kibi rounded-full flex items-center justify-center shadow-lg kibi-glow">
                <span className="text-2xl">🍡</span>
              </div>
              <div>
                <h1 className="text-[#F5F5F5] font-bold text-lg leading-tight">
                  Otama's Adventure
                </h1>
                <p className="text-[#F9C5D5] text-sm font-medium japanese-text">
                  お玉の冒険
                </p>
              </div>
            </div>

            {/* KIBI Balance */}
            <div className="bg-[#2A2D66]/60 rounded-lg p-3 border-2 border-[#F4C430]/40 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Coins className="w-5 h-5 text-[#F4C430]" />
                  <span className="text-[#F5F5F5] font-semibold">$KIBI</span>
                </div>
                <span className="text-[#F4C430] font-bold text-lg">1,247</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => isMobile && setIsOpen(false)}
                >
                  <div
                    className={`group relative p-4 rounded-lg transition-all duration-300 wano-corners ${
                      isActive
                        ? "bg-gradient-to-r from-[#F4C430]/20 to-[#F9C5D5]/20 border-l-4 border-[#F4C430] shadow-lg"
                        : "hover:bg-[#F5F5F5]/10 hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`p-2 rounded-lg transition-all duration-300 ${
                          isActive
                            ? "bg-[#F4C430]/30 text-[#F4C430] shadow-md"
                            : "bg-[#F5F5F5]/20 text-[#F9C5D5] group-hover:text-[#F5F5F5] group-hover:bg-[#F5F5F5]/30"
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
                          className={`text-sm transition-colors duration-300 japanese-text ${
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
                      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-[#F4C430] rounded-l-full shadow-lg kibi-glow"></div>
                    )}
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t-2 border-[#F4C430]/30">
            {/* Otama Character */}
            <div className="bg-gradient-to-r from-[#F9C5D5]/20 to-[#8B5FBF]/20 rounded-lg p-4 mb-4 border-2 border-[#F9C5D5]/30 backdrop-blur-sm">
              <div className="flex items-center space-x-3">
                <div className="text-3xl sakura-float">👧</div>
                <div>
                  <p className="text-[#F9C5D5] text-sm font-medium">
                    Otama says:
                  </p>
                  <p className="text-[#F5F5F5] text-xs">
                    "The power of kibi dango brings peace to Wano!"
                  </p>
                </div>
              </div>
            </div>

            {/* Traditional Seal */}
            <div className="text-center">
              <div className="inline-block p-3 bg-[#2A2D66]/60 rounded-full border-2 border-[#F4C430]/50 backdrop-blur-sm">
                <div className="w-8 h-8 wano-kibi rounded-full flex items-center justify-center shadow-md">
                  <span className="text-[#2A2D66] font-bold text-sm">玉</span>
                </div>
              </div>
              <p className="text-[#F9C5D5] text-xs mt-2 font-medium japanese-text">
                Otama's Seal
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
