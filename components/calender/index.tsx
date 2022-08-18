import classNames from 'classnames'
import useEventHandler from 'hooks/useEventHandler'
import { Calender } from 'interface'
import moment, { Moment } from 'moment'
import { Dispatch, memo, SetStateAction, useCallback, useLayoutEffect, useState } from "react"
import CalenderBody from './components/CalenderBody'
import CalenderController from './components/CalenderController'

type Props = {
    today: Moment;
    dateRange?: boolean;
    end?: Date;
    setToday: Dispatch<SetStateAction<Moment>>
    setEnd?: () => void
}

const Calender = ({ today, setToday }: Props) => {



    const [calender, setCalender] = useState<Calender[]>([])
    const [show, setShow, ref] = useEventHandler()

    const calculateDays = useCallback(() => {

        const currentDate = moment(today).clone();
        const startDate = currentDate.clone().startOf("month").startOf("week")
        const endDate = currentDate.clone().endOf("month").endOf("week")

        const date = startDate.clone()
        const _calender = []

        while (date.isSameOrBefore(endDate, "day")) {
            _calender.push({ date: date.clone(), isCurrentMonth: date.isSame(currentDate, "month"), isToday: date.isSame(currentDate, "date") })
            date.add(1, "day").clone()

        }
        setCalender(_calender)

    }, [today])

    const updateDate = useCallback((date: Moment) => {
        setToday(date)
    }, [])

    useLayoutEffect(() => {

        const _time = setTimeout(() => {

            calculateDays()
        }, 200);

        return () => clearTimeout(_time)
    }, [today])



    return (
        <section className="calender" ref={ref}>

            <div className="currentDate" onClick={() => setShow(prevState => !prevState)}>
                <p>
                    <i className="bi bi-calendar-event " style={{ marginRight: "4px" }}></i>
                    {today.format("D-MM-YYYY")}
                </p>
            </div>


            <div className={classNames("customCalender", {
                active: show
            })}>

                <CalenderController date={today.clone()} updateDate={updateDate} />

                <CalenderBody calender={calender} updateDate={updateDate} />

            </div>
        </section>
    )
}

export default memo(Calender)