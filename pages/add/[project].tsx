/* eslint-disable prettier/prettier */
import AddPageContainer from 'components/addPage';
import Footer from 'components/footer';
import { useRouter } from 'next/router';

const AddPage = () => {

    const router = useRouter();
    const { project } = router.query;

    return (
        <div className='addPage'>
            <h1 className='page_title mt-3'>Add Data</h1>


            <AddPageContainer id={project} />

            <Footer />
        </div>
    );
};

export default AddPage;
