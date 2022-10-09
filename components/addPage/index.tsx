/* eslint-disable react/require-default-props */
/* eslint-disable no-param-reassign */
/* eslint-disable prettier/prettier */
import { SelectChangeEvent } from '@mui/material';
import { toast } from 'components/alert';
import Button from 'components/button';
import TextFields from 'components/textField';
import {
  AREAS,
  calculateArea,
  calculateProjectTotal,
  calculateTotal
} from 'config/app.config';
import { AddDataType, Batches } from 'interface';
import EmptyIcon from 'lottie/empty.json';
import moment from 'moment';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { ChangeEvent, memo, useCallback, useEffect, useMemo, useState } from 'react';
import Lottie from 'react-lottie';
import { ClockLoader, DotLoader } from 'react-spinners';
import validator from 'validator';
import { axiosInstance } from '_http';
import AddDataComponent from './components/AddDataComponent';

type Props = {
  // eslint-disable-next-line react/require-default-props
  readOnly?: boolean;
  batchId?: string,
  batch?: Batches,
  hideDate?: boolean,
  update?: boolean,
  projectId: string,
  readOnlyId?: string
  addPage?: boolean
};


const Calender = dynamic(
  () => import('../calender' /* webpackChunkName: "calender" */),
  { ssr: false }
);


