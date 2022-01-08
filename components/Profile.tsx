import React, { useEffect, useState } from 'react'
import {verifyJwt} from "../features/jwt"
import {useCookies} from 'react-cookie';
import { getFromLoginMail } from '../features/databasepg';
import {useRouter} from 'next/router';
import {Profile} from '../common/types';

interface ProfileProps extends Profile {
    
    sessionUsername:string,

}

interface ProfileStates{
    cannotFollow: boolean
}

export default function Profile({followers,follows,id,lastname,likes,location,name,posts,username, sessionUsername}:ProfileProps) {


    const [cookies] = useCookies(["user-token"]);
    const [cannotFollow, setCannotFollow] = useState<ProfileStates["cannotFollow"]>(true);
    const {query} = useRouter();
    const theID = query.id;
    const FollowButtonHandler = () => {
        console.log("This is the query: ",id, "\nThis is the session: ", sessionUsername )
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
                followedUsername: id
            })
        });
        const data = await response.json();
        
    }

    useEffect(() => {
        FollowButtonHandler();
    }, [sessionUsername, id])
    if(!sessionUsername)
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
            <div className='bg-gray-500 mb-12  text-white grid grid-rows-3 grid-cols-3 items-center pt-4 justify-items-center'>
                <p className=' font-bold  text-3xl col-start-2 w-24 flex items-center justify-center'>{username}</p>
                <p className='col-start-2  opacity-60  self-start '>{name + " " + lastname}</p>
                <button className='disabled:text-gray-300 row-start-1 row-span-2 px-8 justify-self-start col-start-3 py-3 bg-green-600 rounded-md font-bold' disabled={cannotFollow} onClick={FollowTheUser} >Follow</button>
                <div className='row-start-3 col-start-2 flex items-center justify-center gap-12'>
                    <button className='py-2 px-6'>
                        Following
                        {(() => {
                            return follows?.length ? <p>{follows.length}</p> : <p>0</p>
                        })()}
                    </button>
                    <button className='py-2 px-6'>
                        Followers
                        {(() => {
                            return followers?.length ? <p>{followers.length }</p> : <p>0</p>
                        })()}
                    </button>
                </div>
            </div>
        )
    }
}
