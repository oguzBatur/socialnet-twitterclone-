import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion';
import { Profile } from '../../../common/types';
import { Data } from '../../api/create_user';
import Loader from '../../../components/Loader';
import {FaArrowLeft} from "react-icons/fa"
interface FollowersState{
    followers:Array<Profile>,
    username: string,
    name: string,
    lastname: string,
    errorMsg: string
}


export default function followers() {

    const router = useRouter();


    // Followers State
    const [followers,setFollowers] = useState<FollowersState["followers"]>();

    //User State
    const [username, setUsername] = useState<FollowersState["username"]>();
    const [name, setName] = useState<FollowersState["name"]>("");
    const [lastname, setLastname] = useState<FollowersState["lastname"]>();

    //Error Handling
    const [errorMsg, setErrorMsg] = useState<FollowersState["errorMsg"]>();

    const GetUserInformation = async() => {
        if(router.query.id)
        {
            const response = await fetch('http://localhost:3000/api/fetch_profile', {
                method:'GET',
                headers:{
                    "Authorization": typeof router.query.id ==="string" ? router.query.id : ""
                },
            });
            const data:Data = await response.json();
            if(data)
            {
                const result:Profile = data.result;
                setUsername(result.username);
                setName(result.name);
                setLastname(result.lastname);
                GetFollowerInformation();
            }
            else
            {
                setErrorMsg("Unable to fetch follower data.")
            }
        }
    }

    const GetFollowerInformation = async() => {
        if(router.query.id)
        {
            const response = await fetch('http://localhost:3000/api/fetch_followers',
            {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: router.query.id
                })
            });
    
            const data:Data = await response.json();
            const result:Array<Array<Profile>> = data.result;
            setFollowers(result[0]);

        }
    }

    const FormatJSX = () => {
        if(followers)
        {
            return followers.map(follower => {
                return(
                <motion.div onClick={() => {
                    router.push('/profile/'+ follower.username)
                }} className='bg-slate-800 p-4 cursor-pointer hover:bg-slate-700 duration-150 text-white rounded-md flex flex-col  items-start  h-24 justify-center w-6/12'>
                    <p className='text-xl  font-bold'>{follower.name + " " + follower.lastname}</p>
                    <div className='flex gap-2 text-sm'>
                        <p className='opacity-80'>{follower.username}</p>
                    </div>
                    <p className='text-sm'>Creator of SocialNet.com, Husband, Devoted Muslim, Supreme Turan Boy.</p>
                </motion.div>)
            })
        }
    }

    useEffect(() => {
        GetUserInformation();
    }, [router.pathname, router.query.id])

    return (
        <div className='bg-[#050406] w-full h-screen flex flex-col items-center justify-start'>
            <div className='w-full flex  items-center justify-center'>
                {(() => {
                    if(username)
                    {
                        return (
                            <div className=' bg-black items-center  flex-col grid grid-rows-2 grid-cols-3 rounded-md text-white w-6/12 '>
                                <FaArrowLeft className='m-4 justify-self-start  row-start-1 col-start-1 cursor-pointer' onClick={() => {
                                    router.push("/profile/" + username)
                                }}/>
                                <div className='self-start  p-2 col-start-2 row-start-1 justify-self-center flex items-center justify-center flex-col  '>   
                                    <p className='text-xl font-bold'>{username}</p>
                                    <p className='opacity-70'>{name + " " + lastname}</p>
                                </div>
                                <p className='text-xl justify-self-center font-bold row-start-2 col-start-2'>Followers</p>
                            </div>)
                    }
                })()}
            </div>
            {(() => {

                if(errorMsg)
                {
                    return(
                        <h1>{errorMsg}</h1>
                    )
                }
                else if(!followers)
                {
                    return ( <Loader borderWidth='border-4' height='h-12' width='w-12' />)
                }
            })()}
            {FormatJSX()}
        </div>
    )
}