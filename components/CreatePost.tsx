import React, { useState, useEffect } from 'react'
import { useCookies } from 'react-cookie'
import { motion } from 'framer-motion';
import Loader from './Loader';

interface CreatePostStates{
    message: string,
    error: any,
    msglength: number,
    notFetched: boolean
}

interface CreatePostProps{
    name: string,
    lastname: string,
    email: string,
    parentUpdate: Function,
    username: string,
}

export default function CreatePost({name,lastname,email, parentUpdate, username}:CreatePostProps) {
    const [cookies, setCookie, removeCookie] = useCookies(['user-token']);
    const [message, setMessage] = useState<CreatePostStates["message"]>()
    const [error, setError] = useState<CreatePostStates["error"]>(<motion.p initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className='h-6  text-red-500 font-medium text-center'></motion.p>)
    const [msglength, setMsglength] = useState<CreatePostStates["msglength"]>(0);
    const [notFetched, setNotFetched] = useState<CreatePostStates["notFetched"]>(false);

    
    const createPost = async() => {
        if(message?.replace(/\s/g, "") !== '')
        {
            parentUpdate();
            setNotFetched(true);

            const response = await fetch('http://localhost:3000/api/create_post', 
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization' : cookies['user-token']
                },
                body: JSON.stringify({
                    post: message,
                    author: username,
                    email: email,
                    timestamp: new Date().toISOString()
                })
            })
            setMessage('');
            const messageBox = document.getElementById('messagebox');
            if(messageBox) messageBox.innerText= '';
            const data = await response.json();
            setNotFetched(false);
        }
        else
        {
            setError(<motion.p initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className='h-6  text-red-500 font-medium text-center'>The Message Field is Empty</motion.p>)
        }
    }
  
    const LockWhenCreatingPost = () => {
        if(notFetched)
        {
            return(
                <Loader height='h-8' width='w-8' borderWidth='border-4'></Loader>
            )
        }
        else{
            return(
                <>
                    Share
                </>
            )
        }
    }
 
    const handleInput = (e:React.KeyboardEvent<HTMLDivElement>) => {
        const child = e.currentTarget.childNodes[1];
        setMessage(message + e.key);
        
    }

    return (
        <div className='flex  gap-5  px-24 py-4  items-center justify-center w-[99vw]  flex-col  '>
            <div className='bg-[#2f3d4f] p-2  sm:px-24 sm:py-12 rounded-lg flex   justify-end  flex-col gap-4'>
                <textarea placeholder={(() => {
                    if(username)
                    {

                        return 'Share your thoughts ' + username + "!"
                    }

                    
                })()} className=' bg-[#2f3d4f] overflow resize-none  break-all w-96 border-2 p-2 outline-none appearance-none rounded-lg  text-white    border-[#2f3d4f]' value={message} onChange={(e) => {
                    if(message?.replace(/\s/g, "") !== "")
                    {
                        setError("");
                    }
                    setMessage(e.target.value)
                
                }}></textarea>
                <div className='w-full flex  items-center justify-end  '>
                    <button  disabled={notFetched}  onClick={createPost} className='disabled:text-gray-3s00 flex items-center justify-center bg-blue-400 rounded-3xl py-2  w-24 h-12 text-white font-bold px-6'>
                            {LockWhenCreatingPost()}
                    </button>

                </div>
                <p className='h-1'>{error}</p>
            </div>
        </div>
    )
}
