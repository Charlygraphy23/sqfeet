/* eslint-disable prettier/prettier */
import { SelectChangeEvent } from '@mui/material';
import axios from 'axios';
import Button from 'components/button';
import Calender from 'components/calender';
import TextFields from 'components/textField';
import {
  AREAS,
  calculateArea,
  calculateProjectTotal,
  calculateTotal
} from 'config/app.config';
import { AddDataType } from 'interface';
import moment from 'moment';
import { ChangeEvent, useCallback, useMemo, useState } from 'react';
import validator from 'validator';
import AddDataComponent from './components/AddDataComponent';

type Props = {
  // eslint-disable-next-line react/require-default-props
  readOnly?: boolean;
  id: string
};

const AddPageContainer = ({ readOnly = false, id }: Props) => {
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
  const [data, setData] = useState<AddDataType[]>([]);
  const [perSquareFtRate, setPerSquareFtRate] = useState(0);
  const [perSquareFtRateError, setPerSquareFtRateError] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0.0);
  const [totalSquareFt, setTotalSquareFt] = useState(0.0);

  const calculateTotalOverall = useCallback((_data: AddDataType[]) => {
    const { price = 0, sqft = 0 } = calculateProjectTotal(_data);

    setTotalPrice(price);
    setTotalSquareFt(sqft);
  }, []);

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

      const tempData = calculateSquareFt(_data, i);
      calculateTotalOverall(tempData);
      setData(tempData);
    },
    [calculateSquareFt, calculateTotalOverall, data]
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

      calculateTotalOverall(tempData);
      setData(tempData);
    },
    [calculateSquareFt, calculateTotalOverall, data]
  );

  const handleAdd = useCallback(() => {
    setData((prevState) => [...prevState, initialState]);
  }, [initialState]);

  const handleClose = useCallback((index: number) => {
    setData((prevState) => prevState.filter((_, i) => i !== index));
  }, []);

  const checkValidation = useCallback(() => {
    let flag = false;
    let _data = Array.from(data);

    _data = _data.map((val) => ({ ...val, errors: {} }));

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
    setPerSquareFtRateError(false);
    if (!perSquareFtRate) setPerSquareFtRateError(true);

    const prepareData = data.map((val: any) => {

      if (val?.errors)
        delete val?.errors;

      return val;
    });


    axios.post('/api/project/task/create', {
      date: date.unix(),
      ratePerSqaureFt: perSquareFtRate,
      projectId: id,
      taskList: prepareData
    }).then(() => {
      alert('Demo');
    })
      .catch(err => {
        console.error(err);
      });

    console.log('hasError', hasError);
  }, [checkValidation, data, date, id, perSquareFtRate]);

  return (
    <div className='addPage__container'>
      <div className='calender__chooser'>
        <p>Choose Date :</p>

        <div>
          <Calender setToday={setDate} today={date} readOnly={readOnly} />
        </div>
      </div>

      {!readOnly && (
        <div className='customTextField mt-1'>
          <TextFields
            type='number'
            fullWidth
            label='Rate per sqft'
            adornments
            prefix='₹'
            error={perSquareFtRateError}
            value={perSquareFtRate}
            onChange={handleSquareFtRateChange}
            helperText='Required'
          />
        </div>
      )}

      <table style={{ marginLeft: 'auto' }} className='mt-1'>
        <tbody>
          {readOnly && (
            <tr>
              <td>Rate per sqft (₹) : </td>
              <td>{` ${perSquareFtRate}`}</td>
            </tr>
          )}

          <tr>
            <td>Total (₹) : </td>
            <td>{` ${totalPrice.toFixed(2)}`}</td>
          </tr>

          <tr>
            <td>
              Total ft<sup>2</sup> :
            </td>
            <td>{totalSquareFt}</td>
          </tr>
        </tbody>
      </table>

      <div className='d-flex justify-content-between align-items-center mt-2 mb-1 px-1'>
        {data.length && !readOnly ? (
          <Button
            className='submit__button'
            disabled={!data.length}
            onClick={handleSubmit}
          >
            <i className='bi bi-check-lg' />
          </Button>
        ) : (
          <div />
        )}
        {!readOnly && (
          <Button className='add__button' onClick={handleAdd}>
            <i className='bi bi-plus' />
          </Button>
        )}
      </div>

      <AddDataComponent
        data={data}
        handleChange={handleChange}
        handleClose={handleClose}
        readOnly={readOnly}
      />
    </div>
  );
};

export default AddPageContainer;
