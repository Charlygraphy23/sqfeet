/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import { Moment } from 'moment';
import { memo } from 'react';

type Props = {
    date: Moment;
    updateDate: (date: Moment) => void;
};

const CalenderController = ({ date, updateDate }: Props) => (
    <div className='calenderController'>
        <i
            className='bi bi-arrow-left-circle'
            onClick={() => {
                updateDate(date.clone().subtract(1, 'month'));
            }}
        />

        <p className='date__label'>{date.clone().format('ddd, Do MMM')}</p>

        <i
            className='bi bi-arrow-right-circle'
            onClick={() => {
                updateDate(date.clone().add(1, 'month'));
            }}
        />
    </div>
);

export default memo(CalenderController);
