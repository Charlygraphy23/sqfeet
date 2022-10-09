/* eslint-disable prettier/prettier */
import AddPageContainer from 'components/addPage';
import Footer from 'components/footer';
import PageLoader from 'components/loader';
import { AUTH_STATUS } from 'config/app.config';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

const AddPage = () => {

    const router = useRouter();
    const { status } = useSession();
    const { project } = router.query;
    const id = String(project);

    if (status === AUTH_STATUS.LOADING) return <PageLoader />;


    return (
        <div className='addPage'>
            <h1 className='page_title mt-3'>Add Data</h1>


            <AddPageContainer projectId={id ?? ''} addPage />

            <Footer />
        </div>
    );
};

export default AddPage;
