import { SelectChangeEvent } from '@mui/material';
import Button from 'components/button';
import Calender from 'components/calender';
import TextFields from 'components/textField';
import { AREAS, calculateArea, calculateTotal } from 'config/app.config';
import { AddDataType } from 'interface';
import moment from 'moment';
import { ChangeEvent, useCallback, useMemo, useState } from 'react';
import validator from 'validator';
import AddDataComponent from './components/AddDataComponent';

const AddPageContainer = () => {
  const [date, setDate] = useState(moment().clone());
  const initialState = useMemo(
    () => ({
      title: '',
      description: '',
      type: AREAS.RECTANGLE,
      length: '' as any,
      width: '' as any,
      diameter: '' as any,
      errors: {},
    }),
    []
  );
  const [data, setData] = useState<AddDataType[]>([initialState]);
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

      if (e.target.name === 'type') {
        _data[i] = {
          ..._data[i],
          errors: {},
        };
      }

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

  const handleAdd = useCallback(() => {
    setData((prevState) => [...prevState, initialState]);
  }, [initialState]);

  const handleClose = useCallback((index: number) => {
    setData((prevState) => prevState.filter((_, i) => i !== index));
  }, []);

  const checkValidation = useCallback(() => {
    let flag = false;

    // ? Reset all Previous Errors
    setData(data.map((_val) => ({ ..._val, errors: {} })));

    const _data = Array.from(data);

    // ? Find if any other error happens and set them to Data
    setData(
      _data.map((value) => {
        const _value: AddDataType = { ...value };

        Object.keys(_value).forEach((key) => {
          if (!['errors', 'description', 'type'].includes(key)) {
            if (
              [AREAS.RECTANGLE, AREAS.TRIANGLE].includes(
                _value?.type ?? AREAS.RECTANGLE
              ) &&
              !['diameter'].includes(key) &&
              validator.isEmpty(_value[key].toString())
            ) {
              flag = true;
              _value.errors = {
                ..._value.errors,
                [key]: 'Required',
              };
            } else if (
              [AREAS.SQUARE].includes(_value?.type ?? AREAS.RECTANGLE) &&
              !['diameter', 'width'].includes(key) &&
              validator.isEmpty(_value[key].toString())
            ) {
              flag = true;
              _value.errors = {
                ..._value.errors,
                [key]: 'Required',
              };
            } else if (
              [AREAS.CIRCLE].includes(_value?.type ?? AREAS.RECTANGLE) &&
              !['width', 'length'].includes(key) &&
              validator.isEmpty(_value[key].toString())
            ) {
              flag = true;
              _value.errors = {
                ..._value.errors,
                [key]: 'Required',
              };
            }
          }
        });

        return _value;
      })
    );

    return flag;
  }, [data]);

  const handleSubmit = useCallback(() => {
    const hasError = checkValidation();

    console.log('hasError', hasError);
  }, [checkValidation]);

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

      <div className='d-flex justify-content-between align-items-center mt-2 mb-1 px-1'>
        <Button
          className='submit__button'
          disabled={!data.length}
          onClick={handleSubmit}
        >
          <i className='bi bi-check-lg' />
        </Button>
        <Button className='add__button' onClick={handleAdd}>
          <i className='bi bi-plus' />
        </Button>
      </div>

      <AddDataComponent
        data={data}
        handleChange={handleChange}
        handleClose={handleClose}
      />
    </div>
  );
};

export default AddPageContainer;
