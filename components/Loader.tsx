import React from 'react'

interface LoaderProps{
    message?: string,
    width?: string,
    height?: string,
    borderWidth: string
}

export default function Loader({message,height,width,borderWidth}:LoaderProps) {
    return (
        <div className={' border-t-black z-10  animate-spin ease-linear rounded-full    ' + width + " " + height  + " " + borderWidth}/>
            
    )
}
