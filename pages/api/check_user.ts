import type { NextApiRequest, NextApiResponse } from 'next'
import {Data} from './create_user'
import {comparePasses} from "../../features/bcypt";
import pool from '../../features/databasepg';
import {signJwt} from "../../features/jwt";

export default async function handler(req: NextApiRequest,res: NextApiResponse<Data>) {
    try {

        if(req.method === 'POST')
        {
            const {email, password} = req.body;
            const checkUser = await pool.query(`SELECT EXISTS (SELECT * FROM login WHERE email=($1))`, [email]);
            if(checkUser.rows[0].exists)
            {
                const getUser = await pool.query(`SELECT * FROM  login WHERE email=($1)`, [email]);
                const isPassCorrect = await comparePasses(password, getUser.rows[0].password);
                if(isPassCorrect)
                {
                    const checkProfile = await pool.query(`SELECT EXISTS (SELECT * FROM profile WHERE id=($1))`, [getUser.rows[0].profileid]);
                    if(checkProfile.rows[0].exists)
                    {
                        const getProfile = await pool.query(`SELECT * FROM profile WHERE id=($1)`, [getUser.rows[0].profileid]);
                        const token = await signJwt({email,name:getProfile.rows[0].name, lastname:getProfile.rows[0].lastname, username:getProfile.rows[0].username});
                        if(typeof token === 'string') res.status(200).json({result: 'Authorized', auth:true, error:false,token:token});
                        else{
                            res.status(503).json({result: 'Error Occured', auth:false, error:true,token:null});
                        }
                    }
                    else
                    {
                        res.status(401).json({result: 'Wrong Credentials', auth:false, error:true,token:null});
                    }

                }
                else
                {
                    res.status(401).json({result: 'Wrong Credentials', auth:false, error:true,token:null});
                }
            }
            else{
                res.status(401).json({result: 'Wrong Credentials', auth:false, error:true,token:null});

            }
        }
        else{
            res.status(405).json({result: 'Method not allowed!',auth: false,error:false, token:null});
        }

    } catch (error) {
        res.status(503).json({result: 'Server is down, please try again later.',auth: false,error:false, token:null});

    }
}
