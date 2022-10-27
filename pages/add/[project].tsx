/* eslint-disable prettier/prettier */
import Footer from 'components/footer';
import { AUTH_STATUS } from 'config/app.config';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { Suspense } from 'react';

const AddPageContainer = dynamic(() => import('../../components/addPage'), { ssr: false, suspense: true });

const PageLoader = dynamic(() => import('../../components/loader'), { ssr: false, suspense: true });


const AddPage = () => {

    const router = useRouter();
    const { status } = useSession();
    const { project } = router.query;
    const id = String(project);

    if (status === AUTH_STATUS.LOADING)
        return <Suspense fallback={<PageLoader bootstrap />}>
            <PageLoader />
        </Suspense>;


    return (
        <div className='addPage'>
            <h1 className='page_title mt-3'>Add Data</h1>


            <Suspense fallback={<PageLoader bootstrap />}>
                <AddPageContainer projectId={id ?? ''} addPage />
            </Suspense>
            <Footer />
        </div>
    );
};

export default AddPage;
