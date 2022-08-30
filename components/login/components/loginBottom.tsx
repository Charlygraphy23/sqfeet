/* eslint-disable prettier/prettier */
import Button from 'components/button';
import { signIn } from 'next-auth/react';

const LoginBottomSection = () => (
    <div className='bottomSection'>
        <div className='title'>
            <span>Add</span>
            <span>Save</span>
            <span>Repeat</span>
        </div>

        <div
            className='px-2 w-100 d-flex justify-content-center align-items-center'
            style={{ flexDirection: 'column' }}
        >
            <Button className='login__button' onClick={() => signIn('google')}>
                <span>
                    <i className='bi bi-envelope-fill' />
                    <span style={{ marginLeft: '5px' }}>Continue with google</span>
                </span>
            </Button>

            <p>By connection you agree the Terms of service and Privacy policy</p>
        </div>
    </div>
);

export default LoginBottomSection;
