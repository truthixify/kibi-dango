"use client";

export function SuccessAnimation() {
  return (
    <div className="fixed inset-0 modern-backdrop flex items-center justify-center z-50">
      <div className="glass-card p-8 max-w-md mx-4 text-center shadow-strong border-success smooth-fade-in">
        <div className="mb-6">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-[#5D9B75] to-[#4a7a5f] rounded-2xl flex items-center justify-center text-4xl mb-4 gentle-float soft-glow">
            🎉
          </div>
          <div className="flex justify-center space-x-1 mb-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="w-3 h-3 bg-[#F4C430] rounded-full subtle-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              ></div>
            ))}
          </div>
        </div>

        <h3 className="text-2xl font-bold text-[#5D9B75] mb-2">
          Correct! 🍡✨
        </h3>
        <p className="text-body mb-4">
          Otama happily gives a kibi dango to a beast pirate!
        </p>

        <div className="bg-light rounded-xl p-4 border-success backdrop-blur-sm">
          <div className="flex items-center justify-center space-x-4 mb-2">
            <span className="text-2xl gentle-float">👧</span>
            <span className="text-xl text-[#F4C430]">➡️</span>
            <span className="text-2xl subtle-bounce">🍡</span>
            <span className="text-xl text-[#F4C430]">➡️</span>
            <span className="text-2xl gentle-float">🐺</span>
          </div>
          <p className="text-sm text-body mb-3">
            "Another beast tamed with the power of kibi dango!"
          </p>
          <div className="text-lg font-bold accent-text">
            +50 $KIBI earned! 🪙
          </div>
          <div className="text-sm text-[#8B5FBF] font-semibold">
            Your pirate leveled up! ⚡
          </div>
        </div>
      </div>
    </div>
  );
}
