'use client'

export function FailureAnimation() {
    return (
        <div className="modern-backdrop fixed inset-0 z-50 flex items-center justify-center">
            <div className="glass-card shadow-strong border-soft smooth-fade-in mx-4 max-w-md p-8 text-center">
                <div className="mb-6">
                    <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-[#5E5E5E] to-[#A22C29] text-4xl">
                        😕
                    </div>
                    <div className="mb-4 flex justify-center space-x-2">
                        <div className="h-3 w-3 rounded-full bg-[#5E5E5E] opacity-60"></div>
                        <div className="h-3 w-3 rounded-full bg-[#5E5E5E] opacity-60"></div>
                        <div className="h-3 w-3 rounded-full bg-[#5E5E5E] opacity-60"></div>
                    </div>
                </div>

                <h3 className="mb-2 text-2xl font-bold text-[#A22C29]">Not quite right... 🤔</h3>
                <p className="text-body mb-4">Otama looks confused - the beast is still wild!</p>

                <div className="bg-light border-soft rounded-xl p-4 backdrop-blur-sm">
                    <div className="mb-2 flex items-center justify-center space-x-4">
                        <span className="text-2xl">👧</span>
                        <span className="text-xl text-[#5E5E5E]">❓</span>
                        <span className="text-2xl">🐺</span>
                        <span className="text-xl text-[#A22C29]">😤</span>
                    </div>
                    <p className="text-body mb-3 text-sm">
                        "Hmm... that's not quite right. The beast is still wild!"
                    </p>
                    <div className="text-sm font-semibold text-[#8B5FBF]">
                        💡 Try again! Think about the first cryptocurrency...
                    </div>
                </div>
            </div>
        </div>
    )
}
