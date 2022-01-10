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
        if(message?.replace(/\s/, "") !== '')
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
    
    const handleMessageInput = (e: React.FormEvent<HTMLSpanElement>) => {
        
        if(e.currentTarget.innerText.length < 120)
        {
            setMessage(e.currentTarget.innerText);
            setError(<motion.p initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className='h-6  text-red-500 font-medium text-center'></motion.p>);
        }
        else
        {
            setError(<motion.p initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className='h-6  text-red-500 font-medium text-center'>Messages can't be longer than 120 characters.</motion.p>)
            e.currentTarget.innerText = message
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

    

    return (
        <div className='flex  px-24 py-4  items-center justify-center w-[99vw]  flex-col  '>
            <div className='bg-white p-4 rounded-lg min-h-[250px] flex items-center justify-center shadow-md w-6/12 '>
                <div className='py-8   w-full flex sm:flex-row flex-col justify-center gap-12 items-center'>
                    <div  className='overflow-hidden mb-6 self-center h-12 w-12 rounded-full'>
                    <img src="https://scontent.fsaw1-14.fna.fbcdn.net/v/t31.18172-1/p160x160/20543650_10214230371374598_787689956164733510_o.jpg?_nc_cat=102&ccb=1-5&_nc_sid=7206a8&_nc_ohc=pviQfR27cMoAX_0cLFA&_nc_oc=AQmQgzn2QtNBZv5GjlPAX3rLsWuG8wvIqFWOQ2EzCr2rcdTBau0fxYaI6CjjliOR6qg&_nc_ht=scontent.fsaw1-14.fna&oh=00_AT8B0_C_9JXPO15bWVHpKiynbiszwdstVHbx9Dx62t-4OA&oe=61F56C38" alt="" className='w-14'/>
                    </div>
                    <div className='flex flex-col w-245'>
                        <div className='flex flex-col w-full  relative '>
                            <div className='w-96 h-12  text-gray-300' >
                                share your thoughts...
                                {(() => {   
                                    if(!message)
                                    {
                                        return <br  />
                                    }
                                    else return (
                                    <span  onInput={handleMessageInput}   id='messagebox' contentEditable={true}  className=' overflow resize-none  break-all sm:w-56 md:w-96 border-2 p-4 rounded-full   border-gray-400' >
                                        {message}
                                    </span>

                                    )
                                })()}

                                {error}

                            </div>
                        </div>

                        {/* <input placeholder='Share your thoughts...' className=' bg-white overflow resize-none  break-all w-96 border-2 p-2 rounded-full h  border-gray-400'></input> */}
                        
                    </div>
                    <button  disabled={notFetched}  onClick={createPost} className='disabled:text-gray-3s00 flex items-center justify-center bg-blue-400 rounded-3xl py-2 mb-6 w-24 h-12 text-white font-bold px-6'>
                        {LockWhenCreatingPost()}
                    </button>
                </div>
            </div>
        </div>
    )
}
