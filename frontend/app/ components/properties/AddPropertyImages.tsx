'use client'

import apiService from "@/app/services/apiService"
import { useState } from "react"

interface Props {
    propertyId: string
}

const AddPropertyImages = ({ propertyId }: Props) => {
    const [uploading, setUploading] = useState(false)
    const [done, setDone] = useState(false)

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return
        setUploading(true)
        const formData = new FormData()
        Array.from(e.target.files).forEach(f => formData.append('images', f))
        await apiService.postForm(`/api/properties/${propertyId}/images/`, formData)
        setUploading(false)
        setDone(true)
    }

    return (
        <label className="cursor-pointer text-sm text-blue-600 underline">
            {uploading ? 'Uploading...' : done ? 'Images added!' : '+ Add photos'}
            <input type="file" multiple accept="image/*" className="hidden" onChange={handleChange} />
        </label>
    )
}

export default AddPropertyImages