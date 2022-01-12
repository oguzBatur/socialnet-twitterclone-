import React, {FC, useEffect, useState} from 'react'
import {useRouter} from 'next/router';
import Navbar from '../../../components/Navbar';
import Profile from '../../../components/Profile';
import Feed from '../../../components/Feed';
import { checkToken } from '../../../features/tokens';
import { useCookies } from 'react-cookie';
import { Post, Profile as ProfileType } from '../../../common/types';
import { Data } from '../../api/create_user';
import Loader from '../../../components/Loader';
import { NextPage } from 'next';


export interface ProfileStates{
    sessionUser:string,
    allPosts: Array<Post>
}




const profile:NextPage = () =>  {
    
    const [sessionUsername, setSessionUsername] = useState<ProfileStates["sessionUser"]>("")

    const [cookies] = useCookies(["user-token"])
    const router = useRouter();
    const theID = router.query.id;

    //Profile States
    const [name,setName] = useState<ProfileType["name"]>("");
    const [lastname,setLastname] = useState<ProfileType["lastname"]>("");
    const [followers,setFollowers] = useState<ProfileType["followers"]>([]);
    const [follows,setFollows] = useState<ProfileType["follows"]>([]);
    const [likes,setLikes] = useState<ProfileType["likes"]>([]);
    const [posts,setPosts] = useState<ProfileType["posts"]>([]);
    const [location,setLocation] = useState<ProfileType["location"]>("");
    const [username,setUsername] = useState<ProfileType["username"]>("");
    const [id,setId] = useState<ProfileType["id"]>(0);
    const [img,setImg] = useState<ProfileType["img"]>();
    const [description,setDescription] = useState<ProfileType["description"]>();
    const [allPosts, setAllPosts] = useState<ProfileStates["allPosts"]>()


    //

    const FetchSessionProfile = async() => {
        const token = await checkToken(cookies['user-token']);
        setSessionUsername(token.profile.username);
        FetchProfile();
    };
    const FetchProfile = async() => {
        const response = await fetch("https://socialnettwitterclone.herokuapp.com/api/fetch_profile", {
            method: "GET",
            headers: {"Authorization": typeof theID === "string" ? theID : "" },
        });
        const data:Data = await response.json();
        const {result} = data;
        
        //Set The Profile States here
        if(result)
        {
            setName(result.name);
            setLastname(result.lastname);
            setPosts(result.posts);
            setLikes(result.likes);
            setLocation(result.location);
            setFollowers(result.followers);
            setFollows(result.follows);
            setUsername(result.username);
            setId(result.id);
            setDescription(result.description);
            setImg(result.img);

            FetchPosts();
        }
        

    }


    const FetchPosts = async() => {

        const response = await fetch("https://socialnettwitterclone.herokuapp.com/api/get_feed",
        {
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({username: theID}),
            method: "POST",
        });
        const data:Data = await response.json();
        if(typeof data.result !== "string")
        {
            const {result} = data;  
            setAllPosts(result);
         
        }
     
    }

    useEffect(() => {
        FetchSessionProfile();
    }, [theID])
    return (
        <div className='bg-[#050406] min-h-screen'>
            <Navbar />
            <Profile  followers={followers} follows={follows} id={id} description={description} img={img}  lastname={lastname} likes={likes} location={location} name={name} posts={posts} username={username} key={name + lastname + username + id}  sessionUsername={sessionUsername}    />
            <p className='w-full text-center text-3xl font-bold text-white mb-12'>Feed</p> 
            {(() => {
                if(!allPosts)
                return(
                    <div className='flex items-center justify-center p-12'>
                        <Loader borderWidth='border-4' height='h-12' width='w-12'/>
                    </div>
                )
                else
                {
                    return(

                        <Feed  posts={allPosts} />
                    )
                }
                })()}

        </div>
    )
}

export default profile;