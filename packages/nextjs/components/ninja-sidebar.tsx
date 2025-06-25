"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Coins, Home, Trophy, PlusCircle, User, Menu, X } from "lucide-react";

export function NinjaSidebar() {
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
    { href: "/", icon: Home, label: "Shadow Puzzle", subtitle: "影の謎" },
    {
      href: "/dashboard",
      icon: User,
      label: "Ninja Companion",
      subtitle: "忍者の仲間",
    },
    {
      href: "/leaderboard",
      icon: Trophy,
      label: "Honor Scroll",
      subtitle: "名誉の巻物",
    },
    {
      href: "/create",
      icon: PlusCircle,
      label: "Forge Puzzle",
      subtitle: "謎を鍛える",
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
        className="lg:hidden fixed top-4 left-4 z-50 p-3 ninja-card rounded-full shadow-lg stealth-hover ninja-glow"
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
          className="fixed inset-0 stealth-backdrop z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-80 ninja-shadow-dark z-40 transform transition-all duration-500 ease-out ${
          isOpen ? "translate-x-0 skew-x-0" : "-translate-x-full skew-x-[-5deg]"
        } lg:translate-x-0 lg:skew-x-0 shadow-2xl border-r-2 border-[#F4C430]/30 ninja-border`}
      >
        {/* Ninja Pattern Overlay */}
        <div className="absolute inset-0 opacity-20">
          <div className="shuriken-pattern h-full w-full"></div>
        </div>

        {/* Stealth Gradient Overlay */}
        <div className="absolute inset-0 ninja-mist"></div>

        {/* Sidebar Content */}
        <div className="relative z-10 h-full flex flex-col ninja-slide-in">
          {/* Header */}
          <div className="p-6 border-b-2 border-[#F4C430]/30 ninja-border-small">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 ninja-card rounded-full flex items-center justify-center shadow-lg ninja-glow shuriken-spin">
                <span className="text-2xl">🥷</span>
              </div>
              <div>
                <h1 className="text-[#F4C430] font-bold text-lg leading-tight stealth-text">
                  Ninja Otama
                </h1>
                <p className="text-[#F9C5D5] text-sm font-medium japanese-ninja-text">
                  忍者お玉
                </p>
              </div>
            </div>

            {/* KIBI Balance */}
            <div className="ninja-card rounded-lg p-3 border-2 border-[#F4C430]/40 backdrop-blur-sm blade-slash">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Coins className="w-5 h-5 text-[#F4C430] ninja-float" />
                  <span className="text-[#F5F5F5] font-semibold stealth-text">
                    $KIBI
                  </span>
                </div>
                <span className="text-[#F4C430] font-bold text-lg stealth-text">
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
                    className={`group relative p-4 rounded-lg transition-all duration-300 ninja-border-small shadow-strike ${
                      isActive
                        ? "ninja-card border-l-4 border-[#F4C430] shadow-lg ninja-glow"
                        : "ninja-shadow-light hover:ninja-shadow-medium stealth-hover"
                    }`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {/* Sharp corner decorations */}
                    <div className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2 border-[#F4C430]/60"></div>
                    <div className="absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2 border-[#F4C430]/60"></div>

                    <div className="flex items-center space-x-3">
                      <div
                        className={`p-2 rounded-lg transition-all duration-300 ninja-border-small ${
                          isActive
                            ? "ninja-glow text-[#F4C430] shadow-md"
                            : "ninja-shadow-medium text-[#F9C5D5] group-hover:text-[#F5F5F5] group-hover:ninja-glow"
                        }`}
                      >
                        <item.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div
                          className={`font-semibold transition-colors duration-300 stealth-text ${
                            isActive
                              ? "text-[#F4C430]"
                              : "text-[#F5F5F5] group-hover:text-[#F9C5D5]"
                          }`}
                        >
                          {item.label}
                        </div>
                        <div
                          className={`text-sm transition-colors duration-300 japanese-ninja-text ${
                            isActive
                              ? "text-[#F9C5D5]"
                              : "text-[#F9C5D5]/70 group-hover:text-[#F9C5D5]"
                          }`}
                        >
                          {item.subtitle}
                        </div>
                      </div>
                    </div>

                    {/* Active Indicator - Kunai */}
                    {isActive && (
                      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-[#F4C430] ninja-border-small shadow-lg ninja-glow"></div>
                    )}
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t-2 border-[#F4C430]/30 ninja-border-small">
            {/* Otama Character */}
            <div className="ninja-card rounded-lg p-4 mb-4 border-2 border-[#F9C5D5]/30 backdrop-blur-sm smoke-effect">
              <div className="flex items-center space-x-3">
                <div className="text-3xl ninja-float">🥷</div>
                <div>
                  <p className="text-[#F9C5D5] text-sm font-medium stealth-text">
                    Ninja Otama whispers:
                  </p>
                  <p className="text-[#F5F5F5] text-xs japanese-ninja-text">
                    "Strike from the shadows with wisdom!"
                  </p>
                </div>
              </div>
            </div>

            {/* Traditional Seal */}
            <div className="text-center">
              <div className="inline-block p-3 ninja-card rounded-full border-2 border-[#F4C430]/50 backdrop-blur-sm ninja-glow">
                <div className="w-8 h-8 bg-gradient-to-br from-[#F4C430] to-[#8B5FBF] rounded-full flex items-center justify-center shadow-md ninja-border-small">
                  <span className="text-[#2A2D66] font-bold text-sm">忍</span>
                </div>
              </div>
              <p className="text-[#F9C5D5] text-xs mt-2 font-medium japanese-ninja-text stealth-text">
                Ninja Seal
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
