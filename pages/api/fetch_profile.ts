import type { NextApiRequest, NextApiResponse } from 'next'
import pool from '../../features/databasepg';
import { createHashedPassword } from '../../features/bcypt';
import {signJwt} from '../../features/jwt';
import {Data} from "./create_user";


export default async function handler(req: NextApiRequest,res: NextApiResponse<Data>) {
    try {
        if(req.method === 'POST')
        {
            const {id} = req.body;



            res.json({
                result: id,
                error: false,
                token: null,
                auth: false
            })

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

    }
}
