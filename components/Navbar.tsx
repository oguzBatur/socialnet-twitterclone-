import React, { useEffect } from 'react'
import { GetServerSidePropsContext } from 'next'
import Router from 'next/router';
import { useCookies } from 'react-cookie';



export default function Navbar() {
    const [cookies, setCookie, removeCookie] = useCookies(["user-token"]);
    
    const signOut = () => {
        removeCookie('user-token');
        Router.router?.push('/');
    }

    

    return (
        <nav className='flex items-center justify-center bg-white text-black h-20  shadow-xl  '>
            <ul className='mx-4 font-medium w-full h-14 sm:text-base  text-sm grid grid-rows-3 grid-cols-6 items-center'>
                <li className='row-start-2 justify-self-center sm:text-2xl cursor-pointer text-md font-bold text-blue-400 '>
                    SocialNet
                </li>
                <li className='row-start-2 xl:w-96 cursor-pointer col-start-2 justify-self-center px-6 py-1 rounded-xl '>
                   <input placeholder='Search Profiles...' className='border-2 border-gray-200 rounded-full p-2 w-full' type="text" /> 
                </li>
                <li className='row-start-2  cursor-pointer col-start-3 justify-self-center hover:bg-gray-200 duration-200 hover:bg-opacity-80 px-6 py-1 rounded-xl '>
                    Feed
                </li>
                <li className='row-start-2  col-start-4 justify-self-center hover:bg-gray-200 duration-200 hover:bg-opacity-80 px-6 py-1 rounded-xl '>
                    <h4 className='cursor-pointer'>
                        Notifications
                    </h4>
                </li>
                <li className='row-start-2 cursor-pointer col-start-5 justify-self-center hover:bg-gray-200 duration-200 hover:bg-opacity-80 px-6 py-1 rounded-xl '>
                    Profile
                </li>
                <li onClick={signOut} className='row-start-2  col-start-6 justify-self-end cursor-pointer hover:bg-gray-200 duration-200 hover:bg-opacity-80 px-6 py-1 rounded-xl '>
                    Signout
                </li>
            </ul>
        </nav>
    )
}

