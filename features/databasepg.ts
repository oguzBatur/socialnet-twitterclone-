import {Pool, QueryResult} from 'pg';
import { Profile, Login, Post } from '../common/types';


const pool = new Pool({
    user: 'nlfjnebkuvkume',
    database: 'd9c4odldclg89q',
    port: 5432,
    host: 'ec2-54-77-182-219.eu-west-1.compute.amazonaws.com',
    password: '770217dd3e88bf83175bd3224808cebaf49ac264bfc7e42d1465132295c8a5ef',
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

export const getPostsWithProfileID =async (profileID:string | number):Promise<object | Array<object>> => {
    const profile =  (await pool.query('SELECT * FROM profile WHERE id=($1)', [profileID])).rows[0];
    let posts:Array<any> =[]; 
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





/**
 * @description Check and get the user profile.
 * @param username The Username of the user.
 * @returns If there are no usernames that match the usernames in the database, it will return null
 */
export const checkAndGetUserName = async(username:string | number):Promise<null | Profile> => {
    const doesTheProfileExist = await (await pool.query('SELECT EXISTS(SELECT * FROM profile WHERE username=($1))', [username])).rows[0].exists;
    if(doesTheProfileExist)
    {
        return await (await pool.query('SELECT * FROM profile WHERE username=($1)', [username])).rows[0];
    }
    return doesTheProfileExist;
}

export const followSomeone = async(followerUsername:string, followUsername:string) => {
    try {
        if(followerUsername && followUsername)
        {
            const followerProfile = await checkAndGetUserName(followerUsername);
            const followedProfile = await checkAndGetUserName(followUsername);
            if(followedProfile && followerProfile)
            {
                const follow = await (await pool.query('UPDATE profile SET follows = array_append(follows, ($1)) WHERE id=($2)', [followedProfile.id,followerProfile.id])).rows[0];
                const followed = await (await pool.query('UPDATE profile SET followers = array_append(followers, ($1)) WHERE id=($2)', [followerProfile.id,followedProfile.id])).rows[0];
            }           
        }
        else
        {
            return undefined
        }
    } catch (error) {
        return new Error("")
    }
}

interface getFeedOptions{
    userinfo: string|number,
    options:{
        fetchingData: "username" | "profileID" | "loginEmail" | "loginID" | undefined,
        returnData: "Login" | "Profile" | "All Posts" | "Posts" | "FollowData"
    }

}



/**
 * @description An Query Engine Designed for Socialnet's Database.
 * @param userinfo User information to get the profile
 * @param options which data you want to use when fetching the profile. Default is username.
*/





export const queryEngine = async(userinfo:getFeedOptions["userinfo"],options:getFeedOptions["options"]) => {
    try 
    {
        let userProfile:Profile;
        let userLogin;
    
        switch(options.fetchingData)
        {
            case 'loginEmail':
                userLogin = await (await pool.query("SELECT * FROM login WHERE email=($1)", [userinfo])).rows[0];
                userProfile = await (await pool.query("SELECT * FROM profile WHERE id=($1)", [userLogin.profileid])).rows[0];
                break;
            case 'profileID':
                userProfile = await (await pool.query("SELECT * FROM profile WHERE id=($1)", [userinfo])).rows[0];
                break;
            case 'username':
                userProfile = await (await pool.query("SELECT * FROM profile WHERE username=($1)", [userinfo])).rows[0];
                break;
            case undefined:
                userProfile = await (await pool.query("SELECT * FROM profile WHERE username=($1)", [userinfo])).rows[0];
                break;
            case 'loginID':    
                userLogin = await (await pool.query("SELECT * FROM login WHERE id=($1)", [userinfo])).rows[0];
                userProfile = await (await pool.query("SELECT * FROM profile WHERE id=($1)", [userLogin.profileid])).rows[0];
                break;
            default:
                return undefined;
        }

        switch(options.returnData)
        {
            case 'Login':
                if(options.fetchingData === 'loginEmail' || options.fetchingData === 'loginID')
                {
                    return userLogin;    
                }
                else return new Error("You cannot fetch login data with ProfileID or Username!");


            case 'Profile':
                return userProfile;
                break;

            case 'All Posts':
                console.log("This is the user thats feed we have to fetch: ", userProfile);
                let posts:Array<Post>=[];
                let followingIDs:Array<number> =[];
                const postsIDs:Array<number> = await (await pool.query("SELECT posts FROM profile WHERE id=($1)", [userProfile.id])).rows[0].posts;
                console.log('It seems like youre goin in!')
                if(userProfile.follows)
                {
                    for (let j = 0; j < userProfile.follows.length; j++) {
                        const getThis:Array<number> = await (await pool.query("SELECT posts FROM profile WHERE id=($1)", [userProfile.follows[j]])).rows[0].posts;
                        followingIDs.push(...getThis);
                    }
                }
                if(postsIDs)
                {
                    for(let i = 0; i < postsIDs.length; i++)
                    {
                        const individualPosts = await (await pool.query("SELECT * FROM post WHERE id=($1)", [postsIDs[i]])).rows[0];
                        if(individualPosts)
                        {
                            posts.push(individualPosts);
                        }
                    }
                }
                if(followingIDs)
                {
                    for (let i = 0;  i < followingIDs.length; i++) {
                        const followingPosts = await (await pool.query("SELECT * FROM post WHERE id=($1)", [followingIDs[i]])).rows[0];
                        if(followingPosts)
                        {
                            posts.push(followingPosts);
                        }
                    }
                }
                if(!posts)
                {
                    return undefined;
                }
                return posts;



            case 'FollowData':
                let followersData:Array<Profile> = [];
                let followingData:Array<Profile> = [];
                let followData:Array<Array<Profile>> = [];
                for (let i = 0; i < userProfile.followers.length; i++) {    
                    const followers = await (await pool.query('SELECT * FROM profile WHERE id=($1)', [userProfile.followers[i]])).rows[0];
                    followersData.push(followers)
                }
                for (let i = 0; i < userProfile.follows.length; i++) {
                    const following = await (await pool.query('SELECT * FROM profile WHERE id=($1)', [userProfile.follows[i]])).rows[0];
                    followingData.push(following);
                }
                followData.push(followingData, followersData);
                return followData;
            case 'Posts':
                let userPosts:Array<Post> = [];
                for (let i = 0; i < userProfile.posts.length; i++) {
                    const thePost = await (await pool.query("SELECT * FROM post WHERE id=($1)", [userProfile.posts[i]])).rows[0];
                    userPosts.push(thePost);
                }
                return userPosts;
        }
    } 
    catch (error) 
    {
        if(error instanceof Error)
        {
            return error;
        }
    }

    
}



export default pool;