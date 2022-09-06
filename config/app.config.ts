/* eslint-disable import/no-cycle */
/* eslint-disable no-shadow */

import { AddDataType, TaskData } from 'interface';

/* eslint-disable no-unused-vars */
export const CURRENCY = [
  {
    value: 'IND',
    label: '₹',
  },
];

export enum AUTH_STATUS {
  SUCCESS = 'authenticated',
  ERROR = 'unauthenticated',
  LOADING = 'loading',
}

// eslint-disable-next-line no-shadow
export enum AREAS {
  SQUARE = 'square',
  RECTANGLE = 'rectangle',
  CIRCLE = 'circle',
  TRIANGLE = 'triangle',
}

type CalculateArea = {
  width?: number;
  length?: number;
  diameter?: number;
  type: AREAS;
};

export const calculateArea = (data: CalculateArea) => {
  const { type, width = 0, length = 0, diameter = 0 } = data;

  switch (type) {
    case AREAS.RECTANGLE:
      return width * length;

    case AREAS.SQUARE:
      return length * length;
    case AREAS.CIRCLE:
      return Math.PI * diameter * diameter;

    case AREAS.TRIANGLE:
      return (0.5 * width * length).toFixed(2);

    default:
      return 0;
  }
};

export const calculateTotal = ({
  area = 0,
  perSquareFtRate = 0,
}: {
  area: number;
  perSquareFtRate: number;
}) => area * perSquareFtRate;

export const isAuthenticated = (status: AUTH_STATUS) =>
  [AUTH_STATUS.SUCCESS].includes(status) && status !== AUTH_STATUS.LOADING;

export const calculateProjectTotal = (data: AddDataType[] | TaskData[]) =>
  data.reduce(
    // @ts-expect-error
    (prevState: any, currState: any) => {
      if (currState.sq || currState.total) {
        return {
          price: prevState.price + (currState.total || 0),
          sqft: prevState.sqft + (currState.sq || 0),
        };
      }

      return { price: prevState?.price, sqft: prevState?.sqft };
    },
    { price: 0, sqft: 0 }
  );
