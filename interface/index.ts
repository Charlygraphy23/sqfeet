import { AREAS } from 'config/app.config';
import { Moment } from 'moment';
import mongoose from 'mongoose';

export type Calender = {
  date: Moment;
  isCurrentMonth: boolean;
  isToday: boolean;
};
export type TaskData = {
  title: string;
  description: string;
  length?: number;
  width?: number;
  diameter?: number;
  total?: number;
  sq?: number;
  type?: AREAS;
  [key: string]: any;
};

export type AddDataType = {
  [key: string]: any;
} & TaskData;

export interface Project {
  _id: mongoose.Types.ObjectId;
  name: string;
  createdBy: mongoose.Types.ObjectId;
  rateOfSquareFt: number;
  totalPrice: number;
  totalSquareFt: number;
}
