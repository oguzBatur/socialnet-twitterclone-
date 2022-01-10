import { NextApiRequest, NextApiResponse } from "next";
import { queryEngine } from "../../features/databasepg";
import { Data } from "./create_user";

export default async function handler(req:NextApiRequest,res:NextApiResponse<Data>) {
    if(req.method === "GET")
    {
        const username = req.headers.authorization;
        console.log("There is a contact!!");

        const search= await queryEngine(typeof username === "string"  ? username : "", {fetchingData:"Search"});
        console.log(search);        
        res.json({auth:true,error:false,result:search,token:null})
    }
    else res.json({
        auth: false,
        error: true,
        result: "Method not allowed",
        token: null
    })
}