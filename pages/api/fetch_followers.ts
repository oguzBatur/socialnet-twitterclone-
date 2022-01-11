import { NextApiRequest, NextApiResponse } from "next";
import { queryEngine } from "../../features/databasepg";
import { Data } from "./create_user";

export default async function handler(req:NextApiRequest,res:NextApiResponse<Data>) {
    if(req.method === "POST")
    {
        const {username} = req.body;
        console.log(username);
        const followData = await queryEngine(username, {fetchingData:"username", returnData:"FollowData"});
        
        res.json({auth:true,error:false,result:followData,token:null})
    }
    else res.json({
        auth: false,
        error: true,
        result: "Method not allowed",
        token: null
    })
}