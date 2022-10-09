/* eslint-disable react/require-default-props */
/* eslint-disable no-unused-vars */
import { Box, TextField } from '@mui/material';
import { DateRange, LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { MobileDateRangePicker } from '@mui/x-date-pickers-pro/MobileDateRangePicker';
import { ChartData, ScatterDataPoint } from 'chart.js';
import 'chartjs-adapter-moment';
import { Dayjs } from 'dayjs';
import { useMemo } from 'react';
import { Line } from 'react-chartjs-2';

type Props = {
  date: DateRange<Dayjs>;
  handleDateChange: (date: DateRange<Dayjs>) => void;
  data: ChartData<'line', (number | ScatterDataPoint | null)[], unknown>;
};

const GraphBody = ({ date, handleDateChange, data }: Props) => {
  const options: any = useMemo(
    () => ({
      responsive: true,
      layout: {
        autoPadding: true,
      },

      plugins: {
        legend: {
          display: false,
        },
      },
      elements: {
        line: {
          tension: 0.4,
        },
      },
      scales: {
        x: {
          beginAtZero: false,
          grid: {
            display: false,
          },
          ticks: {
            color: 'white',
          },
          type: 'timeseries',
          time: {
            unit: 'day',
          },
        },

        y: {
          beginAtZero: true,
          grid: {
            display: false,
          },
          ticks: {
            color: 'white',
          },
        },
      },
    }),
    []
  );

  return (
    <>
      <div
        className='choose__date d-flex justify-content-between my-1'
        style={{ alignItems: 'center' }}
      >
        <div className='mr-5 outer__label'>{data.datasets[0].label}</div>
        <LocalizationProvider
          dateAdapter={AdapterDayjs}
          localeText={{ start: 'Mobile start', end: 'Mobile end' }}
        >
          <MobileDateRangePicker
            value={date}
            onChange={(newValue) => {
              handleDateChange(newValue);
            }}
            renderInput={(startProps, endProps) => (
              <>
                <TextField {...startProps} />
                <Box sx={{ mx: 2 }}> to </Box>
                <TextField {...endProps} />
              </>
            )}
          />
        </LocalizationProvider>
      </div>
      <Line data={data} options={options} />
    </>
  );
};

export default GraphBody;
