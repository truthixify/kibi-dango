import { useCallback, useEffect, useState } from 'react'
import { CommonInputProps, InputBase, isValidInteger } from '~~/components/scaffold-stark'
import { parseEther } from 'ethers'

type IntegerInputProps = CommonInputProps<string | bigint> & {
    variant?: string
    disableMultiplyBy1e18?: boolean
    onError?: (message: string | null) => void
}

export const IntegerInput = ({
    value,
    onChange,
    name,
    placeholder,
    disabled,
    variant = 'core::integer::u256',
    disableMultiplyBy1e18 = false,
    onError,
}: IntegerInputProps) => {
    const [inputError, setInputError] = useState(false)
    const multiplyBy1e18 = useCallback(() => {
        if (!value) {
            return
        }

        return inputError ? onChange(value) : onChange(parseEther(value.toString()).toString())
    }, [onChange, value, inputError])

    useEffect(() => {
        const isIntValid = isValidInteger(variant, value)
        setInputError(!isIntValid)
        if (onError) {
            onError(null)
            if (!isIntValid) onError('Invalid number input')
        }
    }, [value, variant, onError])

    return (
        <InputBase
            name={name}
            value={value}
            placeholder={placeholder}
            error={inputError}
            onChange={onChange}
            disabled={disabled}
            suffix={
                !inputError &&
                !disabled &&
                !disableMultiplyBy1e18 && (
                    <div
                        className="tooltip tooltip-top tooltip-primary flex space-x-4 text-white before:left-auto before:right-[-10px] before:transform-none before:content-[attr(data-tip)]"
                        data-tip="Multiply by 10^18"
                    >
                        <button
                            className={`${
                                disabled ? 'cursor-not-allowed' : 'cursor-pointer'
                            } px-4 font-semibold text-accent`}
                            onClick={multiplyBy1e18}
                            disabled={disabled}
                        >
                            ∗
                        </button>
                    </div>
                )
            }
        />
    )
}
