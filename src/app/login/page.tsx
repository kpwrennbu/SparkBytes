"use client";
//imports
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import supabase from '../api/supabaseClient'

export default function LoginPage() {
    //states
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [isHovered, setIsHovered] = useState(false)
    const [isLinkHovered, setIsLinkHovered] = useState(false)
    const [clickedField, setClickedField] = useState<'email' | 'password' | null>(null)

    useEffect(() => {
        const { data: authListener } = supabase.auth.onAuthStateChange(
            (event ) => {
                if (event === 'SIGNED_IN') {
                    window.location.href = '/' //if the user signs in, redirect to home page
                }
            }
        )
        return () => {
            authListener.subscription.unsubscribe() //removes the event listener
        }
    }, [])

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('') //no error
        try {
            const { data, error } = await supabase.auth.signInWithPassword({ //attempt a login
                email,
                password,
            })

            if (error) throw error //if error, throw it

            console.log('Login successful', data) //else, log successful signin
        } catch (error: unknown) {
            if (typeof error === "object" && error !== null && "message" in error) {
              setError((error as { message: string }).message); //set error
            } else {
              setError("An unexpected error occurred."); //else, if that fails. Set general error
            }
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
            <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Login</h2>
            {error && <p style={{color: 'red', marginBottom: '20px'}}>{error}</p>}
            <form
                onSubmit={handleLogin}
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
                    position: 'relative',
                    marginBottom: '20px'
                }}>
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
                            backgroundColor: 'transparent'
                        }}
                    />
                </div>

                <div style={{
                    width: '100%',
                    position: 'relative',
                    marginBottom: '30px'
                }}>
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
                    Login
                </button>
            </form>
            <p style={{ marginTop: '20px' }}>
                Don&apos;t have an account? <Link
                href="/signup"
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
                Sign Up
            </Link>
            </p>
        </div>
    )
}