const AddPageContainer = ({ readOnly = false, batchId = '', batch, hideDate = false, update = false, projectId = '', readOnlyId = '', addPage = false }: Props) => {
  const [date, setDate] = useState(moment().clone());
  const router = useRouter();
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
  const [deletedTaskIds, setDeletedTaskIds] = useState<string[]>([]);
  const [taskDates, setTaskDates] = useState<Set<string>>(new Set());
  const [taskDateLoading, setTaskDateLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

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

    const _data = Array.from(data);

    const filteredData = _data.filter((_, i) => i !== index);

    const updatedData = filteredData.map((val) => {
      let currentVal = val;

      const _cal = {
        ...currentVal,
        type: currentVal?.type || AREAS.RECTANGLE,
      };

      const area = calculateArea(_cal);
      const total = calculateTotal({
        area: +area,
        perSquareFtRate,
      });
      currentVal = {
        ...currentVal,
        sq: +area,
        total,
      };

      return currentVal;

    });

    calculateTotalOverall(updatedData);
    setData(updatedData);

    if (!update) return;
    const taskId = data[index]?._id;
    if (!taskId) return;
    setDeletedTaskIds(prevState => [...prevState, taskId]);


  }, [calculateTotalOverall, data, perSquareFtRate, update]);

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

    if (hasError) return;
    if (!perSquareFtRate) setPerSquareFtRateError(true);

    const prepareData = data.map((val: any) => {

      if (val?.errors)
        delete val?.errors;

      return val;
    });

    setSubmitLoading(true);
    axiosInstance.post('/project/task/create', {
      date: date.unix(),
      ratePerSqaureFt: perSquareFtRate,
      projectId,
      taskList: prepareData
    }).then(() => {
      toast.success('Added SuccessFully 😀');
      setTimeout(() => router.push(`/view/${projectId}`), 1000);
    })
      .catch(err => {
        toast.error(err?.message);
        setSubmitLoading(false);
      });

  }, [checkValidation, data, date, perSquareFtRate, projectId, router]);

  const handleUpdate = useCallback(() => {
    const hasError = checkValidation();
    setPerSquareFtRateError(false);


    if (hasError) return;
    if (!batchId) return toast.error('Missing batchId !!');
    if (!perSquareFtRate) setPerSquareFtRateError(true);

    const prepareData = data.map((val: any) => {

      if (val?.errors)
        delete val?.errors;

      val.batchId = batchId;
      return val;
    });
    setSubmitLoading(true);

    axiosInstance.post('/project/update', {
      ratePerSqaureFt: perSquareFtRate,
      batchId,
      taskList: prepareData,
      deletedTaskIds
    }).then(() => {

      toast.success('Project Updated!!');

      setTimeout(() => router.push(`/view/${projectId}`), 1000);


    })
      .catch(err => {
        toast.error(err?.message);
        setSubmitLoading(false);

      });

  }, [checkValidation, data, deletedTaskIds, batchId, perSquareFtRate, projectId, router]);

  const getAllBatches = useCallback(async (signal: AbortSignal) => {
    setTaskDateLoading(true);
    axiosInstance
      .post('/project/getBatchByDate', { projectId }, { signal })
      .then(({ data: _data }: { data: any }) => {
        const dates = _data?.data?.map((_v: any) => _v?.date ?? '') ?? [];
        const dateSets = new Set<string>(dates);

        let _today = moment().clone();
        while (dateSets.has(_today.format('YYYY-MM-DD'))) {
          _today = _today.add(1, 'day').clone();
        }

        setTaskDates(dateSets);
        setDate(_today);
        setTaskDateLoading(false);
      })
      .catch((error) => {
        if (error.response) {
          toast.error(error?.message);
          setTaskDateLoading(false);

        }

      });


  }, [projectId]);

  useEffect(() => {
    if (!batchId || !batch) return;


    setData(batch?.tasks);
    setPerSquareFtRate(batch?.rateOfSquareFt);
    setTotalPrice(batch?.totalPrice);
    setTotalSquareFt(batch?.totalSquareFt);
  }, [batchId, batch]);


  useEffect(() => {
    setTaskDateLoading(true);
    if (batchId) return;

    const abortController = new AbortController();
    const { signal } = abortController;


    getAllBatches(signal);


    return () => {
      abortController.abort();
    };
  }, [batchId, getAllBatches]);

  return (
    <div className='addPage__container'>
      {submitLoading && <div className='submitLoading'>
        <DotLoader color='white' size={20} />

      </div>}
      {!hideDate && <div className='calender__chooser'>
        <p>Choose Date :</p>

        <div>

          {taskDateLoading
            ? <ClockLoader color='white' size={25} />
            : <Calender setToday={setDate} today={date} readOnly={readOnly} taskDates={taskDates} />}
        </div>
      </div>}

      {(!readOnly && addPage) || (!readOnly && readOnlyId === batchId)
        ? (
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
        ) : ''}

      {!data?.length && update ? <Lottie options={{
        loop: true,
        autoplay: true,
        animationData: EmptyIcon
      }} height={300} width={300} />
        : <table style={{ marginLeft: 'auto' }} className='mt-1'>
          <tbody>
            {(!readOnly && readOnlyId !== batchId) || readOnly
              ? (
                <tr>
                  <td>Rate per sqft (₹) : </td>
                  <td>{` ${perSquareFtRate}`}</td>
                </tr>
              ) : ''}

            <tr>
              <td>Total (₹) : </td>
              <td>{` ${totalPrice?.toFixed(2)}`}</td>
            </tr>

            <tr>
              <td>
                Total ft<sup>2</sup> :
              </td>
              <td>{totalSquareFt.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>}

      <div className='d-flex justify-content-end align-items-center mt-2 mb-1 px-1'>
        {(addPage && data.length) || (data?.length && !readOnly && batchId && (batchId === readOnlyId))
          ? (
            <Button
              className='submit__button mr-1'
              disabled={!data.length}
              onClick={update ? handleUpdate : handleSubmit}
            >
              <i className='bi bi-check-lg' />
            </Button>
          ) : (
            <div />
          )}
        {addPage || (!readOnly && batchId && (batchId === readOnlyId))
          ? (
            <Button className='add__button' onClick={handleAdd}>
              <i className='bi bi-plus' />
            </Button>
          ) : ''}
      </div>

      <AddDataComponent
        data={data}
        handleChange={handleChange}
        handleClose={handleClose}
        readOnly={readOnly}
        batchId={batchId}
        readOnlyId={readOnlyId}
        addPage={addPage}
      />

    </div>
  );
};

export default memo(AddPageContainer);
