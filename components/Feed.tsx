import React, {useEffect, useState} from 'react'
import {motion} from 'framer-motion';


interface FeedProps{
    posts: Array<object>,

}
interface FeedStates{
    postDepo: Array<any>
}


export default function Feed({posts}:FeedProps) {
    const list = {
        visible: { opacity: 1 },
        hidden: { opacity: 0 },
    }
      
    const item = {
        visible: { opacity: 1, y: 0 },
        hidden: { opacity: 0, y: -20 },
    }

    function parseISOString(isoDates:any) {
        var b = isoDates.split(/\D+/);
        return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
    }
    const [postDepo, setPostDepo] = useState<FeedStates["postDepo"]>([]);

    useEffect(() =>  {
        console.log('Checker is here!');
        FormatPosts();
        console.log(postDepo);

    }, [posts])
    const FormatPosts = () => {
         setPostDepo(posts.map(post => {
            return(
                <motion.div variants={item} className='bg-white shadow-xl w-10/12 px-6 py-3'>
                    <p className='font-medium '>{post.author}</p>
                    <p>{post.post}</p>
                    <p className='font-thin text-sm'>{post.timestamp}</p>
                    <button className='mx-2'>Like</button>
                    <button className='mx-2'>Retweet</button>
                </motion.div>
            )
        }))
    }
    
    return (
        <motion.div variants={list} initial='hidden' animate='visible' className='flex flex-col-reverse w-full gap-12 items-center'>
          {postDepo}
        </motion.div>
    )
}
