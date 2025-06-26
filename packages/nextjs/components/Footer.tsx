import { Cog8ToothIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline'
import { useTargetNetwork } from '~~/hooks/scaffold-stark/useTargetNetwork'
import { devnet, sepolia, mainnet } from '@starknet-react/chains'
import { Faucet } from '~~/components/scaffold-stark/Faucet'
import { FaucetSepolia } from '~~/components/scaffold-stark/FaucetSepolia'
import { BlockExplorerSepolia } from './scaffold-stark/BlockExplorerSepolia'
import { BlockExplorer } from './scaffold-stark/BlockExplorer'
import Link from 'next/link'

/**
 * Site footer
 */
export const Footer = () => {
    const { targetNetwork } = useTargetNetwork()

    // NOTE: workaround - check by name also since in starknet react devnet and sepolia has the same chainId
    const isLocalNetwork =
        targetNetwork.id === devnet.id && targetNetwork.network === devnet.network
    const isSepoliaNetwork =
        targetNetwork.id === sepolia.id && targetNetwork.network === sepolia.network
    const isMainnetNetwork =
        targetNetwork.id === mainnet.id && targetNetwork.network === mainnet.network

    return <div className="mb-11 min-h-0 bg-base-100 px-1 py-5 lg:mb-0"></div>
}
