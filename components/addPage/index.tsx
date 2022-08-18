import Calender from 'components/calender'
import TextFields from 'components/textField'
import { calculateArea, calculateSquareFt } from 'config/app.config'
import { AddDataType } from 'interface'
import moment from 'moment'
import { ChangeEvent, useCallback, useState } from 'react'
import AddDataComponent from './components/AddDataComponent'

const AddPageContainer = () => {

  const [date, setDate] = useState(moment().clone())
  const [data, setData] = useState<AddDataType[]>([])
  const [perSquareFtRate, setPerSquareFtRate] = useState(0)


  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, i: number) => {


    let _data = Array.from(data);

    const _cal = {
      type: _data[i]?.type || "",
      width: _data[i]?.width ?? 0,
      length: _data[i]?.length ?? 0,
      diameter: _data[i]?.diameter ?? 0
    }

    const area = calculateArea(_cal)
    const sqaureFt = calculateSquareFt({ area, perSquareFtRate })

    _data[i] = {
      ..._data[i],
      sq: area,
      [e.target.id]: e.target.value
    }


    setData(_data)


  }, [data, perSquareFtRate])

  return (
    <div className="addPage__container">

      <h1 className="page_title mt-3">Add Data</h1>

      <div className="calender__chooser">
        <p>Choose Date :</p>


        <div><Calender setToday={setDate} today={date} /></div>
      </div>


      <div className="customTextField mt-1">
        <TextFields fullWidth label="Rate per sqft" adornments prefix='₹' value={perSquareFtRate} onChange={e => setPerSquareFtRate(e.target.value)} />
      </div>

      <AddDataComponent data={data} setData={setData} />

    </div>
  )
}

export default AddPageContainer