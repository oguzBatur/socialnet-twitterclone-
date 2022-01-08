import Link from "next/link";


export default function Custom404()
{
    return(

        <div className='flex items-center justify-center flex-col gap-4  h-screen'>
            <div className='flex items-center  justify-center flex-col'>
                <h2 className='text-6xl'>404</h2>
                <h3>Page not found.</h3>
            </div>
            <div className='mb-24 font-bold py-4 px-12 bg-blue-400 text-white text-4xl rounded'>
                <Link href={'/'}>SocialNet</Link>
            </div>
        </div>
    )

}