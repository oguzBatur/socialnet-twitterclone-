import { NextApiRequest, NextApiResponse } from "next";
import { Data } from "./create_user";

export default async function handler(req:NextApiRequest,res:NextApiResponse<Data>) {
    if(req.method === "GET")
    {
        const username = req.headers.authorization;
        console.log(username);
        
        res.json({auth:true,error:false,result:"Deneme",token:null})
    }
    else res.json({
        auth: false,
        error: true,
        result: "Method not allowed",
        token: null
    })
}