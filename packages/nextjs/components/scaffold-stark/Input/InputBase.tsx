import { ChangeEvent, FocusEvent, ReactNode, useCallback, useEffect, useRef } from 'react'
import { CommonInputProps } from './utils'

type InputBaseProps<T> = CommonInputProps<T> & {
    error?: boolean
    prefix?: ReactNode
    suffix?: ReactNode
    reFocus?: boolean
}

export const InputBase = <T extends { toString: () => string } | undefined = string>({
    name,
    value,
    onChange,
    placeholder,
    error,
    disabled,
    prefix,
    suffix,
    reFocus,
}: InputBaseProps<T>) => {
    const inputReft = useRef<HTMLInputElement>(null)

    let modifier = ''
    if (error) {
        modifier = 'border-error'
    } else if (disabled) {
        modifier = 'border-disabled bg-base-300'
    }

    const handleChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            onChange(e.target.value as unknown as T)
        },
        [onChange]
    )

    // Runs only when reFocus prop is passed, useful for setting the cursor
    // at the end of the input. Example AddressInput
    const onFocus = (e: FocusEvent<HTMLInputElement, Element>) => {
        if (reFocus !== undefined) {
            e.currentTarget.setSelectionRange(
                e.currentTarget.value.length,
                e.currentTarget.value.length
            )
        }
    }
    useEffect(() => {
        if (reFocus !== undefined && reFocus === true) inputReft.current?.focus()
    }, [reFocus])

    return (
        <div className={`bg-input flex text-accent ${modifier}`}>
            {prefix}
            <input
                className="input input-ghost h-[2.2rem] min-h-[2.2rem] w-full rounded-none border px-4 text-xs text-neutral placeholder:text-[#9596BF] focus-within:border-transparent focus:bg-transparent focus:outline-none"
                placeholder={placeholder}
                name={name}
                value={value?.toString() || ''}
                onChange={handleChange}
                disabled={disabled}
                autoComplete="off"
                ref={inputReft}
                onFocus={onFocus}
            />
            {suffix}
        </div>
    )
}
