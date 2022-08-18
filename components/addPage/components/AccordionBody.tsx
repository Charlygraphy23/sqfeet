/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */

import {
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent
} from '@mui/material';
import TextFields from 'components/textField';
import { AREAS } from 'config/app.config';
import { AddDataType } from 'interface';
import { ChangeEvent, useCallback } from 'react';

type Props = {
    value: AddDataType;
    index: number;
    handleChange: (
        e:
            | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
            | SelectChangeEvent<AREAS>,
        i: number
    ) => void;
};

const AccordionBody = ({ value, index: i, handleChange }: Props) => {
    const renderTextFieldsDependingOnAreas = useCallback(() => {
        if (!value?.type) return 'Error';

        switch (value?.type) {
            case AREAS.RECTANGLE:
                return (
                    <>
                        <TextFields
                            type='number'
                            name='width'
                            size='small'
                            className='mb-1'
                            fullWidth
                            label='Width in ft'
                            value={value?.width}
                            onChange={(e) => handleChange(e, i)}
                        />
                        <TextFields
                            type='number'
                            size='small'
                            className='mb-1'
                            fullWidth
                            label='Length in ft'
                            value={value?.length}
                            name='length'
                            onChange={(e) => handleChange(e, i)}
                        />
                    </>
                );

            case AREAS.SQUARE:
                return (
                    <TextFields
                        type='number'
                        size='small'
                        className='mb-1'
                        fullWidth
                        label='Side Length in ft'
                        value={value?.length}
                        name='length'
                        onChange={(e) => handleChange(e, i)}
                    />
                );

            case AREAS.CIRCLE:
                return (
                    <TextFields
                        type='number'
                        size='small'
                        className='mb-1'
                        fullWidth
                        label='Diameter'
                        value={value?.diameter}
                        name='diameter'
                        onChange={(e) => handleChange(e, i)}
                    />
                );

            case AREAS.TRIANGLE:
                return (
                    <>
                        <TextFields
                            type='number'
                            size='small'
                            className='mb-1'
                            fullWidth
                            label='Base in ft'
                            value={value?.width}
                            name='width'
                            onChange={(e) => handleChange(e, i)}
                        />
                        <TextFields
                            type='number'
                            size='small'
                            className='mb-1'
                            fullWidth
                            label='Length in ft'
                            value={value?.length}
                            name='length'
                            onChange={(e) => handleChange(e, i)}
                        />
                    </>
                );

            default:
                return 'Error';
        }
    }, [value?.type, value?.width, value?.length, value?.diameter, handleChange, i]);

    return (
        <div className='w-100'>
            <FormControl fullWidth className='mb-1'>
                <InputLabel id='demo-simple-select-helper-label'>Areas</InputLabel>
                <Select
                    labelId='demo-simple-select-helper-label'
                    id='demo-simple-select-helper-label'
                    name='type'
                    value={value?.type}
                    label='Age'
                    onChange={(e) => handleChange(e, i)}
                >
                    <MenuItem value={AREAS.SQUARE}>Square</MenuItem>
                    <MenuItem value={AREAS.RECTANGLE}>Rectangle</MenuItem>
                    <MenuItem value={AREAS.CIRCLE}>Circle</MenuItem>
                    <MenuItem value={AREAS.TRIANGLE}>Triangle</MenuItem>
                </Select>
                <FormHelperText>Select Areas</FormHelperText>
            </FormControl>
            <TextFields
                size='small'
                className='mb-1'
                fullWidth
                label='Description'
                multiline
                rows={4}
                value={value?.description}
                name='description'
                onChange={(e) => handleChange(e, i)}
            />

            {renderTextFieldsDependingOnAreas()}

            <p className='mb-1 mt-2'>
                ft<sup>2</sup> : {value?.sq ?? '--'}
            </p>
            <p className='m-0'>Rate (₹) : {value?.total?.toFixed(2) ?? '--'}</p>
        </div>
    );
};

export default AccordionBody;
