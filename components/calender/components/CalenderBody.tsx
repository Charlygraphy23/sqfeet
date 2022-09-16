/* eslint-disable react/no-array-index-key */
/* eslint-disable prettier/prettier */
import classNames from 'classnames';
import { Calender } from 'interface';
import { Moment } from 'moment';
import { memo } from 'react';

type Props = {
    calender: Calender[];
    // eslint-disable-next-line no-unused-vars
    updateDate: (date: Moment, dateClicked?: boolean) => void;
};

const CalenderBody = ({ calender, updateDate }: Props) => {
    const WEEKS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

    return (
        <div className='calender__body'>
            <div className='week__labels mb-1'>
                {WEEKS.map((week, i: number) => (
                    <p key={i}>{week}</p>
                ))}
            </div>

            <div className='dates'>
                <>
                    {calender.map((data, i) => (
                        <div
                            className={classNames('date__block mb-2', {
                                range: !!data?.range,
                                start: !!data?.start,
                                end: !!data?.end
                            })}
                            key={i}
                            onClick={() => updateDate(data.date.clone(), true)}
                        >
                            <span
                                className={classNames('', {
                                    today: data.isToday,
                                    selectedDate: data.selectedDate,
                                    notCurrentMonth: !data.isCurrentMonth,
                                })}
                            >
                                {data.date.get('D')}
                            </span>
                        </div>
                    ))}
                </>
            </div>
        </div>
    );
};

export default memo(CalenderBody);
