export const checkToken = async(token:string) => {
    if(!token)
    {
        return undefined;
    }
    else
    {
        const response = await fetch('https://socialnettwitterclone.herokuapp.com/api/auth', {
            headers:{
                'Authorization': token
            },
            method: "GET"

        })
        const data = await response.json();
        if(!data.auth)
        {
            return undefined;
        }
        else
        {
            return data.result;
        }
      
    }
}