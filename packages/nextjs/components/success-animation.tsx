'use client'

export function SuccessAnimation() {
    return (
        <div className="modern-backdrop fixed inset-0 z-50 flex items-center justify-center">
            <div className="glass-card shadow-strong smooth-fade-in mx-4 max-w-md border-success p-8 text-center">
                <div className="mb-6">
                    <div className="gentle-float soft-glow mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-[#5D9B75] to-[#4a7a5f] text-4xl">
                        🎉
                    </div>
                    <div className="mb-4 flex justify-center space-x-1">
                        {[...Array(6)].map((_, i) => (
                            <div
                                key={i}
                                className="subtle-bounce h-3 w-3 rounded-full bg-[#F4C430]"
                                style={{ animationDelay: `${i * 0.15}s` }}
                            ></div>
                        ))}
                    </div>
                </div>

                <h3 className="mb-2 text-2xl font-bold text-[#5D9B75]">Correct! 🍡✨</h3>
                <p className="text-body mb-4">
                    Otama happily gives a kibi dango to a beast pirate!
                </p>

                <div className="bg-light rounded-xl border-success p-4 backdrop-blur-sm">
                    <div className="mb-2 flex items-center justify-center space-x-4">
                        <span className="gentle-float text-2xl">👧</span>
                        <span className="text-xl text-[#F4C430]">➡️</span>
                        <span className="subtle-bounce text-2xl">🍡</span>
                        <span className="text-xl text-[#F4C430]">➡️</span>
                        <span className="gentle-float text-2xl">🐺</span>
                    </div>
                    <p className="text-body mb-3 text-sm">
                        "Another beast tamed with the power of kibi dango!"
                    </p>
                    <div className="accent-text text-lg font-bold">+50 $KIBI earned! 🪙</div>
                    <div className="text-sm font-semibold text-[#8B5FBF]">
                        Your pirate leveled up! ⚡
                    </div>
                </div>
            </div>
        </div>
    )
}
