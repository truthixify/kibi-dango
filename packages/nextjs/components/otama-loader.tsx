'use client'

export function OtamaLoader() {
    return (
        <div className="modern-backdrop fixed inset-0 z-50 flex items-center justify-center">
            <div className="glass-card shadow-strong smooth-fade-in mx-4 max-w-md p-8 text-center">
                <div className="mb-6">
                    <div className="subtle-bounce soft-glow mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-[#F4C430] to-[#e6b800] text-4xl">
                        👧
                    </div>
                    <div className="mb-4 flex justify-center space-x-2">
                        <div className="loading-pulse h-4 w-4 rounded-full bg-[#F9C5D5]"></div>
                        <div
                            className="loading-pulse h-4 w-4 rounded-full bg-[#8B5FBF]"
                            style={{ animationDelay: '0.3s' }}
                        ></div>
                        <div
                            className="loading-pulse h-4 w-4 rounded-full bg-[#5D9B75]"
                            style={{ animationDelay: '0.6s' }}
                        ></div>
                    </div>
                </div>

                <h3 className="heading-primary mb-2 text-xl font-bold">
                    Otama is preparing her magic kibi dango! 🍡
                </h3>
                <p className="text-body">Creating the perfect puzzle solution...</p>

                <div className="mt-4 flex justify-center">
                    <div className="soft-glow h-8 w-8 animate-spin rounded-full border-b-2 border-[#F4C430]"></div>
                </div>
            </div>
        </div>
    )
}
