/* eslint-disable prettier/prettier */
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { toast } from 'components/alert';
import Footer from 'components/footer';
import { AUTH_STATUS } from 'config/app.config';
import { Project, ProjectData } from 'interface';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { getSession, useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import useProjects, { getProject } from 'query/useProjects';
import { Suspense, useCallback, useMemo, useState } from 'react';



const PageLoader = dynamic(() => import('components/loader'), { ssr: false, suspense: true });
const ViewProject = dynamic(() => import('components/viewProject'), { ssr: false, suspense: true });



const ViewPage = () => {

    const [selectedProject, setSelectedProject] = useState('');
    const [readOnly, setReadOnly] = useState(true);
    const [readOnlyId, setReadOnlyId] = useState('');
    const { status } = useSession();
    const { isLoading: isDataLoading, data: projectData, isFetched: isDataFetched } = getProject({ status, id: selectedProject });
    const { isLoading, data, isFetched, } = useProjects({ status });
    const listOfProjects = useMemo(() => data?.data?.data as Project[] ?? [], [data]);
    const _projectData = useMemo(() => projectData?.data?.data as ProjectData, [projectData]);



    const handleReadOnly = useCallback((id: string) => {

        if (!id) return toast.warning('Batch Id Missing!!');
        setReadOnly(prevState => !prevState);
        setReadOnlyId(id);
    }, []);



    if (status === AUTH_STATUS.LOADING)
        return <Suspense fallback={<PageLoader bootstrap />}>
            <PageLoader />
        </Suspense>;

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

                        {isLoading && !isFetched && <PageLoader bootstrap />}

                        {!isLoading && isFetched && listOfProjects.length && listOfProjects?.map((val) => <MenuItem key={val?._id.toString()} value={val?._id.toString()}>{val?.name}</MenuItem>)}


                    </Select>
                </FormControl>
            </div>



            <Suspense fallback={<PageLoader bootstrap />}>
                {selectedProject && <ViewProject readOnly={readOnly} id={selectedProject} readOnlyId={readOnlyId} handleReadOnly={handleReadOnly} loading={isDataLoading} projectData={_projectData} isDataFetched={isDataFetched} />}
            </Suspense>

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


    return {
        props: {

        }
    };
};

export default ViewPage;
