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
};

const AddDataComponent = ({ data, handleChange }: Props) => (
    <div className='addData'>
        <div className='addPage__container mt-2'>
            <div className='accordion '>
                {data?.map((value, i) => (
                    <Accordion key={i}>
                        <AccordionSummary
                            expandIcon={<ExpandMore />}
                            aria-controls='panel1a-content'
                            id='panel1a-header'
                            className='accordion__header'
                        >
                            <i className='bi bi-x-circle-fill close' />

                            <TextFields
                                name='title'
                                size='small'
                                label='Title'
                                value={value.title}
                                onChange={(e) => handleChange(e, i)}
                            />
                            <p className='accordion__title'>| (₹) {value?.total?.toFixed(2) || '--'}</p>
                        </AccordionSummary>
                        <AccordionDetails>
                            <div className='accordion__body'>
                                <AccordionBody
                                    value={value}
                                    index={i}
                                    handleChange={handleChange}
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
