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
            const {email, username} = req.body;            
            if(email)
            {
                const theFeed:Array<Post> =  await queryEngine(email,{
                    fetchingData: 'loginEmail',
                    returnData: 'All Posts'
                });
                if(theFeed)
                {
                    res.json({
                        auth: true,
                        error: false,
                        result: theFeed,
                        token: null
                    })
                }
                else
                {
                    res.json({
                        auth: false,
                        error: true,
                        result: "Can't fetch the feed.",
                        token:null
                    })
                }
                
            }
            else if (username)
            {
                const theFeed:Array<Post> = await queryEngine(username,{
                    fetchingData: 'username',
                    returnData: 'All Posts'
                })
                if(theFeed)
                {

                    res.json({
                        auth: true,
                        error: false,
                        result: theFeed,
                        token:null
                    })
                }
                else{
                    res.json({
                        auth: false,
                        error: true,
                        result: "Can't fetch the feed.",
                        token:null
                    })
                }
            }
            else
            {
                res.status(401).json({
                    auth: false,
                    error: false,
                    result: "Wrong data provided.",
                    token: null
                })
            }
        }    

        else
        {
            res.status(405).json({result: 'Method not allowed!',auth: false,error:false, token:null});
        }

    } catch (error) {
        res.status(503).json({result: null, auth: false, error: true, token:null});
    }
}
