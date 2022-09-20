/* eslint-disable prettier/prettier */
import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent
} from '@mui/material';
import Button from 'components/button';
import Footer from 'components/footer';
import PageLoader from 'components/loader';
import { AUTH_STATUS } from 'config/app.config';
import { serializeToObject } from 'config/db.config';
import { getAllProjectsByUser } from 'database/helper';
import { Project } from 'interface';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { getSession, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';

type Props = {
    data: Project[]
}

const AddProject = ({ data }: Props) => {
    const [selectedId, setSelectedId] = useState('');
    const router = useRouter();
    const { status } = useSession();

    const handleNavigate = useCallback(() => {
        router.push('/create');

    }, [router]);

    const handleProjectChange = useCallback((e: SelectChangeEvent) => {
        const { value } = e.target;
        router.push(`/add/${value}`);
        setSelectedId(value);
    }, [router]);

    if (status === AUTH_STATUS.LOADING) return <PageLoader />;

    return (
        <div className='addProject'>
            <h1 className='page_title mt-3 mb-2'>Select Project</h1>

            <div className='d-flex justify-content-end align-items-center mb-1'>
                <Button className='create__project' onClick={handleNavigate}>Create Project</Button>
            </div>

            <div>
                <FormControl fullWidth >
                    <InputLabel id='demo-simple-select-helper-label'>Select Project</InputLabel>
                    <Select
                        labelId='demo-simple-select-helper-label'
                        id='demo-simple-select-helper'
                        value={selectedId}
                        label='Select Project'
                        onChange={handleProjectChange}
                    >
                        <MenuItem value=''>
                            <em>None</em>
                        </MenuItem>
                        {data.map((_val) => <MenuItem key={_val._id?.toString()} value={_val._id?.toString()}>{_val.name}</MenuItem>)}
                    </Select>

                </FormControl>
            </div>

            <Footer />
        </div>
    );
};



export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {


    const session = await getSession({ req: context.req });

    // ? if not authorized
    if (!session) return {
        props: {
            data: []
        },
        redirect: {
            destination: '/',
            statusCode: '301'
        }
    };

    const response = await getAllProjectsByUser({ req: context.req });
    const data = serializeToObject<any[]>(response?.data ?? []).map(_val => _val?._doc);

    return {
        props: {
            data
        }
    };
};


export default AddProject;
