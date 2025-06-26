import type { Metadata } from 'next'
import { ScaffoldStarkAppWithProviders } from '~~/components/ScaffoldStarkAppWithProviders'
import '~~/styles/globals.css'
import { ThemeProvider } from '~~/components/ThemeProvider'
import { Sidebar } from '~~/components/sidebar'

export const metadata: Metadata = {
    title: 'Scaffold-Stark',
    description: 'Fast track your starknet journey',
    icons: '/logo.ico',
}

const ScaffoldStarkApp = ({ children }: { children: React.ReactNode }) => {
    return (
        <html suppressHydrationWarning>
            <body suppressHydrationWarning>
                <ThemeProvider enableSystem>
                    <ScaffoldStarkAppWithProviders>
                        <Sidebar />
                        {children}
                    </ScaffoldStarkAppWithProviders>
                </ThemeProvider>
            </body>
        </html>
    )
}

export default ScaffoldStarkApp
