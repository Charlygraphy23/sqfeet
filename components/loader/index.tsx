/* eslint-disable prettier/prettier */
import Loader from 'lottie/loader.json';
import { useMemo } from 'react';
import Lottie from 'react-lottie';

const PageLoader = () => {
    const defaultOptions = useMemo(() => ({
        loop: true,
        autoplay: true,
        animationData: Loader,

    }), []);

    return <div className='d-flex my-3'>
        <Lottie options={defaultOptions}
            height={150}
            width={150}
        />
    </div>;
};

export default PageLoader;
