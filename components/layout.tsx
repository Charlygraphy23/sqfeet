import Script from 'next/script'
import React from 'react'

type Props = {
    children: React.ReactElement
}

const Layout = ({ children }: Props) => {
    return (
        <>

            <Script id="" src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/js/bootstrap.bundle.min.js" integrity='sha384-A3rJD856KowSb7dwlZdYEkO39Gagi7vIsF0jrRAoQmDKKtQBHUuLZ9AsSv4jD4Xa' crossOrigin='anonymous' />


            {children}
        </>
    )
}

export default Layout