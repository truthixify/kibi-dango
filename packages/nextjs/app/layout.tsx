import type { Metadata } from 'next'
import { ScaffoldStarkAppWithProviders } from '~~/components/ScaffoldStarkAppWithProviders'
import '~~/styles/globals.css'
import { ThemeProvider } from '~~/components/ThemeProvider'
import { Sidebar } from '~~/components/sidebar'
import { Main } from '~~/components/main'

export const metadata: Metadata = {
    title: 'Kibi Dango',
    description:
        'Animal kingdom meets Starknet! Solve puzzles, earn $KIBI, and become a pirate legend.',
    icons: '/logo.ico',
}

const ScaffoldStarkApp = ({ children }: { children: React.ReactNode }) => {
    return (
        <html suppressHydrationWarning>
            <body suppressHydrationWarning>
                <ThemeProvider enableSystem={false}>
                    <ScaffoldStarkAppWithProviders>
                        <Sidebar />
                        <Main>{children}</Main>
                    </ScaffoldStarkAppWithProviders>
                </ThemeProvider>
            </body>
        </html>
    )
}

export default ScaffoldStarkApp
