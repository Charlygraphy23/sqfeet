import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from "next/router";
import { useCallback } from 'react';


const Footer = () => {
    const router = useRouter();

    const routeMatch = useCallback((path: string) => {
        const rgx = new RegExp(`^/${path}`, "g");

        return router.asPath.match(rgx)
    }, [])

    const isDashboardActive = routeMatch("dashboard")
    const isAddActive = routeMatch("add")
    const isProfileActive = routeMatch("profile")


    return (
        <ul className="footer">

            <li>
                <Link href="/dashboard" >
                    <a className={classNames("fl__link", {
                        active: isDashboardActive
                    })}>
                        {isDashboardActive ? <i className="bi bi-house-door-fill"></i> : <i className="bi bi-house-door"></i>}

                    </a>
                </Link>
            </li>

            <li>
                <Link href="/add" >
                    <a className={classNames("fl__link main", {
                        active: isAddActive
                    })}>
                        <i className="bi bi-plus"></i>
                    </a>
                </Link>

            </li>

            <li>
                <Link href="/profile" >
                    <a className={classNames("fl__link", {
                        active: isProfileActive
                    })}>
                        {isProfileActive ? <i className="bi bi-person-fill"></i> : <i className="bi bi-person"></i>}


                    </a>
                </Link>
            </li>

        </ul>
    )
}

export default Footer