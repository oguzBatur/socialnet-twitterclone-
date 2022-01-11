import React, { useEffect, useState } from 'react'
import {motion, AnimatePresence} from 'framer-motion'
import { Data } from '../pages/api/create_user';
import Router, { useRouter } from 'next/router';
import Loader from './Loader';


interface EditProfileProps{
    img: string | undefined,
    handleEditing: any,
    username: string
}
interface EditProfileStates{
    location: string,
    description: string,
    newImg: string,
    error: string;
    processing: boolean
}


export default function EditProfile({img, handleEditing, username}:EditProfileProps) {

    const [location,setLocation] = useState<EditProfileStates["location"]>();
    const [description, setDescription] = useState<EditProfileStates["description"]>();
    const [newImg, setNewImg] = useState<EditProfileStates["newImg"]>();
    const [error,setError] = useState<EditProfileStates["error"]>();
    const [processing, setProcessing] = useState<EditProfileStates["processing"]>(false);


    function ParseIMGtoBase64(e:React.ChangeEvent<HTMLInputElement>)
    {
        let reader = new FileReader();
        if(e.currentTarget.files)
        {
            reader.readAsDataURL(e.currentTarget.files[0]);
            reader.onload = function (){
                if(reader.result && typeof reader.result === "string")
                {
                    setNewImg(reader.result);                    
                }
            }
        }

    }
    const router = useRouter();
    async function sendChangesToServer(){
        setProcessing(true)
        const response = await fetch("http://localhost:3000/api/update_profile", {
            method: "PUT",
            body:JSON.stringify({
                username: username,
                description: description,
                location: location,
                img: newImg ? newImg : img

            })
        });
        const data:Data = await response.json();
        if(data.auth)
        {
            handleEditing();
            setProcessing(false);
            router.reload();

        }
    }

    useEffect(() => {
    },[img])

    return (
        <div className='absolute w-full min-h-screen top-0 flex items-center justify-center bg-black bg-opacity-60 '>

            <motion.div initial={{y:10, opacity:0}} animate={{opacity:1, y:0}} exit={{opacity:0}} className='w-6/12  h-[500px] top-24  bg-[#2f3d4f] z-10 flex justify-center absolute   flex-col items-center shadow-xl rounded-3xl'>
                <p className='font-bold text-xl py-4'>Edit Profile</p>
                <div className='w-24 h-24 overflow-hidden  mx-12 mt-4 flex relative  items-center justify-center rounded-full border-2 border-gray-500'>
                    <img src={newImg ? newImg : img} alt="profile-pic"   />
                    <input accept='.jpg, .jpeg, .png' type="file" className='w-full h-full absolute opacity-0 rounded-full cursor-pointer z-10' onChange={ParseIMGtoBase64} />
                </div>
                <div key={"edit-the-location"} className='flex my-4 flex-col items-center justify-center w-full'>
                    <p className='font-bold'>Location</p>
                    <input type="text" onChange={(e) => setLocation(e.target.value)} className='border-2 border-gray-400  w-6/12 rounded-xl p-2 bg-[#2f3d4f]'/>
                </div>
                <div key={'edit-the-bio'} className='flex  flex-col items-center justify-center w-full'>
                    <p className='font-bold'>Bio</p>
                    <textarea onChange={(e) => setDescription(e.target.value)} className='resize-none bg-[#2f3d4f] border-gray-400 w-6/12 border-2 p-2 rounded-lg'></textarea>
                </div>
                <div className='flex items-center m-4 justify-center gap-2 mb-16'>
                    <button className='py-2 w-24 rounded-full bg-[#5f9bb4] hover:bg-[#b2b8c0]' onClick={sendChangesToServer}>
                        <AnimatePresence>

                            {(() => {
                                if(processing)
                                {
                                    return(
                                        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className='flex items-center justify-center'>
                                            <Loader key={'theloaderprofileeditor'} borderWidth='border-2' height='h-6' width='w-6' />
                                        </motion.div>
                                        )
                                    }
                                    else
                                    {
                                        return(
                                            <motion.p initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>Save</motion.p>
                                            )
                                        }
                            })()}
                        </AnimatePresence>

                        
                    </button>
                    <button className='py-2 rounded-full w-24 bg-[#e6201b] hover:bg-[#e61e1bc2] duration-150' onClick={handleEditing}>Cancel</button>
                </div>
            </motion.div>
        </div>
    )
}
