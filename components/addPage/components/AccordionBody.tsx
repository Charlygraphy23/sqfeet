/* eslint-disable jsx-a11y/label-has-associated-control */
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
import ViewOnlyFields from './ViewOnlyFields';

type Props = {
    value: AddDataType;
    index: number;
    handleChange: (
        e:
            | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
            | SelectChangeEvent<AREAS>,
        i: number
    ) => void;
    // eslint-disable-next-line react/require-default-props
    readOnly?: boolean
    // eslint-disable-next-line react/require-default-props
    readOnlyId?: string,
    // eslint-disable-next-line react/require-default-props
    batchId?: string,
    // eslint-disable-next-line react/require-default-props
    addPage?: boolean
};

const AccordionBody = ({ value, index: i, handleChange, readOnly = false, readOnlyId = '', batchId = '', addPage = false }: Props) => {
    const renderTextFieldsDependingOnAreas = useCallback(() => {
        if (!value?.type) return 'Error';

        switch (value?.type) {
            case AREAS.RECTANGLE:
                return (
                    <>
                        {addPage || (!readOnly && batchId && (batchId === readOnlyId)) ? <TextFields
                            type='number'
                            name='width'
                            size='small'
                            className='mb-1'
                            fullWidth
                            label='Width in ft'
                            value={value?.width}
                            onChange={(e) => handleChange(e, i)}
                            error={!!value.errors?.width}
                            helperText={value.errors?.width}
                        /> : <ViewOnlyFields label='Width in ft' value={value?.width} />}
                        {addPage || (!readOnly && batchId && (batchId === readOnlyId)) ? <TextFields
                            type='number'
                            size='small'
                            className='mb-1'
                            fullWidth
                            label='Length in ft'
                            value={value?.length}
                            name='length'
                            onChange={(e) => handleChange(e, i)}
                            error={!!value.errors?.length}
                            helperText={value.errors?.length}
                        /> : <ViewOnlyFields label='Length in ft' value={value?.length} />}
                    </>
                );

            case AREAS.SQUARE:
                return (
                    <>
                        {addPage || (!readOnly && batchId && (batchId === readOnlyId)) ? <TextFields
                            type='number'
                            size='small'
                            className='mb-1'
                            fullWidth
                            label='Side Length in ft'
                            value={value?.length}
                            name='length'
                            onChange={(e) => handleChange(e, i)}
                            error={!!value.errors?.length}
                            helperText={value.errors?.length}
                        /> : <ViewOnlyFields label='Side Length in ft' value={value?.length} />}
                    </>
                );

            case AREAS.CIRCLE:
                return (
                    <>
                        {addPage || (!readOnly && batchId && (batchId === readOnlyId)) ? <TextFields
                            type='number'
                            size='small'
                            className='mb-1'
                            fullWidth
                            label='Diameter'
                            value={value?.diameter}
                            name='diameter'
                            onChange={(e) => handleChange(e, i)}
                            error={!!value.errors?.diameter}
                            helperText={value.errors?.diameter}
                        /> : <ViewOnlyFields label='Diameter' value={value?.diameter} />}
                    </>
                );

            case AREAS.TRIANGLE:
                return (
                    <>
                        {addPage || (!readOnly && batchId && (batchId === readOnlyId)) ? <TextFields
                            type='number'
                            size='small'
                            className='mb-1'
                            fullWidth
                            label='Base in ft'
                            value={value?.width}
                            name='width'
                            onChange={(e) => handleChange(e, i)}
                            error={!!value.errors?.width}
                            helperText={value.errors?.width}
                        /> : <ViewOnlyFields label='Base in ft' value={value?.width} />}
                        {addPage || (!readOnly && batchId && (batchId === readOnlyId)) ? <TextFields
                            type='number'
                            size='small'
                            className='mb-1'
                            fullWidth
                            label='Length in ft'
                            value={value?.length}
                            name='length'
                            onChange={(e) => handleChange(e, i)}
                            error={!!value.errors?.length}
                            helperText={value.errors?.length}
                        /> : <ViewOnlyFields label='Length in ft' value={value?.length} />}
                    </>
                );

            default:
                return 'Error';
        }
    }, [value?.type, value?.width, value.errors?.width, value.errors?.length, value.errors?.diameter, value?.length, value?.diameter, readOnly, batchId, readOnlyId, handleChange, i]);

    return (
        <div className='w-100'>
            {!readOnly && (batchId === readOnlyId) ?
                <FormControl fullWidth className='mb-1'>
                    <InputLabel id='demo-simple-select-helper-label'>Areas</InputLabel>
                    <Select
                        labelId='demo-simple-select-helper-label'
                        id='demo-simple-select-helper-label'
                        name='type'
                        value={value?.type}
                        label='Areas'
                        onChange={(e) => handleChange(e, i)}
                    >
                        <MenuItem value={AREAS.SQUARE}>Square</MenuItem>
                        <MenuItem value={AREAS.RECTANGLE}>Rectangle</MenuItem>
                        <MenuItem value={AREAS.CIRCLE}>Circle</MenuItem>
                        <MenuItem value={AREAS.TRIANGLE}>Triangle</MenuItem>
                    </Select>
                    <FormHelperText>Select Areas</FormHelperText>
                </FormControl> : <ViewOnlyFields label='Areas' value={value?.type} />
            }
            {!readOnly && (batchId === readOnlyId) ? <TextFields
                size='small'
                className='mb-1'
                fullWidth
                label='Description'
                multiline
                rows={4}
                value={value?.description}
                name='description'
                onChange={(e) => handleChange(e, i)}

            /> : <ViewOnlyFields label='Description' value={value?.description} />}

            {renderTextFieldsDependingOnAreas()}

            <p className='mb-1 mt-2'>
                ft<sup>2</sup> : {value?.sq ?? '--'}
            </p>
            <p className='m-0'>Rate (₹) : {value?.total?.toFixed(2) ?? '--'}</p>
        </div>
    );
};

export default AccordionBody;
