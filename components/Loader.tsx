import React from 'react'

interface LoaderProps{
    message?: string
}

export default function Loader({message}:LoaderProps) {
    return (
        <div className=' border-t-black z-10  animate-spin ease-linear rounded-full border-8   h-16 w-16   '/>
            
    )
}
