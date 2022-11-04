/* eslint-disable prettier/prettier */
import Button from 'components/button';
import { AUTH_STATUS } from 'config/app.config';
import { Project } from 'interface';
import { getSession, useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useCallback, useMemo, useState } from 'react';

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Footer from 'components/footer';
import Profile from 'components/profile';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import useProjects from 'query/useProjects';



const PageLoader = dynamic(() => import('../../components/loader'));




const AddProject = () => {
    const [selectedId, setSelectedId] = useState('');
    const router = useRouter();
    const { status } = useSession();

    const { isLoading, data, isFetched, } = useProjects({ status });
    const listOfProjects = useMemo(() => data?.data?.data as Project[] ?? [], [data]);


    const handleNavigate = useCallback(() => {
        router.push('/create');
    }, [router]);

    const handleProjectChange = useCallback(
        (e: SelectChangeEvent) => {
            const { value } = e.target;

            if (!value) return;

            router.push(`/add/${value}`);
            setSelectedId(value);
        },
        [router]
    );

    if (status === AUTH_STATUS.LOADING)
        return (
            <PageLoader />
        );

    return (
        <div className='addProject'>
            <h1 className='page_title mt-3 mb-2'>Select Project</h1>

            <div className='d-flex justify-content-end align-items-center mb-1'>
                <Button className='create__project' onClick={handleNavigate}>
                    Create Project
                </Button>
            </div>

            <div>
                <FormControl fullWidth>
                    <InputLabel id='add-page-label'>
                        Select Project
                    </InputLabel>
                    <Select
                        labelId='add-page-label'
                        id='add-page-select-helper'
                        value={selectedId}
                        label='Select Project'
                        onChange={handleProjectChange}
                    >
                        <MenuItem value=''>
                            <em>None</em>
                        </MenuItem>

                        {isLoading && <PageLoader bootstrap />}


                        {!isLoading && isFetched && listOfProjects.map((_val) => (
                            <MenuItem key={_val._id?.toString()} value={_val._id?.toString()}>
                                {_val.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>

            <Footer />
            <Profile />
        </div>
    );
};



export const getServerSideProps: GetServerSideProps = async (
    context: GetServerSidePropsContext
) => {
    const session = await getSession({ req: context.req });

    // ? if not authorized
    if (!session)
        return {
            props: {
            },

            redirect: {
                destination: '/',
                statusCode: '301',
            },
        };

    return {
        props: {}
    };
};


export default AddProject;
