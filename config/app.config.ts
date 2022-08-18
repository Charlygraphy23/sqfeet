export const CURRENCY = [
    {
      value: 'IND',
      label: '₹',
    }
  ];
  

export enum AREAS{
  SQUARE = "square",
  RECTANGLE = "rectangle",
  CIRCLE = "circle",
  TRIANGLE = "triangle", 
}

type CalculateArea = {
  width?: number,
  length?: number,
  diameter?: number,
  type: AREAS | string
}

export const calculateArea = (data : CalculateArea) : number => {

  const {type , width = 0 , length = 0 , diameter = 0 } = data

  switch(type){

    case AREAS.RECTANGLE: return width * length

    case AREAS.SQUARE: return length * length
    case AREAS.CIRCLE: return Math.PI * diameter * diameter

    case AREAS.TRIANGLE: (0.5 * width * length).toFixed(2)

    default : return 0
  }

}

export const calculateSquareFt = ({area = 0, perSquareFtRate} : {area : number , perSquareFtRate : number}) => {
  return area * perSquareFtRate
}