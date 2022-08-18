import classNames from "classnames";
import { Calender } from "interface";
import { Moment } from 'moment';
import { memo } from "react";

type Props = {
    calender: Calender[];
    updateDate: (date: Moment) => void
}

const CalenderBody = ({ calender, updateDate }: Props) => {

    const WEEKS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"]

    return (
        <div className="calender__body">
            <div className="week__labels mb-1">
                {WEEKS.map((week, i) => <p key={i}>{week}</p>)}
            </div>


            <div className="dates">
                {calender.map((data, i) => <div className="date__block mb-2" key={i} onClick={() => updateDate(data.date.clone())}>

                    <span className={classNames("", {
                        today: data.isToday,
                        notCurrentMonth: !data.isCurrentMonth
                    })}>{data.date.get("D")}</span>

                </div>)}
            </div>

        </div>
    )
}

export default memo(CalenderBody)