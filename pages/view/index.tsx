/* eslint-disable prettier/prettier */
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import Button from 'components/button';
import Footer from 'components/footer';
import ViewProject from 'components/viewProject';
import { useCallback, useState } from 'react';

const ViewPage = () => {

    const [selectedProject, setSelectedProject] = useState('');
    const [readOnly, setReadOnly] = useState(true);


    const handleReadOnly = useCallback(() => {

        setReadOnly(prevState => !prevState);

    }, []);


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
                        <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
                    </Select>
                </FormControl>
            </div>



            {selectedProject && <>
                <Button className='mt-1' onClick={handleReadOnly}> {readOnly ? 'Edit' : 'Cancel'} </Button>
                <ViewProject readOnly={readOnly} />

            </>}

            <Footer />
        </div>
    );
};

export default ViewPage;
