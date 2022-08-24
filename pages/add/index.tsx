/* eslint-disable prettier/prettier */
import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent
} from '@mui/material';
import Button from 'components/button';
import Footer from 'components/footer';
import { useRouter } from 'next/router';
import { useCallback } from 'react';

/* eslint-disable prettier/prettier */
const AddProject = () => {

    const router = useRouter();

    const handleNavigate = useCallback(() => {
        router.push('/create');

    }, [router]);

    const handleProjectChange = useCallback((e: SelectChangeEvent) => {

        router.push(`/add/${e.target.value}`);

    }, [router]);


    return (
        <div className='addProject'>
            <h1 className='page_title mt-3 mb-2'>Select Project</h1>

            <div className='d-flex justify-content-end align-items-center mb-1'>
                <Button className='create__project' onClick={handleNavigate}>Create Project</Button>
            </div>

            <div>
                <FormControl fullWidth >
                    <InputLabel id='demo-simple-select-helper-label'>Select Project</InputLabel>
                    <Select
                        labelId='demo-simple-select-helper-label'
                        id='demo-simple-select-helper'
                        // value={age}
                        label='Select Project'
                        onChange={handleProjectChange}
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

            <Footer />
        </div>
    );
};

export default AddProject;
