/* eslint-disable prettier/prettier */
import Loader from 'lottie/loader.json';
import { useMemo } from 'react';
import Lottie from 'react-lottie';

type Props = {
    // eslint-disable-next-line react/require-default-props
    bootstrap?: boolean
}

const PageLoader = ({ bootstrap = false }: Props) => {
    const defaultOptions = useMemo(() => ({
        loop: true,
        autoplay: true,
        animationData: Loader,

    }), []);

    if (bootstrap) return <div className='d-flex my-3 justify-content-center'>
        <div className='spinner-border' role='status' style={{ width: '30px', height: '30px' }} />
    </div>;

    return <div className='d-flex my-3'>
        <Lottie options={defaultOptions}
            height={150}
            width={150}
        />
    </div>;
};

export default PageLoader;
