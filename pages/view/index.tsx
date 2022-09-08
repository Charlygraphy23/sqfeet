/* eslint-disable prettier/prettier */
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import Footer from 'components/footer';
import ViewProject from 'components/viewProject';
import { serializeToObject } from 'config/db.config';
import { getAllProjectsByUser } from 'database/helper';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import { useCallback, useState } from 'react';

type Props = {
    data: any[]
}

const ViewPage = ({ data }: Props) => {

    const [selectedProject, setSelectedProject] = useState('');
    const [readOnly, setReadOnly] = useState(true);


    const handleReadOnly = useCallback(() => {

        setReadOnly(prevState => !prevState);

    }, []);


    return (
        <div className='viewProject'>

            <h1 className='page_title mt-3 mb-2'>View/Edit Project</h1>

            <div>
                <FormControl fullWidth>
                    <InputLabel id='demo-simple-select-helper-label'>
                        Select Project
                    </InputLabel>
                    <Select
                        labelId='demo-simple-select-helper-label'
                        id='demo-simple-select-helper'
                        value={selectedProject}
                        label='Select Project'
                        onChange={e => setSelectedProject(e.target.value)}
                    >
                        <MenuItem value=''>
                            <em>None</em>
                        </MenuItem>
                        {data.length && data?.map((val) => <MenuItem key={val?._id} value={val?._id}>{val?.name}</MenuItem>)}


                    </Select>
                </FormControl>
            </div>



            {selectedProject && <>
                <ViewProject readOnly={readOnly} id={selectedProject} handleReadOnly={handleReadOnly} />

            </>}

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
    const data = serializeToObject<any[]>(response.data).map(_val => _val?._doc);

    return {
        props: {
            data
        }
    };
};

export default ViewPage;
