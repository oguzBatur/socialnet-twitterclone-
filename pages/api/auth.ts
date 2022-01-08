import type { NextApiRequest, NextApiResponse } from 'next'
import {Data} from './create_user'
import pool, { getFromLoginMail, getProfileFromLoginID } from '../../features/databasepg';
import { verifyJwt } from '../../features/jwt';


export default async function handler(req: NextApiRequest,res: NextApiResponse<Data>) {
    try {
        
        if(req.method === 'GET')
        {
            const token = req.headers.authorization;
            if(!token) res.status(401).json({result: 'No token given!',auth: false,error:false, token:null});
            else{
                const deconstructToken = await verifyJwt(token);
                console.log(deconstructToken);

                const checkIfExists = await pool.query('SELECT EXISTS(SELECT * FROM login WHERE email=($1))',[deconstructToken.email]);
                if(checkIfExists.rows[0].exists) 
                {
                    const profile = await getProfileFromLoginID(await (await getFromLoginMail(deconstructToken.email)).profileid);
                    console.log(profile);
                    console.log('It does exist!');
                    const responseObject = {
                        profile,
                        email: deconstructToken.email
                    }
                    res.status(200).json({result: responseObject, auth: true, error: false, token:null})
                }
                else
                {
                    console.log('It doesnt exists!');
                    res.status(200).json({result: 'Invalid Token', auth: false, error: false, token:null})
                }
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
