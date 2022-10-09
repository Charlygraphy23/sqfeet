/* eslint-disable prettier/prettier */
import classNames from 'classnames';
import useEventHandler from 'hooks/useEventHandler';
import { Calender as CalenderInterface } from 'interface';
import { Moment } from 'moment';
import {
    Dispatch,
    memo,
    SetStateAction,
    useCallback,
    useLayoutEffect,
    useState
} from 'react';
import CalenderBody from './components/CalenderBody';
import CalenderController from './components/CalenderController';

type Props = {
    today: Moment;
    setToday: Dispatch<SetStateAction<Moment>>;
    // eslint-disable-next-line react/require-default-props
    readOnly?: boolean;
    taskDates: Set<string>
};

const Calender = ({ today, setToday, readOnly = false, taskDates }: Props) => {
    const [calender, setCalender] = useState<CalenderInterface[]>([]);
    const [show, setShow, ref] = useEventHandler();

    const calculateDays = useCallback(() => {

        const currentDate = today.clone();
        const startDate = currentDate.clone().startOf('month').startOf('week');
        const endDate = currentDate.clone().endOf('month').endOf('week');

        const date = startDate.clone();
        const _calender = [];

        while (date.isSameOrBefore(endDate, 'day')) {
            _calender.push({
                date: date.clone(),
                isCurrentMonth: date.isSame(currentDate, 'month'),
                isToday: date.isSame(currentDate, 'date'),
                disabled: taskDates.has(date.format('YYYY-MM-DD'))
            });
            date.add(1, 'day').clone();
        }
        setCalender(_calender);
    }, [taskDates, today]);

    const updateDate = useCallback(
        (date: Moment) => {
            setToday(date);
        },
        [setToday]
    );

    useLayoutEffect(() => {
        const _time = setTimeout(() => {
            calculateDays();
        }, 200);

        return () => clearTimeout(_time);
    }, [calculateDays, today]);

    return (
        <section className='calender' ref={ref}>
            <div
                className='currentDate'
                onClick={() => {
                    if (readOnly) return;
                    setShow((prevState) => !prevState);
                }}
            >
                <p>
                    <i className='bi bi-calendar-event ' style={{ marginRight: '4px' }} />
                    {today.format('D-MM-YYYY')}
                </p>
            </div>

            <div
                className={classNames('customCalender', {
                    active: show,
                })}
            >
                <CalenderController date={today.clone()} updateDate={updateDate} />

                <CalenderBody calender={calender} updateDate={updateDate} />
            </div>
        </section>
    );
};

export default memo(Calender);
