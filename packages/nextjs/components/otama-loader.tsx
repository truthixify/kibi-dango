"use client";

export function OtamaLoader() {
  return (
    <div className="fixed inset-0 modern-backdrop flex items-center justify-center z-50">
      <div className="glass-card p-8 max-w-md mx-4 text-center shadow-strong smooth-fade-in">
        <div className="mb-6">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-[#F4C430] to-[#e6b800] rounded-2xl flex items-center justify-center text-4xl mb-4 subtle-bounce soft-glow">
            👧
          </div>
          <div className="flex justify-center space-x-2 mb-4">
            <div className="w-4 h-4 bg-[#F9C5D5] rounded-full loading-pulse"></div>
            <div
              className="w-4 h-4 bg-[#8B5FBF] rounded-full loading-pulse"
              style={{ animationDelay: "0.3s" }}
            ></div>
            <div
              className="w-4 h-4 bg-[#5D9B75] rounded-full loading-pulse"
              style={{ animationDelay: "0.6s" }}
            ></div>
          </div>
        </div>

        <h3 className="text-xl font-bold heading-primary mb-2">
          Otama is preparing her magic kibi dango! 🍡
        </h3>
        <p className="text-body">Creating the perfect puzzle solution...</p>

        <div className="mt-4 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F4C430] soft-glow"></div>
        </div>
      </div>
    </div>
  );
}
