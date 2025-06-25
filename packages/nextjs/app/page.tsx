"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "~~/components/ui/button";
import { Input } from "~~/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~~/components/ui/card";
import { MinimalLoader } from "~~/components/minimal-loader";
import { MinimalSuccess } from "~~/components/minimal-success";
import { MinimalFailure } from "~~/components/minimal-failure";

export default function PuzzlePage() {
  const [answer, setAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFailure, setShowFailure] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);

    // Check if answer is correct (for demo, 'A' is correct)
    if (answer.toUpperCase() === "A") {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } else {
      setShowFailure(true);
      setTimeout(() => setShowFailure(false), 3000);
    }

    setAnswer("");
  };

  return (
    <div className="minimal-container py-8 lg:py-12">
      <div className="max-w-3xl mx-auto fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-xl">🧩</span>
          </div>
          <h1 className="text-heading text-3xl mb-2">Daily Puzzle</h1>
          <p className="text-body">Solve today's challenge and earn tokens</p>
        </div>

        {/* Puzzle Card */}
        <Card className="mb-8 minimal-card hover-lift">
          <CardHeader className="bg-gray-50 border-b border-gray-200">
            <CardTitle className="text-heading text-xl flex items-center gap-2">
              <span>📅</span>
              Puzzle #247 - December 24, 2024
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="bg-blue-50 border-l-4 border-primary p-4 mb-6 rounded-r-lg">
              <h3 className="text-subheading text-lg mb-3">
                Today's Challenge
              </h3>
              <p className="text-body leading-relaxed">
                I am the first letter of the blockchain that started it all. The
                genesis of digital currency that revolutionized finance.
                Satoshi's creation, decentralized and free. What letter am I?
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-subheading text-sm font-medium mb-2">
                  Your Answer (Single Letter):
                </label>
                <div className="flex gap-3">
                  <Input
                    type="text"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value.slice(0, 1))}
                    placeholder="Enter letter..."
                    className="text-xl text-center font-semibold h-12 minimal-input focus-minimal"
                    maxLength={1}
                    disabled={isSubmitting}
                  />
                  <Button
                    type="submit"
                    disabled={!answer || isSubmitting}
                    className="h-12 px-6 minimal-button minimal-button-primary font-medium"
                  >
                    {isSubmitting ? "Checking..." : "Submit"}
                  </Button>
                </div>
              </div>
            </form>

            {/* Hint */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-warning rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs">💡</span>
                </div>
                <div>
                  <h4 className="text-subheading text-sm font-medium mb-1">
                    Hint
                  </h4>
                  <p className="text-body text-sm">
                    Think about the most famous cryptocurrency. What's the first
                    letter of its name?
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="minimal-card hover-lift">
            <CardContent className="p-4 text-center">
              <div className="w-8 h-8 bg-success rounded-lg flex items-center justify-center mx-auto mb-2">
                <span className="text-white text-sm">🏆</span>
              </div>
              <h3 className="text-subheading text-sm font-medium">Streak</h3>
              <p className="text-heading text-xl font-semibold">7 days</p>
            </CardContent>
          </Card>

          <Card className="minimal-card hover-lift">
            <CardContent className="p-4 text-center">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mx-auto mb-2">
                <span className="text-white text-sm">⚡</span>
              </div>
              <h3 className="text-subheading text-sm font-medium">Solved</h3>
              <p className="text-heading text-xl font-semibold">42</p>
            </CardContent>
          </Card>

          <Card className="minimal-card hover-lift">
            <CardContent className="p-4 text-center">
              <div className="w-8 h-8 bg-warning rounded-lg flex items-center justify-center mx-auto mb-2">
                <span className="text-white text-sm">🪙</span>
              </div>
              <h3 className="text-subheading text-sm font-medium">Tokens</h3>
              <p className="text-heading text-xl font-semibold">1,247</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modals */}
      {isSubmitting && <MinimalLoader />}
      {showSuccess && <MinimalSuccess />}
      {showFailure && <MinimalFailure />}
    </div>
  );
}
