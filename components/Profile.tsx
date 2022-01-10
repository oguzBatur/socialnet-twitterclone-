import React, { useEffect, useState } from 'react'
import {useCookies} from 'react-cookie';
import {useRouter} from 'next/router';
import { motion } from 'framer-motion';
import {Profile as ProfileType} from '../common/types';

interface ProfileProps extends ProfileType {

    sessionUsername:string,

}

interface ProfileStates extends ProfileType{
    cannotFollow: boolean
}

export default function Profile({followers,follows,id,lastname,likes,location,name,posts,sessionUsername,username}:ProfileProps) {

    const [cookies] = useCookies(["user-token"]);
    const [cannotFollow, setCannotFollow] = useState<ProfileStates["cannotFollow"]>(true);
    const {query} = useRouter();
    const theID = query.id;
    const FollowButtonHandler = () => {
        if(theID ===sessionUsername)
        {
            
            setCannotFollow(true);
        }
        else{
            setCannotFollow(false);
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
    const setTheValues = () => {
        console.log('Settin the values.');
    }
    useEffect(() => {
        console.log("Profile Initiated")
        FollowButtonHandler();
        setTheValues();
        
    }, [])


    const list = {
        visible: { opacity: 1, y:0 },
        hidden: { opacity: 0 , y:10},
    }
    const item = {
        visible: { opacity: 1, y: 0 },
        hidden: { opacity: 0, y: -20 },
    }
    if(!sessionUsername || (!name || !lastname || !username || !followers || !follows))
    {
        return(
            <div className='bg-gray-500 mb-12  text-white animate-pulse grid grid-rows-3 h-48 grid-cols-3 items-center pt-4 justify-items-center'>
                <p className=' font-bold  text-3xl col-start-2  flex items-center justify-center bg-gray-600 h-14 rounded-full w-48 animate-pulse'></p>
                <p className='col-start-2  opacity-60  self-start w-48 h-8 bg-gray-600 animate-pulse rounded-full'></p>
                <div className='disabled:text-gray-300 row-start-1 row-span-2 px-8 justify-self-start col-start-3 py-3 rounded-full bg-gray-600 animate-pulse  h-12 w-24 font-bold'></div>
            </div>
        )
    }
    else
    {
    
        return (
            <motion.div  className='bg-gray-500 mb-12  text-white grid grid-rows-3 grid-cols-3 items-center pt-4 justify-items-center'>
                <motion.p variants={item} initial='hidden' animate='visible' className=' font-bold  text-3xl col-start-2 w-24 flex items-center justify-center'>{username}</motion.p>
                <motion.p variants={item} initial='hidden' animate='visible'  className='col-start-2  opacity-60  self-start '>{name + " " + lastname}</motion.p>
                {(() => {
                    if(theID===sessionUsername)
                    {
                        return 
                    }
                    else
                    {
                        return <motion.button variants={item} initial='hidden' animate='visible' className='disabled:text-gray-300 row-start-1 row-span-2 px-8 justify-self-start col-start-3 py-3 bg-green-600 rounded-md font-bold' disabled={cannotFollow} onClick={FollowTheUser} >Follow</motion.button>
                    }
                })()}
                <motion.div variants={item} initial='hidden' animate='visible' className='row-start-3 col-start-2 flex items-center justify-center gap-12'>
                    <motion.button variants={item} initial='hidden' animate='visible' className='py-2 px-6'>
                        Following
                        {(() => {
                            return follows?.length ? <p>{follows.length}</p> : <p>0</p>
                        })()}
                    </motion.button>
                    <motion.button variants={item} initial='hidden' animate='visible' className='py-2 px-6'>
                        Followers
                        {(() => {
                            return followers?.length ? <p>{followers.length }</p> : <p>0</p>
                        })()}
                    </motion.button>
                </motion.div>
            </motion.div>
        )
      
      
    }
}
