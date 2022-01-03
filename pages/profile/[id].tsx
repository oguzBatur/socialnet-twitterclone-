import React, { useEffect } from 'react'
import {useRouter} from 'next/router';

export default function profile() {
    const router = useRouter();
    const {id } = router.query;

    const FetchProfile = async() => {
        const response = await fetch(`http://localhost:3000/api/fetch_profile`, {
            method: 'POST',
            headers:
                {
                    'Content-Type': 'application/json',
                },
            body: JSON.stringify({
                id
            })
        });
        const data = await response.json();

        console.log(data);

    }
    useEffect(() => {
        FetchProfile();
    }, [id])
    return (
        <div>
            {id}
        </div>
    )
}
