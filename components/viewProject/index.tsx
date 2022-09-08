import AddPageContainer from 'components/addPage';
import { ProjectData } from 'interface';
import { useEffect, useState } from 'react';
import { axiosInstance } from '_http';

/* eslint-disable prettier/prettier */

type Props = {
    readOnly: boolean
    id: string
}
const ViewProject = ({ readOnly = false, id }: Props) => {


    const [projectData, setProjectData] = useState<ProjectData>([]);

    useEffect(() => {

        if (!id) return;

        const controller = new AbortController();
        const { signal } = controller;

        axiosInstance.post('/project/get', { projectId: id }, { signal }).then((res) => {

            setProjectData(res?.data?.data);

        }).catch(error => {
            console.log(error);
        });


        return () => {
            controller.abort();
        };

    }, [id]);


    return (
        <div className='viewProject__container mt-1'>
            <div className='addPage p-0'>
                <div className='addPage__container p-0'>

                    <AddPageContainer readOnly={readOnly} id={id} projectData={projectData} />
                </div>
            </div>
        </div>
    );

};

export default ViewProject;
