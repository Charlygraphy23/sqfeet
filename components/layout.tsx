/* eslint-disable prettier/prettier */
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useSession } from 'next-auth/react';
import Script from 'next/script';
import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { fetchUser } from 'store/actions';

type Props = {
    children: React.ReactElement;
};

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});


const Layout = ({ children }: Props) => {

    const dispatch = useDispatch();
    const session = useSession();
    const userRef = useRef();

    // @ts-ignore
    userRef.current = session?.data?.user;

    useEffect(() => {



        if (session?.data?.user && userRef !== session?.data?.user)
            // @ts-ignore
            dispatch(fetchUser(session?.data?.user?.userId));




    }, [dispatch, session?.data?.user]);


    return (
        <ThemeProvider theme={darkTheme}>
            <Script
                id=''
                src='https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/js/bootstrap.bundle.min.js'
                integrity='sha384-A3rJD856KowSb7dwlZdYEkO39Gagi7vIsF0jrRAoQmDKKtQBHUuLZ9AsSv4jD4Xa'
                crossOrigin='anonymous'
                strategy='lazyOnload'
            />

            {children}
        </ThemeProvider>
    );
};

export default Layout;
