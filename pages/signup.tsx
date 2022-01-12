import React, { useState } from 'react'
import Head from 'next/head';
import { NextPage } from 'next';
import Link from 'next/link';
import {useCookies} from 'react-cookie';
import Router from 'next/router'
interface SignupStates{
    name: string,
    lastname: string,
    email: string,
    password: string,
    errorMessage: string,
    username: string,
    fetching: boolean
}


const Signup:NextPage = () =>  {

    const [cookies, setCookie, removeCookie] = useCookies(['user-token']);
    const [username, setUsername] = useState<SignupStates["username"]>('')
    const [name,setName] = useState<SignupStates["name"]>('');
    const [lastname,setLastname] = useState<SignupStates["lastname"]>('');
    const [email,setEmail] = useState<SignupStates["email"]>('');
    const [password,setPassword] = useState<SignupStates["password"]>('');
    const [errorMessage, setErrorMessage] = useState<SignupStates["errorMessage"]>('');
    const [fetching, setFetching] = useState<SignupStates["fetching"]>(false);


    const preventReRenderAndCallHandleForm = async(e:React.FormEvent) => {
        try {
            e.preventDefault();
            if(name && lastname && email && password)
            {
                const response = await fetch('https://socialnettwitterclone.herokuapp.com/api/create_user', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name,
                        lastname,
                        email,
                        password,
                        username
                    }),
                })

                const data = await response.json();
                if(!data.auth)
                {
                    setErrorMessage(data.result.toString());
                }
                else
                {
                    setCookie('user-token', data.token, {path:'/'});
                    Router.router?.push('/feed');
                }
                
            }
            else
            {
                setErrorMessage('Please fill out the form.')
            }
            
        } catch (error) {
            setErrorMessage('Something went wrong.')
        }
    }

  

    return (

        <div className='flex flex-col gap-4 items-center justify-center bg-[#050406]  h-screen'>
            <Head>
                <title>SocialNet - Signup</title>
            </Head>
            <h1 className='font-bold text-4xl text-blue-700'>
                <Link href={'/'}>
                    SocialNet
                </Link></h1>
            <form onSubmit={preventReRenderAndCallHandleForm} method='POST' className='flex flex-col gap-4 shadow-xl sm:p-12 p-2 text-white bg-gray-800'>
                <h2 className='text-center font-medium text-lg'>Sign up to SocialNet</h2>
                <div className='flex flex-col text-center'>
                    <label >
                        Username
                    </label>
                    <input required  onChange={(e) => {setUsername(e.target.value)}} className='p-2 border-gray-200 rounded-md border-2' type="text"/>
                </div>
                <div className='flex text-center gap-2'>
                    <div className='flex flex-col '>
                        <label >
                            Name
                        </label>
                        <input onChange={(e) => {setName(e.target.value); setErrorMessage('')}}  required  className='p-2 border-gray-200 rounded-md border-2' type="text"/>
                    </div>
                    <div className='flex flex-col'>
                        <label >
                            Last Name
                        </label>
                        <input  onChange={(e) => setLastname(e.target.value)} required  className='p-2 border-gray-200 rounded-md border-2' type="text"/>
                    </div>
                </div>  
                <div className='flex flex-col text-center'>
                    <label >
                        Email
                    </label>
                    <input required  onChange={(e) => {setEmail(e.target.value)}} className='p-2 border-gray-200 rounded-md border-2' type="email"/>
                </div>  
                <div className='flex flex-col text-center'>
                    <label >
                        Password
                    </label>
                    <input onChange={(e) => setPassword(e.target.value)} required  className='p-2 border-gray-200 rounded-md border-2' type="password"/>
                </div>  
                <p className='text-center font-medium text-red-500 h-6'>{errorMessage}</p>
                <div className='flex flex-col text-center'>
                    <input    className='bg-blue-500 font-bold py-2 px-24 cursor-pointer  rounded-md text-white' type="submit"  value={'Signup'} />
                </div>
        </form>
        </div>
    )
}
export default Signup;