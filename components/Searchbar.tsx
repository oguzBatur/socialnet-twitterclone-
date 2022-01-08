import React, { ChangeEvent } from 'react'

interface SearchbarStates{
    search: string,
    searchResult: Array<any>
}


function InputHandler(e:ChangeEvent<HTMLInputElement>)
{   
    
}


export default function Searchbar() {
    return (
        <>
            <input  onChange={InputHandler} placeholder='Search Profiles...' className='text-black border-2 h-full   border-gray-200 rounded-full p-2 w-full' type="text" />       
        </>
    )
}
