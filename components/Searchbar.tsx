import React, { ChangeEvent, useState } from 'react'
import { Profile } from '../common/types';
import { useRouter } from 'next/router';
import { Data } from '../pages/api/create_user';
import Loader from "./Loader";

interface SearchbarStates{
    searchResult: Array<Profile>
}





export default function Searchbar() {


    const [searchResult, setSearchResult] = useState<SearchbarStates["searchResult"]>();
    const router = useRouter();
    
    const SearchHandler = async(e:ChangeEvent<HTMLInputElement>) => {
        if(e.target.value.replace(/\s/g, "") === "")
        {
            
        }
        else
        {
            const response = await fetch("http://localhost:3000/api/search_user", {
                method: "GET",
                headers:{
                    "Authorization": e.target.value
                },
            });

            const data:Data | undefined = await response.json();
            const result:Array<Profile> = data?.result;

            if(result)
            {
                setSearchResult(result);            
            }
        }
    }

    const SearchResultFormatter = () => {
        if(searchResult)
        {
            return searchResult.map(result => {
                return(
                    <div className=' absolute w-full bg-blue-900 rounded-full  p-2'>
                        <div onClick={() => {router.push(`/profile/${result.username}`);}} className='flex items-center cursor-pointer'>
                            <p>{result.username}</p>
                        </div>
                    </div>
                )
            })
        }
        else
        {
            <div className=' absolute w-full rounded-full  p-2'>

            </div>
        }
    }


    return (
        <div className='w-full relative'>
            <input  onChange={SearchHandler} placeholder='Search Profiles...' className='text-black border-2 h-full   border-gray-200 rounded-full p-2 w-full' type="text" />       
            {SearchResultFormatter()}
        </div>
    )
}
