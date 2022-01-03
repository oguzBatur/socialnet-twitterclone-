import type { NextApiRequest, NextApiResponse } from 'next'
import {Data} from './create_user'
import {checkLoginMail, getFromLoginMail, getProfileFromLoginID, checkProfileFromLoginID, getPostsWithProfileID} from '../../features/databasepg';

export default async function handler(req: NextApiRequest,res: NextApiResponse<Data>) {
    try {
        
        if(req.method === 'POST')
        {
            const {email} = req.body;
            const checkMail = await checkLoginMail(email);
            if(checkMail)
            {
                const getLogin = await getFromLoginMail(email);
                const checkProfile = await checkProfileFromLoginID(getLogin.profileid);
                if(checkProfile)
                {
                    const posts  =  await getPostsWithProfileID(getLogin.profileid);
                    res.status(200).json({result: posts, auth: true, error:false, token: null})
                }
                else
                {
                    res.status(400).json({result: 'Bad Request!',auth: false,error:false, token:null});
                }

            }
            else
            {
                res.status(400).json({result: 'Bad Request!',auth: false,error:false, token:null});

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
