/* eslint-disable react/require-default-props */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-unused-vars */
import AddPageContainer from 'components/addPage';
import Button from 'components/button';
import { AUTH_STATUS } from 'config/app.config';
import { ProjectData } from 'interface';
import EmptyIcon from 'lottie/empty.json';
import moment from 'moment';
import { useSession } from 'next-auth/react';
import Lottie from 'react-lottie';
import ClipLoader from 'react-spinners/ClipLoader';

/* eslint-disable prettier/prettier */

type Props = {
    readOnly: boolean
    id: string,
    handleReadOnly: (id: string) => void
    projectData: ProjectData,
    loading: boolean,
    readOnlyId?: string
}
const ViewProject = ({ readOnly = false, id, handleReadOnly, loading, projectData, readOnlyId = '' }: Props) => {

    const { status } = useSession();

    return (
        <>
            {(loading || status === AUTH_STATUS.LOADING) ?
                <ClipLoader color='#ffffff' loading={loading} cssOverride={{ margin: '20px auto ', display: 'flex' }} size={30} />
                : <div className='mt-2'>
                    {projectData?.batches?.length ?
                        projectData?.batches?.map((batch) =>
                            <div className='edit__data' key={batch._id}>

                                {batch?.tasks?.length ? <p className='dateDivider'>
                                    <i className='bi bi-calendar-check' />
                                    <span>{moment(Number(batch.date) * 1000).format('DD-MM-YYYY')}</span>
                                </p> : ''}

                                {batch?.tasks?.length ? <Button className='mt-1' onClick={() => handleReadOnly(batch?._id)} value={readOnly && (readOnlyId !== batch?._id) ? 'Edit' : !readOnly && (readOnlyId === batch?._id) ? 'Cancel' : 'Edit'} /> : ''}
                                <div className='viewProject__container mt-1'>
                                    <div className='addPage p-0'>
                                        <div className='addPage__container p-0'>

                                            <AddPageContainer readOnly={readOnly} batchId={batch._id} batch={batch} hideDate update projectId={projectData?._id.toString()} readOnlyId={readOnlyId} />
                                        </div>
                                    </div>
                                </div>

                            </div>)
                        : <Lottie options={{
                            loop: true,
                            autoplay: true,
                            animationData: EmptyIcon
                        }} height={300} width={300} />}

                </div>}
        </>
    );
};

export default ViewProject;
