import type { NextPage } from 'next'
import Head from 'next/head'
import {ChangeEvent, FormEvent, useEffect, useState} from 'react'
import Link from 'next/link';
import Router  from 'next/router';
import { useCookies } from 'react-cookie';
import Loader from '../components/Loader';

interface HomeState{
  email: string,
  pass: string,
  error: string,
  fetching: boolean
}


const Home:NextPage = () => {
  const [cookies, setCookie,removeCookie] = useCookies(["user-token"]);

  const [email, setEmail] = useState<HomeState["email"]>('');
  const [pass, setPass] = useState<HomeState["pass"]>('');
  const [error,setError] = useState<HomeState["error"]>('')
  const [fetching, setFetching] = useState<HomeState["fetching"]>(true)

  const checkForToken = async () => {
    setFetching(true);
    if(cookies['user-token'])
    {
      const response = await fetch('https://socialnettwitterclone.herokuapp.com/api/auth', {
        headers:{
            'Authorization': cookies['user-token']
        },

      })
      const data = await response.json();
      if(data.auth)
      {
          Router.router?.push('/feed');
      }    
    }
    setFetching(false);
  }

  const handleSubmitForm = async (e:FormEvent) => {
    e.preventDefault();
    setFetching(true);
    const response = await fetch('https://socialnettwitterclone.herokuapp.com/check_user', {
      method: 'POST',
      body: JSON.stringify({
        email: email,
        password: pass
      }),
      headers:{
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json();
    if(!data.auth)
    {
      setError(data.result.toString())
    }
    else
    {

      setCookie('user-token', data.token, {path:"/"});
      setError('');
      Router.router?.push('/feed');
    }
    setFetching(false);
  }


  useEffect(() => {
    checkForToken();

  });
  
  const fetchingLogic = () => {
    if(fetching)
    {
      return(
        <div  className='w-96 flex items-center justify-center'>
          <Loader borderWidth='border-8' width='w-12' height='h-12' />
        </div>
      )
    }
    else{
        return(
          <form onSubmit={handleSubmitForm} className='flex flex-col gap-4 w-96 shadow-2xl sm:p-12 p-2 bg-gray-800  rounded-2xl text-white'>
          <div className='flex flex-col text-center'>
            <label >
              Email
            </label>
            <input value={email} required onChange={(e) => {setEmail(e.target.value)}} className='p-2 border-gray-200 rounded-md border-2 text-black' type="email"/>
              
          </div>  
          <div className='flex flex-col text-center'>
            <label >
              Password
            </label>
            <input value={pass} required onChange={(e) => {setPass(e.target.value)}} className='p-2 border-gray-200 rounded-md border-2 text-black' type="password"/>
          </div>  
          <div className='flex flex-col text-center'>
            <input className='bg-blue-500 font-bold py-2 px-24 cursor-pointer  rounded-md text-white' type="submit"  value={'Login'} />
          </div>
          <p className='h-6  text-red-500 font-medium text-center'>{error}</p>
          <div>
            <p className='text-center text-blue-500 cursor-pointer'>Lost your password?</p>
          </div>
          <hr />
          <div className='flex flex-col text-center cursor-pointer bg-green-500 rounded-md  font-bold py-2  text-white'>
            <Link href="/signup" >Create a New Account</Link>
          </div>
        </form>      
        )
    }
  }

  return(
    <div className='bg-gray-900  h-screen'>
      <Head>
        <title>SocialNet</title>
        <meta name="description" content="Social Platform for React Developers!" />
        <meta name='keywords' content='social media, social, find friends'/>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className='flex flex-col md:flex-row items-center md:gap-8 gap-12 justify-center w-full h-[90vh]'>
        <h1 className='font-bold sm:text-5xl text-4xl sm:text-left text-center text-blue-400'>SocialNet
          <p className='font-normal sm:w-96 w-72  sm:text-left text-center text-xs sm:text-lg  text-white'>
            SocialNet allows you to check what is up and share whats going on with your life with your friends and family.
          </p>
        </h1>
       {fetchingLogic()}
      </div>
    </div>
  )
}

export default Home
