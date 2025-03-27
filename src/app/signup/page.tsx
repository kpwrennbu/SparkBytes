"use client";

import React, { useState, useEffect } from 'react'
import supabase from '../api/supabaseClient'

export default function SignupPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    useEffect(() => {
        const { data: authListener } = supabase.auth.onAuthStateChange(
            (event, session) => {
                if (event === 'SIGNED_IN') {
                    window.location.href = '/'
                }
            }
        )
        return () => {
            authListener.subscription.unsubscribe()
        }
    }, [])

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
            })
            if (error) throw error
            console.log('Signup successful', data)
        } catch (error: any) {
            setError(error.message)
        }
    }

    return (
        <div>
            <h2>Sign Up</h2>
            {error && <p style={{color: 'red'}}>{error}</p>}
            <form onSubmit={handleSignup}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Sign Up</button>
            </form>
        </div>
    )
}