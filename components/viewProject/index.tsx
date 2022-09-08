import AddPageContainer from 'components/addPage';
import Button from 'components/button';
import { ProjectData } from 'interface';
import { useEffect, useState } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import { axiosInstance } from '_http';
/* eslint-disable prettier/prettier */

type Props = {
    readOnly: boolean
    id: string,
    handleReadOnly: () => void
}
const ViewProject = ({ readOnly = false, id, handleReadOnly }: Props) => {


    const [projectData, setProjectData] = useState<ProjectData>({} as ProjectData);
    const [loading, setLoading] = useState(false);

    useEffect(() => {

        if (!id) return;

        const controller = new AbortController();
        const { signal } = controller;

        setLoading(true);
        axiosInstance.post('/project/get', { projectId: id }, { signal }).then((res) => {

            setProjectData(res?.data?.data);
            setLoading(false);
        }).catch(error => {
            console.log(error);
            setLoading(false);
        });


        return () => {
            setLoading(false);
            controller.abort();
        };

    }, [id]);


    return (
        <>
            {loading ?
                <ClipLoader color='#ffffff' loading={loading} cssOverride={{ margin: '20px auto ', display: 'flex' }} size={30} />
                : <>
                    <Button className='mt-1' onClick={handleReadOnly} value={readOnly ? 'Edit' : 'Cancel'} />
                    <div className='viewProject__container mt-1'>
                        <div className='addPage p-0'>
                            <div className='addPage__container p-0'>

                                <AddPageContainer readOnly={readOnly} id={id} projectData={projectData} hideDate update />
                            </div>
                        </div>
                    </div>

                </>}
        </>
    );

};

export default ViewProject;
