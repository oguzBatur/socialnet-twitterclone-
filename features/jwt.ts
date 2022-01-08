import jwt, { JwtPayload } from 'jsonwebtoken';
const SECRET = 'TheSocialNetTurkishGreatness';

interface JwtObject{
    name: string,
    lastname: string,
    email: string,
    username: string

}

export const signJwt = async(payload:JwtObject) => {
    try {
        return jwt.sign(payload,SECRET, {
            expiresIn: '2 days'
        });
        
    } catch (error) {
        return error
    }
}

export const verifyJwt =async (token:string) => {
    try {
        return  Object(jwt.verify(token,SECRET));
    } catch (error) {
        return
    }
}

