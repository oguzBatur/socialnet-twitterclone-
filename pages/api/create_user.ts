import type { NextApiRequest, NextApiResponse } from 'next'
import pool from '../../features/databasepg';
import { createHashedPassword } from '../../features/bcypt';
import {signJwt} from '../../features/jwt';
import { Profile,Post,Like,Login } from '../../common/types';

export type Data = {
  result: any
  error: boolean,
  auth: boolean,
  token: string | null
}

export default async function handler(req: NextApiRequest,res: NextApiResponse<Data>) {
    try {
        if(req.method === 'POST')
        {
            const {name, lastname, email, password, username} = req.body;

            if(name && lastname && email && password)
            {
                console.log('Will Try does it exist.')
                await pool.connect();
                const doesItExist = await pool.query('SELECT EXISTS(SELECT * FROM login WHERE email=($1))', [email]);
                await console.log(doesItExist.rows[0].exists);
                if(doesItExist.rows[0].exists)
                {
                    await console.log('It does exist!')
                    await res.status(400).json({auth:false, error:true,result: 'User Already Exists.', token:null})
                }
                else
                {
                    const checkUserName = await (await pool.query('SELECT EXISTS(SELECT * FROM profile WHERE username=($1))', [username])).rows[0].exists
                    if(checkUserName)
                    {
                        res.status(401).json({
                            auth: false,
                            error: false,
                            result: 'The Username is already in use.',
                            token: null
                        });
                    }
                    else
                    {
                        const hashedPassword = await createHashedPassword(password);
                        const token = await signJwt({email,name,lastname,username});
                        const createProfile = await pool.query('INSERT INTO profile(name,lastname,username) VALUES (($1), ($2),($3)) RETURNING *', [name,lastname, username]);
                        const {id} = createProfile.rows[0];
                        const createdUser = await pool.query(`INSERT INTO login(email, password, profileid) VALUES (($1), ($2), ($3)) RETURNING *`, [email,hashedPassword,id]);
                        await pool.end();
                        if(typeof token === 'string') res.status(200).json({auth: true, error:false,result:createdUser.rows[0], token:token});
                        else res.status(503).json({result: 'Error Occured', auth:true, error:false,token:null});
                    }
                }   
            }
            else
            {
                res.status(400).json({auth: false, error: true, result: 'There are empty fields.', token:null})
            }
        }
        else{
            res.status(405).json({result: 'Method not allowed!',auth: false,error:false, token:null});
        }

    } catch (error) {
        console.log(error)
        res.status(503).json({result: null, auth: false, error: true, token:null});
    }
}
