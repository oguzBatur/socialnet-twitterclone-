import type { NextApiRequest, NextApiResponse } from 'next'
import pool, {checkAndGetUserName, getPostsWithProfileID} from '../../features/databasepg';
import { createHashedPassword } from '../../features/bcypt';
import {signJwt} from '../../features/jwt';
import {Data} from "./create_user";
import { QueryResult } from 'pg';

export default async function handler(req: NextApiRequest,res: NextApiResponse<Data>) {
    try {
        if(req.method === 'POST')
        {
            const {username} = req.body;
            const checkUser = await checkAndGetUserName(username);
            if(checkUser === null)
            {
                
                res.json({
                    auth: false,
                    error: true,
                    result: null,
                    token:null
                })
            }
            else if(checkUser)
            {
                
                const getPosts = await getPostsWithProfileID(checkUser.id);
                console.log(getPosts);
                const result = {
                    ...checkUser,
                    posts: getPosts
                }
                res.json(
                    {
                        result,
                        auth: true,
                        error: false,
                        token: null
                    }
                )

            }
            else{
                res.json({
                    auth: false,
                    error: true,
                    result: null,
                    token:null
                })
            }
        }
        else
        {
            res.json({
                result: 'This method is not allowed!',
                error: true,
                token: null,
                auth: false
            })
        }
    }
    catch (err)
    {
        res.json({
            error: true,
            auth: false,
            result: 'User Not Found!',
            token: null
        })
    }
}
