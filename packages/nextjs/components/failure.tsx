'use client'

export function Failure({ hint, onClose }: { hint: string; onClose: () => void }) {
    return (
        <div className="backdrop-minimal fixed inset-0 z-50 flex items-center justify-center">
            <div className="minimal-card shadow-medium mx-4 max-w-sm rounded-lg border-error bg-white p-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-error">
                    <span className="text-2xl text-white">✗</span>
                </div>

                <h3 className="text-heading mb-2 text-lg">Not Quite</h3>
                <p className="text-body mb-4 text-sm">That's not the right answer. Try again!</p>

                <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <div className="mb-2 flex items-center justify-center space-x-3">
                        <span className="text-lg">🤔</span>
                        <span className="text-gray-400">→</span>
                        <span className="text-lg">💡</span>
                    </div>
                    <p className="text-caption text-sm">{hint}</p>
                </div>

                <button
                    onClick={onClose}
                    className="hover:bg-success-dark mt-2 rounded bg-success px-4 py-2 text-sm text-white transition-colors"
                >
                    Close
                </button>
            </div>
        </div>
    )
}
