import React, { FC, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion';
import { Profile } from '../../../common/types';
import { Data } from '../../api/create_user';
import Loader from '../../../components/Loader';
import {FaArrowLeft} from "react-icons/fa"
import Image from 'next/image';
import Navbar from '../../../components/Navbar';
import { NextPage } from 'next';


interface FollowingState{
    following:Array<Profile>,
    username: string,
    name: string,
    lastname: string,
    errorMsg: string
}


const following:NextPage = () => {

    const router = useRouter();


    // Following State
    const [following,setFollowing] = useState<FollowingState["following"]>();

    //User State
    const [username, setUsername] = useState<FollowingState["username"]>();
    const [name, setName] = useState<FollowingState["name"]>("");
    const [lastname, setLastname] = useState<FollowingState["lastname"]>();

    //Error Handling
    const [errorMsg, setErrorMsg] = useState<FollowingState["errorMsg"]>();

    const GetUserInformation = async() => {
        if(router.query.id)
        {
            const response = await fetch('https://socialnettwitterclone.herokuapp.com/api/fetch_profile', {
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
            const response = await fetch('https://socialnettwitterclone.herokuapp.com/api/fetch_followers',
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
            setFollowing(result[1]);

        }
    }

    const FormatJSX = () => {
        if(following)
        {
            return following.map(following => {
                return(
                <motion.div onClick={() => {
                    router.push('/profile/'+ following.username)
                }} className='bg-slate-800 p-4 cursor-pointer hover:bg-slate-700 duration-150 text-white rounded-md flex gap-3  items-center   justify-start w-6/12'>
                    <div className='w-16 h-16 rounded-full relative text-white overflow-hidden flex items-center justify-center'>
                        <Image src={following.img} layout='fill' objectFit='cover' alt='profile-pic' about='profile picture' ></Image>
                    </div>
                    <div>
                        <p className='text-xl  font-bold'>{following.name + " " + following.lastname}</p>
                        <div className='flex gap-2 text-sm'>
                            <p className='opacity-80'>{following.username}</p>
                        </div>
                        <p className='text-sm h-6'>{following.description ? following.description : " "}</p>
                    </div>
                </motion.div>)
            })
        }
    }

    useEffect(() => {
        GetUserInformation();
    }, [router.pathname, router.query.id])

    return (
        <div className='bg-[#050406] w-full h-screen flex flex-col items-center justify-start'>

            <div className='w-full '>
                <Navbar />
            </div>
            <div className='w-full flex   items-center justify-center'>
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
                                <p className='text-xl justify-self-center font-bold row-start-2 col-start-2'>Following</p>
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
                else if(!following)
                {
                    return ( <Loader borderWidth='border-4' height='h-12' width='w-12' />)
                }
            })()}
            {FormatJSX()}
        </div>
    )
}

export default following;