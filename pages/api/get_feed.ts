import type { NextApiRequest, NextApiResponse } from 'next'
import {Data} from './create_user'
import {checkLoginMail, getFromLoginMail, getProfileFromLoginID, checkProfileFromLoginID, getPostsWithProfileID, queryEngine} from '../../features/databasepg';
import { Post } from '../../common/types';


/**
 * @description Will give back feed with the email given.
 */

export default async function handler(req: NextApiRequest,res: NextApiResponse<Data>) {
    try {
        
        if(req.method === 'POST')
        {
            const {email} = req.body;            
            const theFeed:Array<Post> =  await queryEngine(email,{
                fetchingData: 'loginEmail',
                returnData: 'All Posts'
            });
            console.log(theFeed);
            res.json({
                auth: true,
                error: false,
                result: theFeed,
                token: null
            })
        }    

        else
        {
            res.status(405).json({result: 'Method not allowed!',auth: false,error:false, token:null});
        }

    } catch (error) {
        console.log(error);
        res.status(503).json({result: null, auth: false, error: true, token:null});
    }
}
