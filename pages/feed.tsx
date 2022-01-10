import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import { useEffect } from 'react'
import { useCookies } from 'react-cookie'
import Router from 'next/router';
import Feed from '../components/Feed';
import Loader from '../components/Loader';
import CreatePost from '../components/CreatePost';
import { Post } from '../common/types';

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

export default function feed() {
    
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
            const response = await fetch('http://localhost:3000/api/auth', {
                headers:{
                    'Authorization': cookies['user-token']
                },

            })
            const data = await response.json();
            console.log(data);
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
        const response = await fetch('http://localhost:3000/api/get_feed', {
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
                console.log(data);
                setPosts(data.result);
                
            }
        }
    }

    const properLoad  = () => {
        if(error === '')
        {
            return(
                <Feed  posts={posts} key={'TheFeed'}/>

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
        console.log('ForceUpdated.');
    }, [shareCounter])

    return (
        
        <div className='bg-gray-900 min-h-screen'>
            <Navbar username={user.username}/>
            <div className='w-10/12 m-auto flex items-center justify-center flex-col '>
                <CreatePost key={'createpostelement'} parentUpdate={forceUpdate} email={user.email} lastname={user.lastname} name={user.name} username={user.username}  />
            </div>
            {!feedFetched && (
                <div key={'loader'} className='flex justify-center items-center h-[70vh]'>
                    <Loader />
                </div>
            )}
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
