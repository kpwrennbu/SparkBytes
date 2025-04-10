"use client";

import React, { useState } from 'react'
import supabase from '../api/supabaseClient'

export default function EditAccountPage() {
    const [firstName, setFirstName] = useState('John')
    const [lastName, setLastName] = useState('Doe')
    const [email, setEmail] = useState('john@example.com')
    const [password, setPassword] = useState('')
    const [clickedField, setClickedField] = useState<'firstName' | 'lastName' | 'email' | 'password' | null>(null)
    const [isHovered, setIsHovered] = useState(false)
    const [success, setSuccess] = useState('')

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault()
        setSuccess('Account information updated successfully.')
    }

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            padding: '40px',
            fontFamily: 'Arial, sans-serif',
            width: '100%',
            maxWidth: '400px',
        }}>
            <h2 style={{ marginBottom: '30px' }}>Edit Account Info</h2>
            {success && <p style={{ color: 'green', marginBottom: '30px' }}>{success}</p>}
            <form
                onSubmit={handleSave}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                }}
            >
                <div style={{ width: '100%', position: 'relative', marginBottom: '20px' }}>
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
                        style={{
                            width: '100%',
                            border: 'none',
                            borderBottom: `1px solid ${clickedField === 'firstName' ? '#52c41a' : 'rgba(0,0,0,0.1)'}`,
                            padding: '10px 0',
                            fontSize: '16px',
                            outline: 'none',
                            backgroundColor: 'transparent'
                        }}
                    />
                </div>

                <div style={{ width: '100%', position: 'relative', marginBottom: '20px' }}>
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
                        style={{
                            width: '100%',
                            border: 'none',
                            borderBottom: `1px solid ${clickedField === 'lastName' ? '#52c41a' : 'rgba(0,0,0,0.1)'}`,
                            padding: '10px 0',
                            fontSize: '16px',
                            outline: 'none',
                            backgroundColor: 'transparent'
                        }}
                    />
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
                    Save
                </button>
            </form>
        </div>
    )
}
