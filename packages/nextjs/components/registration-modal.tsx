'use client'

import type React from 'react'
import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~~/components/ui/dialog'
import { Button } from '~~/components/ui/button'
import { Input } from '~~/components/ui/input'
import { Label } from '~~/components/ui/label'
import { User, Loader2 } from 'lucide-react'
import { useAccount } from '@starknet-react/core'
import { registerUser } from '~~/lib/api'

interface RegistrationModalProps {
    isOpen: boolean
    onClose: () => void
}

export function RegistrationModal({ isOpen, onClose }: RegistrationModalProps) {
    const [username, setUsername] = useState('')
    const [isRegistering, setIsRegistering] = useState(false)
    const [error, setError] = useState('')
    const { address } = useAccount()

    const validateUsername = (name: string) => {
        if (!name.trim()) return 'Username is required'
        if (!/^[a-zA-Z0-9_]+$/.test(name))
            return 'Only alphanumeric characters and underscores allowed'
        if (name.length < 3) return 'Username must be at least 3 characters'
        if (name.length > 30) return 'Username must be less than 20 characters'
        return ''
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const validationError = validateUsername(username)
        if (validationError) {
            setError(validationError)
            return
        }

        if (!address) {
            setError('Wallet not connected')
            return
        }

        try {
            setIsRegistering(true)
            setError('')

            const user = await registerUser(address, username)

            if (!user) {
                throw new Error('Failed to register')
            }

            onClose()
        } catch (err: any) {
            setError('Failed to register. Please try again.')
        } finally {
            setIsRegistering(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="w-[90%] rounded-lg bg-base-100 sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-center text-xl">Join the Otama Army!</DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    <div className="text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                            <User className="h-8 w-8 text-primary" />
                        </div>
                        <p className="text-muted-foreground">
                            <span className="block">
                                You want a <span className="font-semibold">kibi dango?</span>
                            </span>{' '}
                            Then swear loyalty to Otama by choosing your pirate name!
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="username" className="text-subheading">
                                Choose Your Pirate Name
                            </Label>
                            <Input
                                id="username"
                                type="text"
                                value={username}
                                onChange={e => {
                                    setUsername(e.target.value)
                                    setError('')
                                }}
                                placeholder="Enter your pirate name"
                                className="minimal-input focus-minimal"
                                disabled={isRegistering}
                                minLength={3}
                                maxLength={30}
                            />
                            {error && (
                                <p className="text-destructive text-sm text-red-500">{error}</p>
                            )}
                            <p className="text-caption text-xs">
                                Use letters, numbers, or underscores (3–30 characters)
                            </p>
                        </div>

                        <div className="space-y-3">
                            <Button
                                type="submit"
                                disabled={isRegistering}
                                className="w-full bg-primary hover:bg-primary/90"
                            >
                                {isRegistering ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Handing over your kibi dango...
                                    </>
                                ) : (
                                    <>
                                        <User className="mr-2 h-4 w-4" />
                                        Join the Crew
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    )
}
