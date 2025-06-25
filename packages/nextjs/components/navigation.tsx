"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "~~/components/ui/button";
import { Coins, Home, Trophy, PlusCircle, User } from "lucide-react";

export function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", icon: Home, label: "Puzzle" },
    { href: "/dashboard", icon: User, label: "Pirate" },
    { href: "/leaderboard", icon: Trophy, label: "Leaderboard" },
    { href: "/create", icon: PlusCircle, label: "Create" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 shadow-lg border-b-4 border-yellow-600">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-lg">🍡</span>
            </div>
            <h1 className="text-white font-bold text-lg hidden sm:block">
              Otama's Puzzle Adventure
            </h1>
          </div>

          <div className="flex items-center space-x-1 sm:space-x-2">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={pathname === item.href ? "secondary" : "ghost"}
                  size="sm"
                  className={`text-white hover:bg-white/20 ${pathname === item.href ? "bg-white/30" : ""}`}
                >
                  <item.icon className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Button>
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-2 text-white">
            <Coins className="w-5 h-5 text-yellow-200" />
            <span className="font-bold">1,247 $KIBI</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
