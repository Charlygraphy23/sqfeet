import { SelectChangeEvent } from '@mui/material';
import Button from 'components/button';
import Calender from 'components/calender';
import TextFields from 'components/textField';
import { AREAS, calculateArea, calculateTotal } from 'config/app.config';
import { AddDataType } from 'interface';
import moment from 'moment';
import { ChangeEvent, useCallback, useState } from 'react';
import AddDataComponent from './components/AddDataComponent';

const AddPageContainer = () => {
  const [date, setDate] = useState(moment().clone());
  const [data, setData] = useState<AddDataType[]>([
    {
      title: '',
      description: '',
      type: AREAS.RECTANGLE,
    },
  ]);
  const [perSquareFtRate, setPerSquareFtRate] = useState(0);

  const calculateSquareFt = useCallback(
    (_data: AddDataType[], i: number, psft?: number) => {
      let currentVal = { ..._data[i] };

      const _cal = {
        ...currentVal,
        type: currentVal?.type || AREAS.RECTANGLE,
      };

      const area = calculateArea(_cal);
      const total = calculateTotal({
        area: +area,
        perSquareFtRate: psft ?? perSquareFtRate,
      });

      currentVal = {
        ...currentVal,
        sq: +area,
        total,
      };

      // eslint-disable-next-line no-param-reassign
      _data[i] = { ...currentVal };

      return _data;
    },
    [perSquareFtRate]
  );

  const handleChange = useCallback(
    (
      e:
        | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        | SelectChangeEvent<AREAS>,
      i: number
    ) => {
      const _data = Array.from(data);

      _data[i] = {
        ..._data[i],
        [e.target.name]: e.target.value,
      };

      setData(calculateSquareFt(_data, i));
    },
    [calculateSquareFt, data]
  );

  const handleSquareFtRateChange = useCallback(
    (e: any) => {
      const _data = Array.from(data);
      const _perSquareFtRate = e.target.value;
      setPerSquareFtRate(_perSquareFtRate);
      let tempData = [] as AddDataType[];

      _data.forEach((_, i) => {
        tempData = calculateSquareFt(_data, i, _perSquareFtRate);
      });

      setData(tempData);
    },
    [calculateSquareFt, data]
  );

  return (
    <div className='addPage__container'>
      <h1 className='page_title mt-3'>Add Data</h1>

      <div className='calender__chooser'>
        <p>Choose Date :</p>

        <div>
          <Calender setToday={setDate} today={date} />
        </div>
      </div>

      <div className='customTextField mt-1'>
        <TextFields
          type='number'
          fullWidth
          label='Rate per sqft'
          adornments
          prefix='₹'
          value={perSquareFtRate}
          onChange={handleSquareFtRateChange}
        />
      </div>

      <div className='d-flex justify-content-end align-items-center mt-1 mb-2'>
        <Button className='add__button'>
          <i className='bi bi-plus' />
        </Button>
      </div>

      <AddDataComponent data={data} handleChange={handleChange} />
    </div>
  );
};

export default AddPageContainer;
