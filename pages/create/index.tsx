/* eslint-disable prettier/prettier */

import axios from 'axios';
import Button from 'components/button';
import Footer from 'components/footer';
import TextFields from 'components/textField';
import { AUTH_STATUS } from 'config/app.config';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { getSession, useSession } from 'next-auth/react';
import { ChangeEvent, useCallback, useState } from 'react';

const CreateProject = () => {

    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const { data, status } = useSession();

    console.log(data);

    const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    }, []);

    const handleProject = useCallback(() => {

        if (!name) return;

        setLoading(true);
        axios.post('/api/project/create', { name }).then(() => {
            setName('');
            setLoading(false);
        })
            .catch((err) => {
                setLoading(false);
                console.error(err);
            });


    }, [name]);





    if (status === AUTH_STATUS.LOADING) return <p>Loading</p>;

    return (
        <div className='createProject'>
            <h1 className='page_title mt-3 mb-2'>Create Project</h1>

            <TextFields fullWidth label='Name of the project' className='mb-3' value={name} onChange={handleChange} />

            <Button loaderColor='white' className='submit__button' value='Submit' onClick={handleProject} loading={loading} />

            <Footer />
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
