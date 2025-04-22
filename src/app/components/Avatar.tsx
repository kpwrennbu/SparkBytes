'use client'

import { useEffect, useState } from 'react'
import supabase from '../api/supabaseClient'

type AvatarProps = {
    url: string | null
    size: number
    onUpload: (event: Event, url: string) => void
}

export default function Avatar({ url, size, onUpload }: AvatarProps) {
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
    const [uploading, setUploading] = useState(false)

    useEffect(() => {
        if (url) downloadImage(url)
    }, [url])

    async function downloadImage(path: string) {
        try {
            const { data, error } = await supabase.storage.from('avatars').download(path)
            if (error) throw error
            const url = URL.createObjectURL(data)
            setAvatarUrl(url)
        } catch (error: any) {
            console.error('Error downloading image:', error.message)
        }
    }

    async function uploadAvatar(event: React.ChangeEvent<HTMLInputElement>) {
        try {
            setUploading(true)
            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload.')
            }

            const file = event.target.files[0]
            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random()}.${fileExt}`
            const filePath = `${fileName}`

            const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file)
            if (uploadError) throw uploadError

            onUpload(event.nativeEvent, filePath)
        } catch (error: any) {
            alert(error.message)
        } finally {
            setUploading(false)
        }
    }

    return (
        <div>
            {avatarUrl ? (
                <img
                    src={avatarUrl}
                    alt="Avatar"
                    style={{ height: size, width: size, borderRadius: '50%' }}
                />
            ) : (
                <div
                    style={{
                        height: size,
                        width: size,
                        borderRadius: '50%',
                        backgroundColor: '#ccc',
                    }}
                />
            )}
            <div style={{ width: size, marginTop: 10 }}>
                <label className="button primary block" htmlFor="single">
                    {uploading ? 'Uploading...' : 'Upload'}
                </label>
                <input
                    id="single"
                    type="file"
                    accept="image/*"
                    onChange={uploadAvatar}
                    style={{ display: 'none' }}
                    disabled={uploading}
                />
            </div>
        </div>
    )
}
