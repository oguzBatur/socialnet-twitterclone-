import fs from 'fs';

export const createImg = async (id:string, base64Img:string) => {
    const decodedImg = btoa(base64Img);
    const writeImgfs = await fs.writeFile(`../imges/profilePics/${id}.png`, decodedImg, (err) => {
        if(err) console.log(err)
        else
        {
            console.log(writeImgfs);

        }
    })
}