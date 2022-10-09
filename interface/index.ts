/* eslint-disable import/no-cycle */
import { AREAS } from 'config/app.config';
import { Moment } from 'moment';
import mongoose from 'mongoose';

export type Calender = {
  date: Moment;
  isCurrentMonth: boolean;
  isToday: boolean;
  range?: boolean;
  start?: boolean;
  end?: boolean;
  selectedDate?: boolean;
  disabled?: boolean;
};
export type TaskData = {
  _id?: string;
  title: string;
  description: string;
  length?: number;
  width?: number;
  diameter?: number;
  total?: number;
  sq?: number;
  type?: AREAS;
  data?: number;
  [key: string]: any;
};

export type AddDataType = {
  [key: string]: any;
} & TaskData;

export interface Project {
  _id: mongoose.Types.ObjectId;
  name: string;
  createdBy: mongoose.Types.ObjectId;
}

export type Batches = {
  tasks: TaskData[];
  date: string;
  projectId: string;
  rateOfSquareFt: number;
  totalPrice: number;
  totalSquareFt: number;
  _id: string;
};

export interface ProjectData extends Project {
  batches: Batches[];
}
