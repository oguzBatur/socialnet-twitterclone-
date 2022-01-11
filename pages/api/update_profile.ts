import { NextApiRequest, NextApiResponse } from "next";
import { followSomeone, updateDescription, updateImg, updateLocation } from "../../features/databasepg";
import { Data } from "./create_user";

export default async function handler(req:NextApiRequest,res:NextApiResponse<Data>) {
    try {
        
        if(req.method === "PUT")
        {
            const {description, location, img, username} = JSON.parse(req.body);
            if(!username)
            {

                res.json({
                    auth: false,
                    error: true,
                    result: "Internal Server Error",
                    token: null
                });
            }
            else
            {
                if(description) 
                {
                    const updatedDescription = await updateDescription(description,username);
                }
                if(location)
                {
                    const updatedLocation = await updateLocation(username,location);
                }
                if(img)
                {
                    const updatedImg = await updateImg(img,username);
                }

                res.json({
                    auth:true,
                    error: false,
                    result: "Your profile has been updated, it may take a while to take effect.",
                    token: null
                })
            }

            
        }
        else
        {
            res.json
        }
    } catch (error) {
        
    }
}