/* eslint-disable prettier/prettier */
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { toast } from 'components/alert';
import Footer from 'components/footer';
import PageLoader from 'components/loader';
import ViewProject from 'components/viewProject';
import { AUTH_STATUS } from 'config/app.config';
import { serializeToObject } from 'config/db.config';
import { getAllProjectsByUser } from 'database/helper';
import { ProjectData } from 'interface';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { getSession, useSession } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';
import { axiosInstance } from '_http';

type Props = {
    data: any[]
}

const ViewPage = ({ data }: Props) => {

    const [selectedProject, setSelectedProject] = useState('');
    const [readOnly, setReadOnly] = useState(true);
    const [readOnlyId, setReadOnlyId] = useState('');
    const { status } = useSession();
    const [loading, setLoading] = useState(false);
    const [projectData, setProjectData] = useState<ProjectData>({} as ProjectData);




    const handleReadOnly = useCallback((id: string) => {

        if (!id) return toast.warning('Batch Id Missing!!');
        setReadOnly(prevState => !prevState);
        setReadOnlyId(id);
    }, []);


    useEffect(() => {
        if (!selectedProject) return;

        const controller = new AbortController();
        const { signal } = controller;

        setLoading(true);
        axiosInstance.post('/project/get', { projectId: selectedProject }, { signal }).then((res) => {
            setProjectData(res?.data?.data);
            setLoading(false);
        }).catch(error => {
            toast.error(error?.message);
            setLoading(false);
        });


        return () => {
            setLoading(false);
            controller.abort();
        };

    }, [selectedProject]);


    if (status === AUTH_STATUS.LOADING) return <PageLoader />;

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




            {selectedProject && <ViewProject readOnly={readOnly} id={selectedProject} readOnlyId={readOnlyId} handleReadOnly={handleReadOnly} loading={loading} projectData={projectData} />}


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
    const data = serializeToObject<any[]>(response.data ?? [])?.map(_val => _val?._doc);

    return {
        props: {
            data
        }
    };
};

export default ViewPage;
