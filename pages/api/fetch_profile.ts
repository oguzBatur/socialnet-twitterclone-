import type { NextApiRequest, NextApiResponse } from 'next'
import pool, {checkAndGetUserName, getPostsWithProfileID, queryEngine} from '../../features/databasepg';
import { createHashedPassword } from '../../features/bcypt';
import {signJwt} from '../../features/jwt';
import {Data} from "./create_user";
import { QueryResult } from 'pg';

export default async function handler(req: NextApiRequest,res: NextApiResponse<Data>) {
    try {
        if(req.method === 'GET')
        {
            if(req.headers.authorization)
            {
                const username = req.headers.authorization;
                const theUser = await queryEngine(username,{fetchingData:'username',returnData:'Profile'});
                if(theUser)
                {
                    res.json({
                        auth: true,
                        error: false,
                        result: theUser,
                        token: null
                    })
                }
                else
                {
                    res.json({
                        auth:false,
                        error:true,
                        result: "Can't fetch profile.",
                        token: null
                    })
                }
            }
            else
            {
                res.status(503).json({
                    auth: false,
                    error: false,
                    result: "Internal Server Error.",
                    token: null
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
