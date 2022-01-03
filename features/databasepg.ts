import {Pool} from 'pg';

const pool = new Pool({
    user: 'fpcsggrtjglhzy',
    database: 'd8coabc2jgenmc',
    port: 5432,
    host: 'ec2-52-19-164-214.eu-west-1.compute.amazonaws.com',
    password: 'bbecdc64bff61c2e696d2f0e6022bc5d1b1cfb1ffee27b700cc53151b6360b52',
    ssl: {
        rejectUnauthorized: false
    }

})

//! Check Information from Two Tables (Login and Profile)
export const checkLoginMail = async (email:string) => {
    return await (await pool.query('SELECT EXISTS (SELECT * FROM login WHERE email=($1))', [email])).rows[0].exists;
}
export const checkProfileFromLoginID =async (profileID:string | number) => {
    return await (await pool.query('SELECT EXISTS (SELECT * FROM profile WHERE id=($1))', [profileID])).rows[0].exists;    
}

//! Get One Row from any Table (Login and Profile)
export const getFromLoginMail = async(email:string) => {
    return await (await pool.query('SELECT * FROM login WHERE email=($1)', [email])).rows[0];
}
export const getProfileFromLoginID =async (profileID:string | number) => {
    return await (await pool.query('SELECT * FROM profile WHERE id=($1)', [profileID])).rows[0];
    
}

//! Create a Post && Update the author profile
export const createAPost =async (author:string, post:string, date:string) => {
    return await (await pool.query('INSERT INTO  post(post,author, timestamp) VALUES (($1),($2), ($3)) RETURNING *', [post,author,date])).rows[0];
}
export const updateAuthorProfile =async (profileid:string, postid:string) => {
    return await (await pool.query('UPDATE profile SET posts = array_append(posts, ($1)) WHERE id=($2)', [postid,profileid])).rows[0];
}

//! Get Posts 

export const getPostsWithProfileID =async (profileID:string | number) => {
    const profile =  (await pool.query('SELECT * FROM profile WHERE id=($1)', [profileID])).rows[0];
    let posts =[]; 
    for (let i = 0; i < profile.posts.length; i++)
     {

        posts.push(await (await pool.query('SELECT * FROM post WHERE id=($1)', [profile.posts[i]])).rows[0]);
    }
    return  posts;
}


/**
 * @description Checks the authencity of the username given.
 * @param username The username that's going to be checked.
 */

export const checkUserName = async(username:string | number) => {
    return await (await pool.query('SELECT EXISTS(SELECT * FROM profile WHERE id=($1))', [username])).rows[0].exists;
}



export default pool;