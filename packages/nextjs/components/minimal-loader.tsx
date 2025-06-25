"use client";

export function MinimalLoader() {
  return (
    <div className="fixed inset-0 backdrop-minimal flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-sm mx-4 text-center minimal-card shadow-medium">
        <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
          <span className="text-white text-2xl">⏳</span>
        </div>

        <h3 className="text-heading text-lg mb-2">Checking Answer</h3>
        <p className="text-body text-sm mb-4">
          Please wait while we verify your solution...
        </p>

        <div className="loading-dots justify-center">
          <div className="loading-dot"></div>
          <div className="loading-dot"></div>
          <div className="loading-dot"></div>
        </div>
      </div>
    </div>
  );
}
