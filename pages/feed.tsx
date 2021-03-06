import React, { FC, useState } from 'react'
import Navbar from '../components/Navbar'
import { useEffect } from 'react'
import { useCookies } from 'react-cookie'
import Router from 'next/router';
import FeedComponent from '../components/FeedComponent';
import Loader from '../components/Loader';
import CreatePost from '../components/CreatePost';
import { Post } from '../common/types';
import { NextPage } from 'next';

interface FeedStates{
    user:{
        name: string,
        lastname: string,
        email: string,
        username: string
    },
    feedFetched: boolean,
    error: string,
    posts: Array<Post>,
    shareCounter: number
}

const Feed:NextPage = () => {
    
   const [cookies, setCookie,removeCookie] = useCookies(["user-token"]);
    const [user,setUser] = useState<FeedStates["user"]>({
        lastname: '',
        name: '',
        email: '',
        username: ''
    });
    const [posts, setPosts] = useState<FeedStates["posts"]>([]);

    const [error, setError] = useState<FeedStates["error"]>('');

    const [feedFetched, setFeedFetched] = useState<FeedStates["feedFetched"]>(false);
    const [shareCounter, setShareCounter] = useState<FeedStates["shareCounter"]>(0);

    const forceUpdate = () => {
        setShareCounter(shareCounter + 1);

    }

    const checkForToken = async () => {
        if(!cookies['user-token'])
        {
            Router.router?.push('/');
        }
        else
        {
            const response = await fetch('https://socialnettwitterclone.herokuapp.com/api/auth', {
                headers:{
                    'Authorization': cookies['user-token']
                },

            })
            const data = await response.json();
            if(!data.auth)
            {
                removeCookie('user-token');
                Router.router?.push('/');
            }
            else
            {
                setUser({email: data.result.email, lastname: data.result.profile.lastname, name: data.result.profile.name, username: data.result.profile.username});
                getFeed(data.result.email);

            }
          
        }
    }

    const getFeed = async(email:string) => {
        const response = await fetch('https://socialnettwitterclone.herokuapp.com/api/get_feed', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email
            })
        });
        const data = await response.json();
        if(!data.auth)
        {
            setError('Cannot Load Feed.')
            setFeedFetched(true);
        }
        else
        {
            if(!data.result)
            {
                setError('No Posts.'),
                setFeedFetched(true)
            }
            else
            {
                setFeedFetched(true)
                setPosts(data.result);
                
            }
        }
    }

    const properLoad  = () => {
        if(error === '')
        {
            return(
                <FeedComponent  posts={posts} key={'TheFeed'}/>

            )
        }
        else
        {
            return(
                <>
                    <p className='flex items-center justify-center h-96 font-bold text-xl'>{error}</p>
                </>
            )
        }
    }

    useEffect(() => {
        checkForToken();
        setInterval(checkForToken, 300000);
    }, [shareCounter])
   
    return (
        
        <div className='bg-[#050406] min-h-screen'>
            
            <Navbar />
            <div className='w-10/12 m-auto flex items-center justify-center flex-col '>
                <CreatePost key={'createpostelement'} parentUpdate={forceUpdate} email={user.email} lastname={user.lastname} name={user.name} username={user.username}  />
            </div>
            
            {!feedFetched && (
                <div key={'loader'} className='flex justify-center items-center h-[70vh]'>
                    <Loader borderWidth='border-4' height='h-12' width='w-12' />
                </div>
            )}
            <p className='text-white font-bold text-center text-2xl'>Your Feed</p>
            {feedFetched && (
                <div className='w-10/12 m-auto flex items-center justify-center flex-col'>
                    <div  className='py-8 px-4  w-full flex justify-center gap-12 mt-3  rounded-t-3xl items-center'>
                        
                        {properLoad()}
                    </div>
                </div>
            )}
        </div>
    )
}
export default Feed;