import React, {useEffect, useState} from 'react'
import {useRouter} from 'next/router';
import Navbar from '../../components/Navbar';
import { GetServerSideProps, GetServerSidePropsResult, NextPageContext } from 'next';
import Profile from '../../components/Profile';
import Feed from '../../components/Feed';
import { checkToken } from '../../features/tokens';
import { useCookies } from 'react-cookie';
import { Post, Profile as ProfileType } from '../../common/types';
import { verifyJwt } from '../../features/jwt';


export interface ProfileStates{
    sessionUser:string
}




export default function profile() {
    
    const [sessionUsername, setSessionUsername] = useState<ProfileStates["sessionUser"]>("")

    const [cookies, setCookie, removeCookie] = useCookies(["user-token"])
    const router = useRouter();
    const theID = router.query.id;

 

    const FetchSessionProfile = async() => {
        const token = await checkToken(cookies['user-token']);
        setSessionUsername(token.profile.username)
    }

    useEffect(() => {
        FetchSessionProfile();
    }, [theID])
    return (
        <div className='bg-gray-900  min-h-screen '>
            <Navbar username={username} />
            <Profile sessionUsername={sessionUsername}   />
            <Feed username={username} posts={posts} />

        </div>
    )
}

