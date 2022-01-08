import React, {Component, useEffect, useState} from 'react'
import {ForwardRefComponent, motion} from 'framer-motion';
import Link from 'next/link';
import {Post,Profile} from '../common/types';
interface FeedProps{
    posts: Array<Post>,
    username: string
}
interface FeedStates{
    postDepo: Array<any>,
}


export default function Feed({posts, username}:FeedProps) {
    const months:any = {
        "01": "January",
        "02": "February",
        "03": "March",
        "04": "April",
        "05": "May",
        "06": "July",
        "07": "June",
        "08": "August",
        "09": "September",
        "10": "October",
        "11": "November",
        "12": "December"
    }
    const list = {
        visible: { opacity: 1 },
        hidden: { opacity: 0 },
    }
    const item = {
        visible: { opacity: 1, y: 0 },
        hidden: { opacity: 0, y: -20 },
    }

    function parseISOString(isoDates:any) {
        const theHour = isoDates.split(/T/g)[1].split(/\./)[0];
        const theYear = isoDates.split(/T/g)[0].split(/-/)[0];
        const theMonth:string = isoDates.split(/T/g)[0].split(/-/)[1];
        const theDay = isoDates.split(/T/g)[0].split(/-/)[2];
    
        
      

        const newDate = theDay + " " + months[theMonth] + ", " +  theHour;

        return newDate;
    }
    const [postDepo, setPostDepo] = useState<FeedStates["postDepo"]>([]);

    useEffect(() =>  {
        FormatPosts();

    }, [posts])


    const FormatPosts = () => {
        console.log(posts);
        if(posts instanceof Array)
        {
            setPostDepo(posts.sort((a,b) => b.id - a.id).map((post:Post) => {
                if(post)
                {

                    return(
                        <motion.div key={post.timestamp + post.author + post.post} variants={item} className='text-white bg-neutral-600 rounded-lg  shadow-xl w-10/12 px-6 py-3'>
                            <p className='font-medium '>
                                <Link href={"/profile/" + post.author}>
                                    {post.author}
                                </Link>
                            </p>
                            <p>{post.post}</p>
                            <p className='font-thin text-sm'>{parseISOString(post.timestamp)}</p>
                        </motion.div>
                    )
                }
            
            }))    
        }
        else
        {
            setPostDepo([<p className='text-bold text-white text-2xl'>No Posts</p>])
        }
    }

    const displayManager = () => {
        console.log(postDepo)
        if(!postDepo)
        {
            return <p className='text-bold text-white text-2xl'>No Posts</p>
        }
        else
        {
            return postDepo
        }
    }
    return (
        <motion.div variants={list} initial='hidden' animate='visible' className='flex  flex-col  w-full gap-12 items-center'>
          {displayManager()}
        </motion.div>
    )
}
