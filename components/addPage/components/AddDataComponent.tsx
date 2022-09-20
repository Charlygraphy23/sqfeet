/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import { ExpandMore } from '@mui/icons-material';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    SelectChangeEvent
} from '@mui/material';
import TextFields from 'components/textField';
import { AREAS } from 'config/app.config';
import { AddDataType } from 'interface';
import { ChangeEvent } from 'react';
import AccordionBody from './AccordionBody';

type Props = {
    data: AddDataType[];
    handleChange: (
        e:
            | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
            | SelectChangeEvent<AREAS>,
        i: number
    ) => void;
    handleClose: (index: number) => void
    // eslint-disable-next-line react/require-default-props
    readOnly?: boolean,
    // eslint-disable-next-line react/require-default-props
    batchId?: string,
    // eslint-disable-next-line react/require-default-props
    readOnlyId?: string
};

const AddDataComponent = ({ data, handleChange, handleClose, readOnly = false, batchId = '', readOnlyId = '' }: Props) => (
    <div className='addData'>
        <div className='addPage__container mt-1'>
            <div className='accordion '>
                {data?.map((value, i) => (
                    <Accordion key={i} className='mb-1'>
                        <AccordionSummary
                            expandIcon={<ExpandMore />}
                            aria-controls='panel1a-content'
                            id='panel1a-header'
                            className='accordion__header'
                        >
                            {!readOnly && batchId && (batchId === readOnlyId) && <i className='bi bi-x-circle-fill close' onClick={() => handleClose(i)} />}

                            {readOnly && batchId && (batchId !== readOnlyId) ?
                                <p className='accordion__title'> {value.title || '--'}</p>

                                : !readOnly && (batchId === readOnlyId) ? <TextFields
                                    name='title'
                                    size='small'
                                    label='Title'
                                    value={value.title}
                                    onChange={(e) => handleChange(e, i)}
                                    error={!!value.errors?.title}
                                    helperText={value.errors?.title}
                                /> : <p className='accordion__title'> {value.title || '--'}</p>}

                            <p className='accordion__title'>| (₹) {value?.total?.toFixed(2) || '--'}</p>
                        </AccordionSummary>
                        <AccordionDetails>
                            <div className='accordion__body'>
                                <AccordionBody
                                    value={value}
                                    index={i}
                                    handleChange={handleChange}
                                    readOnly={readOnly}
                                    batchId={batchId}
                                    readOnlyId={readOnlyId}
                                />
                            </div>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </div>
        </div>
    </div>
);

export default AddDataComponent;
