import AddPageContainer from 'components/addPage';
import Button from 'components/button';
import { ProjectData } from 'interface';
import ClipLoader from 'react-spinners/ClipLoader';
/* eslint-disable prettier/prettier */

type Props = {
    readOnly: boolean
    id: string,
    handleReadOnly: () => void
    projectData: ProjectData,
    loading: boolean
}
const ViewProject = ({ readOnly = false, id, handleReadOnly, loading, projectData }: Props) => (
    <>
        {loading ?
            <ClipLoader color='#ffffff' loading={loading} cssOverride={{ margin: '20px auto ', display: 'flex' }} size={30} />
            : <>
                {projectData?.tasks?.length ? <Button className='mt-1' onClick={handleReadOnly} value={readOnly ? 'Edit' : 'Cancel'} /> : ''}
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

export default ViewProject;
