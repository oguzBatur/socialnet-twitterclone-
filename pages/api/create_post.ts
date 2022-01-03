import type { NextApiRequest, NextApiResponse } from 'next'
import {Data} from './create_user'
import {checkLoginMail, getFromLoginMail, getProfileFromLoginID, checkProfileFromLoginID, createAPost, updateAuthorProfile} from '../../features/databasepg';

export default async function handler(req: NextApiRequest,res: NextApiResponse<Data>) {
    try {
        
        if(req.method === 'PUT')
        {
            const {author, post, email, timestamp} = req.body;
            console.log('The Author: ', author)
            console.log('The Post: ', post);
            console.log('The Email: ', email);
            const checkLogin = await checkLoginMail(email);
            if(checkLogin)
            {
                const getLogin = await getFromLoginMail(email);
                const checkProfile = await checkProfileFromLoginID(getLogin.profileid);
                if(checkProfile)
                {
                    const thePost = await createAPost(author,post,timestamp);
                    const updateProfile = await updateAuthorProfile(getLogin.profileid,thePost.id)
                    console.log(thePost);
                    console.log(updateProfile);
                    
                    res.status(403).json({
                        auth: false,
                        error: false,
                        result: null,
                        token: null
                    });
                    
                }
                else
                {
                    res.status(403).json({
                        auth: false,
                        error: false,
                        result: null,
                        token: null
                    });
                }

            }
            else
            {
                res.status(403).json({
                    auth: false,
                    error: false,
                    result: null,
                    token: null
                });
            }


           

        }
        else{
            res.status(405).json({result: 'Method not allowed!',auth: false,error:false, token:null});
        }

    } catch (error) {
        console.log(error);
        res.status(503).json({result: null, auth: false, error: true, token:null});
    }
}
