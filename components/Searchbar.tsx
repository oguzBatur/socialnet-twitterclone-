import React, { ChangeEvent, useState } from 'react'
import { Profile } from '../common/types';
import { useRouter } from 'next/router';
import { Data } from '../pages/api/create_user';
import Loader from "./Loader";

interface SearchbarStates{
    searchResult: Array<Profile>,
    search: string
}





export default function Searchbar() {

    const [searchResult, setSearchResult] = useState<SearchbarStates["searchResult"]>();
    const [search, setSearch] = useState<SearchbarStates["search"]>("");
    const router = useRouter();
    
    const SearchHandler = async(e:ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        if(e.target.value.replace(/\s/g, "") !== "")
        {
            
            const response = await fetch("https://socialnettwitterclone.herokuapp.com/api/search_user", {
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
        if(searchResult && searchResult[0])
        {
            return searchResult.map(result => {
                return(
                    <div  className=' absolute w-6/12 bg-[#326c92] rounded-lg mt-1  p-2'>
                        <div onClick={() => {router.push(`/profile/${result.username}`);}} className='flex items-center cursor-pointer'>
                            <p>{result.username}</p>
                        </div>
                    </div>
                )
            })
        }
        else
        {
            return(<div className=' absolute w-full rounded-full  p-2'>
                No Profile Found...
            </div>)
        }
    }


    return (
        <div className='w-full relative'>
            <input  onChange={SearchHandler} placeholder='Search Profiles...' className='text-black border-2 h-full   border-gray-200 rounded-full p-2 bg-white w-full' type="text" />       
           {(() => {
               if(search.replace(/\s/g, "") !== "")
               {
                   return(
                       <div className='p-2 relative bg-[#2f3d4f] h-full shadow-2xl shadow-black z-10 rounded-xl min-h-[50vh] '>
                            {(() => {
                                if(!searchResult)
                                {
                                    return(
                                        <div className='flex  items-center h-4/6 justify-center z-10'>
                                            <Loader borderWidth='border-2' height='h-12' width='w-12' />
                                        </div>
                                    )
                                }
                            })()}
                            {SearchResultFormatter()}
                        </div>
                    )
                }
              
            })()}
        </div>
    )
}
