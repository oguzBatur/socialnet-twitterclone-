export const checkToken = async(token:string) => {
    if(!token)
    {
        return undefined;
    }
    else
    {
        const response = await fetch('http://localhost:3000/api/auth', {
            headers:{
                'Authorization': token
            },
            method: "GET"

        })
        const data = await response.json();
        console.log(data);
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