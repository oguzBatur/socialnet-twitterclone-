import { NextApiRequest, NextApiResponse } from "next";
import { followSomeone } from "../../features/databasepg";
import { Data } from "./create_user";

export default async function handler(req:NextApiRequest,res:NextApiResponse<Data>) {
    if(req.method === "POST")
    {
        const {followerUsername, followedUsername} = req.body;
        const result = await followSomeone(followerUsername, followedUsername);
        res.json({
            auth: false,
            error: false,
            result: "Deneme",
            token: null
        })
        
    }
    else
    {
        res.json
    }
}