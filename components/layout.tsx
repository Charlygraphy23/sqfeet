/* eslint-disable prettier/prettier */
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Script from 'next/script';
import React from 'react';

type Props = {
    children: React.ReactElement;
};

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});


const Layout = ({ children }: Props) => (
    <ThemeProvider theme={darkTheme}>
        <Script
            id=''
            src='https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/js/bootstrap.bundle.min.js'
            integrity='sha384-A3rJD856KowSb7dwlZdYEkO39Gagi7vIsF0jrRAoQmDKKtQBHUuLZ9AsSv4jD4Xa'
            crossOrigin='anonymous'
            defer
        />

        {children}
    </ThemeProvider>
);

export default Layout;
