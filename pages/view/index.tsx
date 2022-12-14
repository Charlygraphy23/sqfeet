/* eslint-disable prettier/prettier */
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { toast } from 'components/alert';
import Footer from 'components/footer';
import PageLoader from 'components/loader';
import Profile from 'components/profile';
import { AUTH_STATUS } from 'config/app.config';
import { Project, ProjectData } from 'interface';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import useProject from 'query/useProject';
import useProjects from 'query/useProjects';
import { useCallback, useState } from 'react';


const ViewProject = dynamic(() => import('components/viewProject'));



const ViewPage = () => {

    const [selectedProject, setSelectedProject] = useState('');
    const [readOnly, setReadOnly] = useState(true);
    const [readOnlyId, setReadOnlyId] = useState('');
    const { status } = useSession();


    const project = useProject({ status, id: selectedProject });
    const allProjects = useProjects({ status });


    const handleReadOnly = useCallback((id: string) => {

        if (!id) return toast.warning('Batch Id Missing!!');
        setReadOnly(prevState => !prevState);
        setReadOnlyId(id);
    }, []);



    if (status === AUTH_STATUS.LOADING)
        return <PageLoader />;

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

                        {allProjects.isLoading && !allProjects.isFetched && <PageLoader bootstrap />}

                        {!allProjects.isLoading && allProjects.isFetched && allProjects?.data?.data?.data.length && allProjects.data?.data?.data?.map((val: Project) => <MenuItem key={val?._id.toString()} value={val?._id.toString()}>{val?.name}</MenuItem>)}


                    </Select>
                </FormControl>
            </div>



            <div>
                <ViewProject readOnly={readOnly} id={selectedProject} readOnlyId={readOnlyId} handleReadOnly={handleReadOnly} loading={project.isLoading} projectData={project.data?.data?.data as ProjectData} isDataFetched={project.isFetched} />
            </div>

            <Footer />
            <Profile />
        </div >
    );
};


export default ViewPage;
