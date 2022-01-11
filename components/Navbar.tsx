import React, { ChangeEvent, useEffect, useState } from 'react'
import Router, { useRouter } from 'next/router';
import { useCookies } from 'react-cookie';
import Link from 'next/link';
import Searchbar from './Searchbar';
import { verifyJwt } from '../features/jwt';





interface NavbarStates{
    searchResult: Array<string>,
    search: string
    visibility: {
        display: string
    },
    logoPath: string,
    theUserName: string
}

export default function Navbar() {

    const router = useRouter();

    const [cookies, setCookie, removeCookie] = useCookies(["user-token"]);
    const [searchResult, setSearchResult] = useState<NavbarStates["searchResult"]>([]);
    const [theUserName, setTheUserName] = useState<NavbarStates["theUserName"]>();
    const [search, setSearch] = useState<NavbarStates["search"]>("");
    const [visibility, setVisibility] = useState<NavbarStates["visibility"]>({
        display: "none"
    });
    const [logoPath, setLogoPath] = useState<NavbarStates["logoPath"]>("/feed");


    const signOut = () => {
        removeCookie('user-token', {path:'/'});
        router.push("/");
    }
    const theToken = async() => {
        const token = await verifyJwt(cookies['user-token']);
        setTheUserName(token.username);
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

 
    useEffect(()=>{theToken()},[])

    return (
        
        <nav className='flex items-center justify-center bg-[#2f3d4f] text-white h-20  shadow-xl  '>
            <ul className='mx-4 font-medium w-full h-14 sm:text-base  text-sm grid grid-rows-3 grid-cols-6 items-center'>
                <li onClick={() => {
                    router.push("/feed");
                }} className='row-start-2 justify-self-center sm:text-2xl cursor-pointer text-md font-bold text-blue-400 hover:text-[#5f9bb4] duration-100 '>
                        SocialNet
                </li>
                <li  className='row-start-2 relative   group col-start-2 col-span-2   h-11  items-start '>
                  <div className=' flex h-full'>
                    <Searchbar />
                  </div>
                </li>
                <li className='row-start-2  cursor-pointer col-start-4 justify-self-center  hover:text-[#5f9bb4] duration-200 hover:bg-opacity-80 px-6 py-1 rounded-xl '>
                    <Link href={"/feed"}>
                        Feed 
                    </Link>
                </li>
               
                <li onClick={() => {

                    Router.push('/profile/' + theUserName)

                }} className='row-start-2 cursor-pointer select-none col-start-5 justify-self-center  hover:text-[#5f9bb4] duration-200 hover:bg-opacity-80 px-6 py-1 rounded-xl '>
                    Profile 
                </li>
                <li onClick={signOut} className='row-start-2  col-start-6 justify-self-end cursor-pointer text-[#e6201b]  hover:bg-gray-200 duration-200 hover:bg-opacity-80 px-6 py-1 rounded-xl '>
                    Signout
                </li>
            </ul>
        </nav>
    )
}

