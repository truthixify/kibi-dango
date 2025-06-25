"use client";

export function MinimalSuccess() {
  return (
    <div className="fixed inset-0 backdrop-minimal flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-sm mx-4 text-center minimal-card shadow-medium border-success">
        <div className="w-16 h-16 bg-success rounded-xl flex items-center justify-center mx-auto mb-4">
          <span className="text-white text-2xl">✓</span>
        </div>

        <h3 className="text-heading text-lg mb-2">Correct!</h3>
        <p className="text-body text-sm mb-4">
          Great job! You solved today's puzzle.
        </p>

        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-center space-x-3 mb-2">
            <span className="text-lg">🧩</span>
            <span className="text-gray-400">→</span>
            <span className="text-lg">🪙</span>
          </div>
          <p className="text-success font-semibold">+50 Tokens Earned!</p>
          <p className="text-caption text-xs mt-1">Streak continues!</p>
        </div>
      </div>
    </div>
  );
}
