import { ChevronDownIcon, ArrowLeftEndOnRectangleIcon } from '@heroicons/react/24/outline'
import { useDisconnect } from '@starknet-react/core'
import { notification } from '~~/utils/scaffold-stark'
import { useLocalStorage } from 'usehooks-ts'

export const WrongNetworkDropdown = () => {
    const { disconnect } = useDisconnect()
    const [, setWasDisconnectedManually] = useLocalStorage<boolean>(
        'wasDisconnectedManually',
        false
    )

    const handleDisconnect = () => {
        try {
            disconnect()
            localStorage.removeItem('lastConnectionTime')
            setWasDisconnectedManually(true)
            window.dispatchEvent(new Event('manualDisconnect'))
            notification.success('Disconnect successfully!')
        } catch (err) {
            console.error(err)
            notification.success('Disconnect failure!')
        }
    }

    return (
        <div className="dropdown dropdown-end mr-2">
            <label tabIndex={0} className="dropdown-toggle btn btn-error btn-sm gap-1">
                <span>Wrong network</span>
                <ChevronDownIcon className="ml-2 h-6 w-4 sm:ml-0" />
            </label>

            <ul
                tabIndex={0}
                className="menu dropdown-content mt-1 gap-1 rounded-box bg-base-200 p-2 shadow-center shadow-accent"
            >
                {/* TODO: reinstate if needed */}
                {/* <NetworkOptions /> */}
                <li>
                    <button
                        className="menu-item btn-sm flex gap-3 !rounded-xl py-3 text-error"
                        type="button"
                        onClick={handleDisconnect}
                    >
                        <ArrowLeftEndOnRectangleIcon className="ml-2 h-6 w-4 sm:ml-0" />
                        <span>Disconnect</span>
                    </button>
                </li>
            </ul>
        </div>
    )
}
