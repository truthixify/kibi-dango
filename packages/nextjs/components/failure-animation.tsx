"use client";

export function FailureAnimation() {
  return (
    <div className="fixed inset-0 modern-backdrop flex items-center justify-center z-50">
      <div className="glass-card p-8 max-w-md mx-4 text-center shadow-strong border-soft smooth-fade-in">
        <div className="mb-6">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-[#5E5E5E] to-[#A22C29] rounded-2xl flex items-center justify-center text-4xl mb-4">
            😕
          </div>
          <div className="flex justify-center space-x-2 mb-4">
            <div className="w-3 h-3 bg-[#5E5E5E] rounded-full opacity-60"></div>
            <div className="w-3 h-3 bg-[#5E5E5E] rounded-full opacity-60"></div>
            <div className="w-3 h-3 bg-[#5E5E5E] rounded-full opacity-60"></div>
          </div>
        </div>

        <h3 className="text-2xl font-bold text-[#A22C29] mb-2">
          Not quite right... 🤔
        </h3>
        <p className="text-body mb-4">
          Otama looks confused - the beast is still wild!
        </p>

        <div className="bg-light rounded-xl p-4 border-soft backdrop-blur-sm">
          <div className="flex items-center justify-center space-x-4 mb-2">
            <span className="text-2xl">👧</span>
            <span className="text-xl text-[#5E5E5E]">❓</span>
            <span className="text-2xl">🐺</span>
            <span className="text-xl text-[#A22C29]">😤</span>
          </div>
          <p className="text-sm text-body mb-3">
            "Hmm... that's not quite right. The beast is still wild!"
          </p>
          <div className="text-sm text-[#8B5FBF] font-semibold">
            💡 Try again! Think about the first cryptocurrency...
          </div>
        </div>
      </div>
    </div>
  );
}
