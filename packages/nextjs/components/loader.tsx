'use client'

interface LoaderProps {
    title: string
    description: string
}

export function Loader({ title, description }: LoaderProps) {
    return (
        <div className="fixed inset-0 z-50 flex h-screen w-full items-center justify-center backdrop-blur-sm">
            <div className="minimal-card shadow-medium mx-4 max-w-sm rounded-lg bg-white p-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-primary">
                    <span className="text-2xl text-white">⏳</span>
                </div>

                <h3 className="text-heading mb-2 text-lg">{title}</h3>
                <p className="text-body mb-4 text-sm">{description}</p>

                <div className="loading-dots justify-center">
                    <div className="loading-dot"></div>
                    <div className="loading-dot"></div>
                    <div className="loading-dot"></div>
                </div>
            </div>
        </div>
    )
}
