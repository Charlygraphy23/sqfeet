import { Moment } from "moment";

type Props = {
    date: Moment;
    updateDate: (date: Moment) => void
}

const CalenderController = ({ date, updateDate }: Props) => {
    return (
        <div className="calenderController">

            <i className="bi bi-arrow-left-circle" onClick={() => {
                updateDate(date.clone().subtract(1, "month"))
            }}></i>

            <p className="date__label">{date.clone().format(`ddd, Do MMM`)}</p>

            <i className="bi bi-arrow-right-circle" onClick={() => {
                updateDate(date.clone().add(1, "month"))
            }}></i>
        </div>
    )
}

export default CalenderController