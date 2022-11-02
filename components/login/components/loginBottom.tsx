/* eslint-disable prettier/prettier */
import Button from 'components/button';
import { AUTH_STATUS } from 'config/app.config';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const LoginBottomSection = () => {



    const { status } = useSession();
    const router = useRouter();



    useEffect(() => {
        if (status === AUTH_STATUS.SUCCESS) router.replace('/dashboard');
    }, [router, status]);


    return (
        <div className='bottomSection'>
            <div className='title'>
                <span>Add</span>
                <span>Save</span>
                <span>Repeat</span>
            </div>

            {status === AUTH_STATUS.LOADING ? <p>Loading....</p> : <div
                className='px-2 w-100 d-flex justify-content-center align-items-center'
                style={{ flexDirection: 'column' }}
            >
                <Button className='login__button' onClick={() => signIn('google', { callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard` })}>
                    <span>
                        <i className='bi bi-envelope-fill' />
                        <span style={{ marginLeft: '5px' }}>Continue with google</span>
                    </span>
                </Button>

                <p>By connection you agree the Terms of service and Privacy policy</p>
            </div>}
        </div>
    );
};

export default LoginBottomSection;
