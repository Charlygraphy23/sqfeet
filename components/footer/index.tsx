/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable prettier/prettier */

import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback } from 'react';

const Footer = () => {
    const router = useRouter();

    const routeMatch = useCallback((path: string) => {
        const rgx = new RegExp(`^/${path}`, 'g');

        return router.asPath.match(rgx);
    }, [router.asPath]);

    const isDashboardActive = routeMatch('dashboard');
    const isAddActive = routeMatch('add');
    const isProfileActive = routeMatch('view');

    return (
        <ul className='footer'>
            <li>
                <Link href='/dashboard'>
                    <a
                        className={classNames('fl__link', {
                            active: isDashboardActive,
                        })}
                    >
                        {isDashboardActive ? (
                            <i className='bi bi-house-door-fill' />
                        ) : (
                            <i className='bi bi-house-door' />
                        )}
                    </a>
                </Link>
            </li>

            <li>
                <Link href='/add'>
                    <a
                        className={classNames('fl__link main', {
                            active: isAddActive,
                        })}
                    >
                        <i className='bi bi-plus' />
                    </a>
                </Link>
            </li>

            <li>
                <Link href='/view'>
                    <a
                        className={classNames('fl__link', {
                            active: isProfileActive,
                        })}
                    >
                        <i className='bi bi-view-list' />
                    </a>
                </Link>
            </li>
        </ul>
    );
};

export default Footer;
