import AddPageContainer from 'components/addPage';

/* eslint-disable prettier/prettier */

type Props = {
    readOnly: boolean
}
const ViewProject = ({ readOnly = false }: Props) => (
    <div className='viewProject__container mt-1'>
        <div className='addPage p-0'>
            <div className='addPage__container p-0'>

                <AddPageContainer readOnly={readOnly} />
            </div>
        </div>
    </div>
);

export default ViewProject;
