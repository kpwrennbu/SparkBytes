"use client";

import React, { useState, useEffect } from 'react'
import supabase from '../api/supabaseClient'
import { UserOutlined } from '@ant-design/icons'
import Image from 'next/image';

export default function EditAccountPage() {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [password, setPassword] = useState('')
    const [clickedField, setClickedField] = useState<'firstName' | 'lastName' | 'password' | null>(null)
    const [isHovered, setIsHovered] = useState(false)
    const [success, setSuccess] = useState('')
    const [error, setError] = useState('')
    const [userId, setUserId] = useState<string | null>(null)
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
    const [uploading, setUploading] = useState(false)
    const [hoverAvatar, setHoverAvatar] = useState(false)

    useEffect(() => {
        const fetchUserData = async () => {
            const { data: { user } } = await supabase.auth.getUser()

            if (user) {
                setUserId(user.id)

                const { data, error } = await supabase
                    .from('userinfo')
                    .select('first_name, last_name, avatar_url')
                    .eq('id', user.id)
                    .single()

                if (data) {
                    setFirstName(data.first_name || '')
                    setLastName(data.last_name || '')

                    if (data.avatar_url) {
                        downloadImage(data.avatar_url)
                    }
                }
            }
        }

        fetchUserData()
    }, [])

    async function downloadImage(path: string) {
        try {
            const { data, error } = await supabase.storage
                .from('avatars')
                .download(path)

            if (error) {
                throw error
            }

            const url = URL.createObjectURL(data)
            setAvatarUrl(url)
        } catch (error: any) {
            console.log('Error downloading image: ', error.message)
        }
    }

    async function uploadAvatar(event: React.ChangeEvent<HTMLInputElement>) {
        try {
            setUploading(true)

            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload.')
            }

            if (!userId) {
                throw new Error('You must be logged in to upload an avatar')
            }

            const file = event.target.files[0]
            const fileExt = file.name.split('.').pop()
            const fileName = `${userId}.${fileExt}`
            const filePath = `${fileName}`

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file, { upsert: true })

            if (uploadError) {
                throw uploadError
            }

            const { error: updateError } = await supabase
                .from('userinfo')
                .update({ avatar_url: filePath })
                .eq('id', userId)

            if (updateError) {
                throw updateError
            }

            downloadImage(filePath)
            setSuccess('Profile picture updated successfully.')
        } catch (error: any) {
            setError(error.message || 'Error uploading avatar')
        } finally {
            setUploading(false)
        }
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setSuccess('')
        setError('')

        if (!userId) {
            setError('You must be logged in to update your account')
            return
        }

        try {
            const { error: updateError } = await supabase
                .from('userinfo')
                .update({
                    first_name: firstName,
                    last_name: lastName
                })
                .eq('id', userId)

            if (updateError) throw updateError

            if (password) {
                const { error: passwordError } = await supabase.auth.updateUser({
                    password: password
                })

                if (passwordError) throw passwordError
            }

            setSuccess('Account information updated successfully.')
            setPassword('')

            setTimeout(() => {
                window.location.href = '/'
            }, 1000)
        } catch (err: any) {
            setError(err.message || 'Failed to update account information')
        }
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
            {error && <p style={{ color: 'red', marginBottom: '30px' }}>{error}</p>}

            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
                marginBottom: '30px'
            }}>
                <div
                    style={{
                        width: '120px',
                        height: '120px',
                        borderRadius: '60px',
                        overflow: 'hidden',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#f0f0f0',
                        marginBottom: '15px',
                        border: `2px solid ${hoverAvatar ? '#52c41a' : 'rgba(0,0,0,0.1)'}`,
                        transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={() => setHoverAvatar(true)}
                    onMouseLeave={() => setHoverAvatar(false)}
                >
                    {avatarUrl ? (
                        <img
                            src={avatarUrl}
                            alt="Profile"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                            }}
                        />
                    ) : (
                        <UserOutlined style={{ fontSize: '50px', color: 'rgba(0,0,0,0.3)' }} />
                    )}
                </div>

                <label
                    htmlFor="profile-upload"
                    onMouseEnter={() => setHoverAvatar(true)}
                    onMouseLeave={() => setHoverAvatar(false)}
                    style={{
                        padding: '0.8em 1.5em',
                        fontSize: '12px',
                        textTransform: 'uppercase',
                        letterSpacing: '2px',
                        fontWeight: 500,
                        color: hoverAvatar ? '#fff' : '#000',
                        backgroundColor: hoverAvatar ? '#52c41a' : '#fff',
                        border: 'none',
                        borderRadius: '25px',
                        boxShadow: hoverAvatar
                            ? '0px 8px 15px rgba(82, 196, 26, 0.3)'
                            : '0px 4px 10px rgba(0, 0, 0, 0.1)',
                        transition: 'all 0.3s ease 0s',
                        cursor: 'pointer',
                        outline: 'none',
                        transform: hoverAvatar ? 'translateY(-3px)' : 'translateY(0)',
                    }}
                >
                    {uploading ? 'Uploading...' : avatarUrl ? 'Change Photo' : 'Upload Photo'}
                </label>

                <input
                    type="file"
                    id="profile-upload"
                    accept="image/*"
                    onChange={uploadAvatar}
                    disabled={uploading}
                    style={{
                        visibility: 'hidden',
                        position: 'absolute'
                    }}
                />
            </div>

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