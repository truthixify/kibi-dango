'use client'

import type React from 'react'
import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~~/components/ui/dialog'
import { Button } from '~~/components/ui/button'
import { Input } from '~~/components/ui/input'
import { Label } from '~~/components/ui/label'
import { User, Loader2 } from 'lucide-react'
import { useAccount } from '@starknet-react/core'

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
        if (name.length > 20) return 'Username must be less than 20 characters'
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

            const res = await fetch('/api/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    address,
                    username: username.trim(),
                }),
            })

            const data = await res.json()
            if (!res.ok) {
                throw new Error(data?.error || 'Failed to register')
            }

            onClose()
        } catch (err: any) {
            setError(err.message || 'Failed to register. Please try again.')
        } finally {
            setIsRegistering(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-center text-xl">
                        Welcome to Puzzle Adventure!
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    <div className="text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                            <User className="h-8 w-8 text-primary" />
                        </div>
                        <p className="text-muted-foreground">
                            You're new here! Choose a username to get started.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="username" className="text-subheading">
                                Username
                            </Label>
                            <Input
                                id="username"
                                type="text"
                                value={username}
                                onChange={e => {
                                    setUsername(e.target.value)
                                    setError('')
                                }}
                                placeholder="Enter your username"
                                className="minimal-input focus-minimal"
                                disabled={isRegistering}
                                maxLength={20}
                            />
                            {error && (
                                <p className="text-destructive text-sm text-red-500">{error}</p>
                            )}
                            <p className="text-caption text-x text-red-500">
                                Only letters, numbers, underscores (3–20 characters)
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
                                        Creating Account...
                                    </>
                                ) : (
                                    <>
                                        <User className="mr-2 h-4 w-4" />
                                        Create Account
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
