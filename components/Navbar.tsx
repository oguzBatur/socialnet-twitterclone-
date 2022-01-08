import React, { ChangeEvent, useEffect, useState } from 'react'
import Router, { useRouter } from 'next/router';
import { useCookies } from 'react-cookie';
import Link from 'next/link';
import Searchbar from './Searchbar';



interface NavbarProps
{
    username:string
}

interface NavbarStates{
    searchResult: Array<string>,
    search: string
    visibility: {
        display: string
    },
    logoPath: string
}

export default function Navbar({username}:NavbarProps) {
    const [cookies, setCookie, removeCookie] = useCookies(["user-token"]);
    const [searchResult, setSearchResult] = useState<NavbarStates["searchResult"]>([]);
    const [search, setSearch] = useState<NavbarStates["search"]>("");
    const [visibility, setVisibility] = useState<NavbarStates["visibility"]>({
        display: "none"
    });
    const [logoPath, setLogoPath] = useState<NavbarStates["logoPath"]>("/feed");


    const signOut = () => {
        removeCookie('user-token', {path:'/'});
        if(!cookies['user-token']) Router.router?.push('/');
    }

    useEffect(() => {
        if(cookies['user-token'])
        {
            setLogoPath("/feed")
        }
        else
        {
            setLogoPath("/");
        }
    })
    const SearchResultHandler = () => {

        return searchResult.map(result => {
            if(result !== "")
            {
                setVisibility({
                    display: "none"
                })
                return  <li className='flex  items-center w-full bg-gray-500 p-2 rounded-md '>
                            <Link href={"/profile/" + result}>
                              {result}
                            </Link>
                        </li>    
            }
            else
            {
                return 
            }
            
        })

    }

    const SearchHandler = async(e:ChangeEvent<HTMLInputElement>) => {
        if(e.target.value.replace(/\S/g, "") === "")
        {
            setSearchResult([""])
        }
        else
        {
            const response = await fetch("http://localhost:3000/api/fetch_profile", {
                method: "POST",
                headers:{
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: e.target.value
                }),
            });

            const data = await response.json();
            if(data.auth)
            {

                setSearchResult([data.result.username])
                setVisibility({
                    display: "flex"
                })

            }         
        }
        
    }


    return (
        
        <nav className='flex items-center justify-center bg-neutral-700 text-white h-20  shadow-xl  '>
            <ul className='mx-4 font-medium w-full h-14 sm:text-base  text-sm grid grid-rows-3 grid-cols-6 items-center'>
                <li className='row-start-2 justify-self-center sm:text-2xl cursor-pointer text-md font-bold text-blue-400 '>
                    <Link href={logoPath}>
                        SocialNet
                    </Link>
                </li>
                <li className='row-start-2 relative   group col-start-2 xl:col-span-2   h-11  items-start '>
                  <div className=' flex h-full'>
                    <Searchbar />
                  </div>
                  
                  <ul style={visibility} className={`absolute w-full bg-gray-800 shadow-2xl p-4 rounded-t-3xl   mt-1 flex-col gap-6 z-10 `}>
                       
                    
                      {SearchResultHandler()}
                  </ul>
                </li>
                
                <li className='row-start-2  cursor-pointer col-start-4 justify-self-center hover:bg-gray-200 duration-200 hover:bg-opacity-80 px-6 py-1 rounded-xl '>
                    <Link href={"/feed"}>
                        Feed 
                    </Link>
                </li>
               
                <li onClick={() => {
                    Router.push('/profile/' + username)        

                }} className='row-start-2 cursor-pointer select-none col-start-5 justify-self-center hover:bg-gray-200 duration-200 hover:bg-opacity-80 px-6 py-1 rounded-xl '>
                    Profile 
                </li>
                <li onClick={signOut} className='row-start-2  col-start-6 justify-self-end cursor-pointer hover:bg-gray-200 duration-200 hover:bg-opacity-80 px-6 py-1 rounded-xl '>
                    Signout
                </li>
            </ul>
        </nav>
    )
}

