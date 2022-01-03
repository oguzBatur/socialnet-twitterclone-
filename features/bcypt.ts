import bcrypt from 'bcrypt';
const SALT = 4;
export const createHashedPassword = async(password:string) => {
    return await bcrypt.hash(password,SALT)
}

export const comparePasses =async (password:string, hashed_password:string) => {
    return await bcrypt.compare(password,hashed_password)
}