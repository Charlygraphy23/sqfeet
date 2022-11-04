/* eslint-disable prettier/prettier */

import { toast } from 'components/alert';
import Button from 'components/button';
import Footer from 'components/footer';
import Profile from 'components/profile';
import { AUTH_STATUS } from 'config/app.config';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { getSession, useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { ChangeEvent, Suspense, useCallback, useState } from 'react';
import { axiosInstance } from '_http';

const PageLoader = dynamic(() => import('../../components/loader'), { ssr: true, suspense: true });
const TextFields = dynamic(() => import('components/textField'), { ssr: true, suspense: true });


const CreateProject = () => {

    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const { status } = useSession();
    const router = useRouter();


    const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    }, []);

    const handleProject = useCallback(() => {

        if (!name) return;

        setLoading(true);
        axiosInstance.post('/project/create', { name }).then(() => {
            setName('');
            setLoading(false);
            toast.success('Created!');
            router.back();
        })
            .catch((err: any) => {
                setLoading(false);
                toast.error(err?.message);
            });


    }, [name, router]);



    if (status === AUTH_STATUS.LOADING)
        return <Suspense fallback={<PageLoader bootstrap />}>
            <PageLoader />
        </Suspense>;

    return (
        <div className='createProject'>
            <h1 className='page_title mt-3 mb-2'>Create Project</h1>

            <Suspense fallback={<PageLoader bootstrap />}>
                <TextFields fullWidth label='Name of the project' className='mb-3' value={name} onChange={handleChange} />
            </Suspense>

            <Button loaderColor='white' className='submit__button' value='Submit' onClick={handleProject} loading={loading} />

            <Footer />
            <Profile />
        </div>
    );

};


export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {

    const session = await getSession({ req: context.req });

    if (!session) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }

    return {
        props: {}, // will be passed to the page component as props
    };
};

export default CreateProject;
