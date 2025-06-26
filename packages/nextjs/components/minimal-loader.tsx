'use client'

export function MinimalLoader() {
    return (
        <div className="backdrop-minimal fixed inset-0 z-50 flex items-center justify-center">
            <div className="minimal-card shadow-medium mx-4 max-w-sm rounded-lg bg-white p-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-primary">
                    <span className="text-2xl text-white">⏳</span>
                </div>

                <h3 className="text-heading mb-2 text-lg">Checking Answer</h3>
                <p className="text-body mb-4 text-sm">
                    Please wait while we verify your solution...
                </p>

                <div className="loading-dots justify-center">
                    <div className="loading-dot"></div>
                    <div className="loading-dot"></div>
                    <div className="loading-dot"></div>
                </div>
            </div>
        </div>
    )
}
