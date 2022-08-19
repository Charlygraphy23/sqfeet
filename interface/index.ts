import { AREAS } from 'config/app.config';
import { Moment } from "moment";

export type Calender = {
    date: Moment,
    isCurrentMonth: boolean,
    isToday : boolean,
}

export type AddDataType = {
    title : string,
    description : string;
    length?: number;
    width?: number;
    diameter?: number;
    
    total?: number;
    sq?: number;
    type?: AREAS,
    errors?: any
}