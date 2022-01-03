import React, { useState, useEffect } from 'react'
import { useCookies } from 'react-cookie'

interface CreatePostStates{
    message: string,
    error: string,
    msglength: number,
}

interface CreatePostProps{
    name: string,
    lastname: string,
    email: string,
    parentUpdate: Function,
    username: string
}

export default function CreatePost({name,lastname,email, parentUpdate, username}:CreatePostProps) {
    const [cookies, setCookie, removeCookie] = useCookies(['user-token']);
    const [message, setMessage] = useState<CreatePostStates["message"]>('')
    const [error, setError] = useState<CreatePostStates["error"]>('')
    const [msglength, setMsglength] = useState<CreatePostStates["msglength"]>(0);

    
    const createPost = async() => {
        if(message !== '')
        {
            parentUpdate();
          
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
        }
        else
        {
            setError('The Message Field is Empty.')
        }
    }
    const PlaceHolderHandler = () => {
        if(message === '')
        {
            return(
                <div className='absolute bottom opacity-50 z-10 left-0  pl-8'>Share Your Thoughts...</div>
            )
        }
        else
        {
            return(
                <div></div>
            )
        }
    }
    const handleMessageInput = (e: React.FormEvent<HTMLSpanElement>) => {
        
        if(e.currentTarget.innerText.length < 120)
        {
            setMessage(e.currentTarget.innerText);
            setError('');
        }
        else
        {
            setError("Message can't be longer than 120 characters.")
            e.currentTarget.innerText = message
        }

    }
   const monitorKeyDown = (e:React.KeyboardEvent<HTMLSpanElement>) => {
        if(e.key === 'Enter')
        {
            createPost();
        }
   }

    return (
        <div className='py-8 bg-slate-50 w-full flex sm:flex-row flex-col justify-center gap-12 shadow-lg rounded-b-3xl items-center'>
            <div  className='overflow-hidden mb-6 self-center h-12 w-12 rounded-full'>
            <img src="https://scontent.fsaw1-14.fna.fbcdn.net/v/t31.18172-1/p160x160/20543650_10214230371374598_787689956164733510_o.jpg?_nc_cat=102&ccb=1-5&_nc_sid=7206a8&_nc_ohc=pviQfR27cMoAX_0cLFA&_nc_oc=AQmQgzn2QtNBZv5GjlPAX3rLsWuG8wvIqFWOQ2EzCr2rcdTBau0fxYaI6CjjliOR6qg&_nc_ht=scontent.fsaw1-14.fna&oh=00_AT8B0_C_9JXPO15bWVHpKiynbiszwdstVHbx9Dx62t-4OA&oe=61F56C38" alt="" className='w-14'/>
            </div>
            <div className='flex flex-col'>
                <div className='flex flex-col  relative '>
                    {PlaceHolderHandler}
                    <span onKeyDown={monitorKeyDown} onInput={handleMessageInput}   id='messagebox' contentEditable={true}  className=' bg-white overflow resize-none  break-all sm:w-56 md:w-96 border-2 p-4 rounded-full   border-gray-400' >
                    </span>
                   
                </div>

                {/* <input placeholder='Share your thoughts...' className=' bg-white overflow resize-none  break-all w-96 border-2 p-2 rounded-full h  border-gray-400'></input> */}
                <p className='h-6  text-red-500 font-medium text-center'>{error}</p>
            </div>
            <button  onClick={createPost} className='bg-blue-400 rounded-3xl py-2 mb-6 text-white font-bold px-6'>Share</button>
        </div>
    )
}
