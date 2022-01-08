

// The User Profile in the DB.
export interface Profile{
    id: number,
    name: string,
    lastname: string,
    username:string,
    location: string | null,
    posts: Array<number>,
    likes: Array<number>,
    follows: Array<number>,
    followers: Array<number>
}

export interface Post{
    id: number,
    post: string,
    author: string,
    timestamp: string
}

export interface Login{
    id: number,
    password: string,
    profile: number
}

export interface Like{
    id: number,
    postid: number,
    timestamp: Date
}

