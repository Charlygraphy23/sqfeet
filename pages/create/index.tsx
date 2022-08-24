/* eslint-disable prettier/prettier */

import Button from 'components/button';
import Footer from 'components/footer';
import TextFields from 'components/textField';
import { ChangeEvent, useCallback, useState } from 'react';

const CreateProject = () => {

    const [name, setName] = useState('');


    const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {

        setName(e.target.value);

    }, []);


    return (
        <div className='createProject'>
            <h1 className='page_title mt-3 mb-2'>Create Project</h1>

            <TextFields fullWidth label='Name of the project' className='mb-3' value={name} onChange={handleChange} />

            <Button className='submit__button' value='Submit' />

            <Footer />
        </div>
    );

};

export default CreateProject;
