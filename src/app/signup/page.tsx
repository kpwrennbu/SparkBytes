"use client";

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import supabase from '../api/supabaseClient'

export default function SignupPage() {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [isHovered, setIsHovered] = useState(false)
    const [isLinkHovered, setIsLinkHovered] = useState(false)
    const [clickedField, setClickedField] = useState<'firstName' | 'lastName' | 'email' | 'password' | null>(null)

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
        setSuccess('')

        // ✅ Reject emails not ending in "@bu.edu"
        if (!email.toLowerCase().endsWith('@bu.edu')) {
            setError('Only BU email addresses (ending in @bu.edu) are allowed.');
            return;
        }

        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        first_name: firstName,
                        last_name: lastName
                    }
                }
            })

            if (error) throw error

            setSuccess('You have signed up successfully! Check your email to verify your account.')
        } catch (error: any) {
            setError(error.message)
        }
    }

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '50vh',
            width: '100%',
            fontFamily: 'Arial, sans-serif'
        }}>
            <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Sign Up</h2>
            {error && <p style={{ color: 'red', marginBottom: '20px' }}>{error}</p>}
            {success && <p style={{ color: 'green', marginBottom: '40px' }}>{success}</p>}
            <form
                onSubmit={handleSignup}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    maxWidth: '300px',
                    alignItems: 'center',
                    position: 'relative'
                }}
            >
                <div style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '20px'
                }}>
                    <div style={{ width: '48%', position: 'relative' }}>
                        <div style={{
                            position: 'absolute',
                            top: clickedField === 'firstName' || firstName ? '-20px' : '10px',
                            left: '0',
                            fontSize: clickedField === 'firstName' || firstName ? '12px' : '16px',
                            color: clickedField === 'firstName' ? '#52c41a' : 'rgba(0,0,0,0.6)',
                            transition: 'all 0.3s ease',
                            pointerEvents: 'none'
                        }}>
                            First Name
                        </div>
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            onFocus={() => setClickedField('firstName')}
                            onBlur={() => setClickedField(null)}
                            required
                            style={{
                                width: '100%',
                                border: 'none',
                                borderBottom: `1px solid ${clickedField === 'firstName' ? '#52c41a' : 'rgba(0,0,0,0.1)'}`,
                                padding: '10px 0',
                                fontSize: '16px',
                                outline: 'none',
                                backgroundColor: 'transparent',
                                WebkitTapHighlightColor: 'transparent'
                            }}
                        />
                    </div>
                    <div style={{ width: '48%', position: 'relative' }}>
                        <div style={{
                            position: 'absolute',
                            top: clickedField === 'lastName' || lastName ? '-20px' : '10px',
                            left: '0',
                            fontSize: clickedField === 'lastName' || lastName ? '12px' : '16px',
                            color: clickedField === 'lastName' ? '#52c41a' : 'rgba(0,0,0,0.6)',
                            transition: 'all 0.3s ease',
                            pointerEvents: 'none'
                        }}>
                            Last Name
                        </div>
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            onFocus={() => setClickedField('lastName')}
                            onBlur={() => setClickedField(null)}
                            required
                            style={{
                                width: '100%',
                                border: 'none',
                                borderBottom: `1px solid ${clickedField === 'lastName' ? '#52c41a' : 'rgba(0,0,0,0.1)'}`,
                                padding: '10px 0',
                                fontSize: '16px',
                                outline: 'none',
                                backgroundColor: 'transparent',
                                WebkitTapHighlightColor: 'transparent'
                            }}
                        />
                    </div>
                </div>

                <div style={{ width: '100%', position: 'relative', marginBottom: '20px' }}>
                    <div style={{
                        position: 'absolute',
                        top: clickedField === 'email' || email ? '-20px' : '10px',
                        left: '0',
                        fontSize: clickedField === 'email' || email ? '12px' : '16px',
                        color: clickedField === 'email' ? '#52c41a' : 'rgba(0,0,0,0.6)',
                        transition: 'all 0.3s ease',
                        pointerEvents: 'none'
                    }}>
                        Email
                    </div>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setClickedField('email')}
                        onBlur={() => setClickedField(null)}
                        required
                        style={{
                            width: '100%',
                            border: 'none',
                            borderBottom: `1px solid ${clickedField === 'email' ? '#52c41a' : 'rgba(0,0,0,0.1)'}`,
                            padding: '10px 0',
                            fontSize: '16px',
                            outline: 'none',
                            backgroundColor: 'transparent',
                            WebkitTapHighlightColor: 'transparent'
                        }}
                    />
                </div>

                <div style={{ width: '100%', position: 'relative', marginBottom: '30px' }}>
                    <div style={{
                        position: 'absolute',
                        top: clickedField === 'password' || password ? '-20px' : '10px',
                        left: '0',
                        fontSize: clickedField === 'password' || password ? '12px' : '16px',
                        color: clickedField === 'password' ? '#52c41a' : 'rgba(0,0,0,0.6)',
                        transition: 'all 0.3s ease',
                        pointerEvents: 'none'
                    }}>
                        Password
                    </div>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={() => setClickedField('password')}
                        onBlur={() => setClickedField(null)}
                        required
                        style={{
                            width: '100%',
                            border: 'none',
                            borderBottom: `1px solid ${clickedField === 'password' ? '#52c41a' : 'rgba(0,0,0,0.1)'}`,
                            padding: '10px 0',
                            fontSize: '16px',
                            outline: 'none',
                            backgroundColor: 'transparent'
                        }}
                    />
                </div>

                <button
                    type="submit"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    style={{
                        padding: '1.3em 3em',
                        fontSize: '12px',
                        textTransform: 'uppercase',
                        letterSpacing: '2.5px',
                        fontWeight: 500,
                        color: isHovered ? '#fff' : '#000',
                        backgroundColor: isHovered ? '#52c41a' : '#fff',
                        border: 'none',
                        borderRadius: '45px',
                        boxShadow: isHovered
                            ? '0px 15px 20px rgba(82, 196, 26, 0.4)'
                            : '0px 8px 15px rgba(0, 0, 0, 0.1)',
                        transition: 'all 0.3s ease 0s',
                        cursor: 'pointer',
                        outline: 'none',
                        width: '100%',
                        transform: isHovered ? 'translateY(-7px)' : 'translateY(0)',
                    }}
                >
                    Sign Up
                </button>
            </form>
            <p style={{ marginTop: '20px' }}>
                Already have an account? <Link
                    href="/login"
                    onMouseEnter={() => setIsLinkHovered(true)}
                    onMouseLeave={() => setIsLinkHovered(false)}
                    style={{
                        color: isLinkHovered ? '#52c41a' : 'inherit',
                        textDecoration: 'underline',
                        transition: 'color 0.3s ease',
                        fontSize: '18px',
                        fontWeight: 'bold'
                    }}
                >
                    Login
                </Link>
            </p>
        </div>
    )
}
