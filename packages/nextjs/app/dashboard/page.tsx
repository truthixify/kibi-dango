"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~~/components/ui/card";
import { Button } from "~~/components/ui/button";
import { Progress } from "~~/components/ui/progress";
import { Coins, Star, TrendingUp, Award } from "lucide-react";

export default function DashboardPage() {
  const currentRank = "Advanced";
  const solveCount = 42;
  const tokenBalance = 1247;
  const nextRankProgress = 75;

  const ranks = [
    { name: "Beginner", minSolves: 0, color: "bg-gray-400" },
    { name: "Novice", minSolves: 10, color: "bg-primary" },
    { name: "Advanced", minSolves: 25, color: "bg-warning" },
    { name: "Expert", minSolves: 50, color: "bg-success" },
    { name: "Master", minSolves: 100, color: "bg-error" },
  ];

  return (
    <div className="minimal-container py-8">
      <div className="max-w-5xl mx-auto fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-heading text-3xl mb-2">My Progress</h1>
          <p className="text-body">Track your puzzle-solving journey</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Progress Card */}
          <Card className="minimal-card hover-lift">
            <CardHeader className="bg-gray-50 border-b border-gray-200">
              <CardTitle className="text-heading text-xl flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                {currentRank} Player
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <div className="w-24 h-24 mx-auto bg-primary rounded-2xl flex items-center justify-center text-4xl mb-4">
                  🏆
                </div>
                <div className="inline-block bg-warning text-white px-3 py-1 rounded-full text-sm font-medium">
                  {currentRank} Rank
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-subheading">Puzzles Solved:</span>
                  <span className="text-heading text-xl font-semibold">
                    {solveCount}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-subheading">Token Balance:</span>
                  <div className="flex items-center gap-2">
                    <Coins className="w-4 h-4 text-warning" />
                    <span className="text-heading text-xl font-semibold">
                      {tokenBalance.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-subheading">Progress to Expert:</span>
                    <span className="text-caption">{nextRankProgress}%</span>
                  </div>
                  <Progress value={nextRankProgress} className="h-2" />
                  <p className="text-caption mt-1">
                    {50 - solveCount} more solves needed!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats and Actions */}
          <div className="space-y-6">
            {/* Recent Achievements */}
            <Card className="minimal-card border-success">
              <CardHeader>
                <CardTitle className="text-heading text-lg flex items-center gap-2">
                  <Star className="w-4 h-4 text-success" />
                  Recent Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-warning rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">🔥</span>
                    </div>
                    <div>
                      <h4 className="text-subheading text-sm font-medium">
                        7-Day Streak!
                      </h4>
                      <p className="text-caption text-xs">
                        Solved puzzles for 7 days straight
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">⚡</span>
                    </div>
                    <div>
                      <h4 className="text-subheading text-sm font-medium">
                        Advanced Rank!
                      </h4>
                      <p className="text-caption text-xs">
                        Reached 25 puzzle solves
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">🧩</span>
                    </div>
                    <div>
                      <h4 className="text-subheading text-sm font-medium">
                        Puzzle Master
                      </h4>
                      <p className="text-caption text-xs">
                        Solved 10 crypto riddles
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Rank Progression */}
            <Card className="minimal-card">
              <CardHeader>
                <CardTitle className="text-heading text-lg flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  Rank Progression
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  {ranks.map((rank) => (
                    <div key={rank.name} className="flex items-center gap-3">
                      <div
                        className={`w-3 h-3 rounded-full ${solveCount >= rank.minSolves ? rank.color : "bg-gray-300"}`}
                      ></div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <span
                            className={`text-sm font-medium ${
                              rank.name === currentRank
                                ? "text-primary"
                                : solveCount >= rank.minSolves
                                  ? "text-gray-900"
                                  : "text-gray-500"
                            }`}
                          >
                            {rank.name}
                          </span>
                          <span className="text-caption text-xs">
                            {rank.minSolves} solves
                          </span>
                        </div>
                        {rank.name === currentRank && (
                          <div className="inline-block bg-gray-200 text-gray-700 px-2 py-0.5 rounded text-xs mt-1">
                            Current
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="minimal-card">
              <CardHeader>
                <CardTitle className="text-heading text-lg">
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-3">
                  <Button className="minimal-button minimal-button-primary text-sm">
                    Today's Puzzle
                  </Button>
                  <Button className="minimal-button minimal-button-secondary text-sm">
                    Leaderboard
                  </Button>
                  <Button className="minimal-button minimal-button-secondary text-sm">
                    Create Puzzle
                  </Button>
                  <Button className="minimal-button minimal-button-secondary text-sm">
                    View History
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
