'use client'

export function Success() {
    return (
        <div className="backdrop-minimal fixed inset-0 z-50 flex items-center justify-center">
            <div className="minimal-card shadow-medium mx-4 max-w-sm rounded-lg border-success bg-white p-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-success">
                    <span className="text-2xl text-white">✓</span>
                </div>

                <h3 className="text-heading mb-2 text-lg">Correct!</h3>
                <p className="text-body mb-4 text-sm">Great job! You solved today's puzzle.</p>

                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <div className="mb-2 flex items-center justify-center space-x-3">
                        <span className="text-lg">🧩</span>
                        <span className="text-gray-400">→</span>
                        <span className="text-lg">🪙</span>
                    </div>
                    <p className="font-semibold text-success">+50 Tokens Earned!</p>
                    <p className="text-caption mt-1 text-xs">Streak continues!</p>
                </div>
            </div>
        </div>
    )
}
