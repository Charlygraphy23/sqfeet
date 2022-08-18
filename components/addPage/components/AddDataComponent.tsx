
import { ExpandMore } from "@mui/icons-material"
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material"
import TextFields from 'components/textField'
import { AddDataType } from 'interface'
import { Dispatch, SetStateAction } from 'react'
import AccordionBody from './AccordionBody'

type Props = {
    data: AddDataType[],
    setData: Dispatch<SetStateAction<AddDataType[]>>

}

const AddDataComponent = ({ data, setData }: Props) => {

    // const handleRemoveItem = useCallback((index: number) => {
    //     const _data = data.filter((val, i) => i !== index);
    //     setData(_data)


    // }, [])
    // const addDataRow = useCallback(() => {
    //     setData(prevState => [...prevState, {} as AddDataType])
    // }, [])




    return (
        <div className="addData">

            <div className="addPage__container mt-2">

                <div className="accordion ">
                    {data?.map((value, i) => <Accordion key={i}>
                        <AccordionSummary
                            expandIcon={<ExpandMore />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                            className="accordion__header"
                        >
                            <i className="bi bi-x-circle-fill close"></i>

                            <TextFields size={"small"} label="Title" value={value.title} />
                            <p className="accordion__title">- {value?.total || "--"}</p>
                        </AccordionSummary>
                        <AccordionDetails>
                            <div className="accordion__body">
                                <AccordionBody value={value} index={i} />
                            </div>
                        </AccordionDetails>
                    </Accordion>)}
                </div>
            </div>



        </div>
    )
}

export default AddDataComponent