import React, { useEffect, useState } from 'react'
import {useCookies} from 'react-cookie';
import {Router, useRouter} from 'next/router';
import { motion } from 'framer-motion';
import {Profile as ProfileType} from '../common/types';

interface ProfileProps extends ProfileType {

    sessionUsername:string,

}

interface ProfileStates extends ProfileType{
    cannotFollow: boolean,
    theSession: Array<number>,
    theFetched: number,
    followButton: string,
}

export default function Profile({followers,follows,id,lastname,likes,location,name,posts,sessionUsername,username}:ProfileProps) {

    const [cookies] = useCookies(["user-token"]);
    const [cannotFollow, setCannotFollow] = useState<ProfileStates["cannotFollow"]>();
    const [theSession, setTheSession] = useState<ProfileStates["theSession"]>();
    const [theFetched, setTheFetched] = useState<ProfileStates["theFetched"]>();
    const [followButton, setFollowButton] = useState<ProfileStates["followButton"]>("Follow");


    const {query} = useRouter();
    const theID = query.id;
    const router = useRouter();

 
    const FollowButtonHandler = () => {
        if(theID ===sessionUsername)
        {
            
            setCannotFollow(true);
        }
     
    }



    const FollowTheUser = async() => {
        const response = await fetch("http://localhost:3000/api/follow", {
            method: "POST",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                followerUsername: sessionUsername,
                followedUsername: theID
            })
        });
        const data = await response.json();
        
    }
 
    const fetchSessionFollowData = async() => {
        const response = await fetch('http://localhost:3000/api/fetch_profile', {
            method: 'GET',
            headers: {
                'Authorization' : sessionUsername
            },
        });
        const data = await response.json();
        console.log(data.result.followers);
        setTheSession(data.result.followers);
        fetchFollowingData();
    }

    const fetchFollowingData = async() => {
        const response = await fetch('http://localhost:3000/api/fetch_profile', {
            method: 'GET',
            headers: {
                'Authorization' : username
            },
        });
        const data = await response.json();
        setTheFetched(data.result.id);
        DoesSessionFollowTheProfile();
        
    }

    const DoesSessionFollowTheProfile = async() => {
        if(theSession)
        {
            for (let i = 0; i < theSession.length; i++) {
                if(theSession[i] === theFetched){
                    setCannotFollow(true);
                    setFollowButton("Following")
                    break;
                }
            }
        }
    }

    useEffect(() => {
        fetchSessionFollowData();
        FollowButtonHandler();
        console.log("Profile Initiated")
    }, [theFetched])


    const list = {
        visible: { opacity: 1, y:0 },
        hidden: { opacity: 0 , y:10},
    }
    const item = {
        visible: { opacity: 1, y: 0 },
        hidden: { opacity: 0, y: -20 },
    }
    //!sessionUsername || !name || !lastname || !username || !followers || !follows || !theFetched || !theSession
    if(!sessionUsername || !name || !lastname || !username || !followers || !follows || !theFetched || !theSession)
    {
        return(
            
            <div key={"profile-render"}  className=' mb-12  text-white bg-[#2f3d4f] grid grid-rows-2 w-6/12 m-auto p-12  rounded-3xl grid-cols-3 items-center my-8 animate-pulse h-48 justify-items-center'>
            <p  className=' font-bold  text-3xl col-start-2 w-24 rounded-md animate-pulse   flex items-center self-end h-6 bg-gray-500'></p>
            <p   className='col-start-2 animate-pulse rounded-md    self-start opacity-40 bg-slate-500 h-5 w-12 m-2'></p>
        
            <div  className='row-start-3 gap-2 col-start-2 flex items-center justify-center '>
                <button    className='animate-pulse bg-slate-500 flex gap-1 rounded-md w-12 h-5'>
                </button>
                <button    className='h-5 w-12 animate-pulse rounded-md bg-slate-500 flex gap-1'>
                </button>
            </div>
        </div>
        )
    }
    else
    {
    
        return (
            <motion.div key={"profile-render"}  className=' mb-12  text-white bg-[#2f3d4f] grid grid-rows-2 w-6/12 m-auto p-12 rounded-3xl grid-cols-3 items-center my-8  justify-items-center'>
                <motion.p variants={item} initial='hidden' animate='visible' className=' font-bold  text-3xl col-start-2  flex items-center self-end'>{username}</motion.p>
                <motion.p variants={item} initial='hidden' animate='visible'  className='col-start-2    self-start opacity-40  '>{name + " " + lastname}</motion.p>
               
                {(() => {
                    if(theID !== sessionUsername)
                    {
                        return <motion.button variants={item} initial='hidden' animate='visible' className='disabled:text-gray-300 row-start-1 row-span-2 px-8 justify-self-start col-start-3 py-3 bg-green-600 rounded-md font-bold' disabled={cannotFollow} key={"the-follow-button"} onClick={FollowTheUser} >{followButton}</motion.button>
                    }
                })()}
                <motion.div variants={item} initial='hidden' animate='visible' className='row-start-3 gap-2 col-start-2 flex items-center justify-center '>
                    <motion.button onClick={() => {
                        router.push(`/profile/${username}/following`)

                    }} variants={item} initial='hidden' animate='visible' className=' flex gap-1'>
                        {(() => {
                            return follows?.length ? <p>{follows.length}</p> : <p>0</p>
                        })()}
                        <p className=' opacity-60 text-center m-auto text-sm '>Following</p>
                    </motion.button>
                    <motion.button onClick={() => {
                        router.push(`/profile/${username}/followers`)
                    }} variants={item}  initial='hidden' animate='visible' className=' flex gap-1'>
                        {(() => {
                            return followers?.length ? <p>{followers.length }</p> : <p>0</p>
                        })()}
                        <p className='text-sm text-center m-auto opacity-60'>Followers</p>   
                    </motion.button>
                </motion.div>
            </motion.div>
        )
      
      
    }
}
