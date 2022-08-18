import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material'
import TextFields from 'components/textField'
import { AREAS } from 'config/app.config'
import { AddDataType } from "interface"
import { useCallback } from 'react'

type Props = {
    value: AddDataType,
    index: number
}

const AccordionBody = ({ value, index }: Props) => {


    const renderTextFieldsDependingOnAreas = useCallback(() => {

        if (!value?.type) return "Error"

        switch (value?.type) {

            case AREAS.RECTANGLE: return <>
                <TextFields size='small' className="mb-1" fullWidth label="Width" value={value?.width} />
                <TextFields size='small' className="mb-1" fullWidth label="Length" value={value?.length} />
            </>

            case AREAS.SQUARE: return <>
                <TextFields size='small' className="mb-1" fullWidth label="Side Length" value={value?.length} />
            </>

            case AREAS.CIRCLE: return <>
                <TextFields size='small' className="mb-1" fullWidth label="Diameter" value={value?.diameter} />
            </>

            case AREAS.TRIANGLE: return <>
                <TextFields size='small' className="mb-1" fullWidth label="Base" value={value?.width} />
                <TextFields size='small' className="mb-1" fullWidth label="Length" value={value?.length} />
            </>


            default: return "Error"

        }

    }, [value?.type])

    return (
        <div className="w-100">
            <FormControl fullWidth className="mb-1">
                <InputLabel id="demo-simple-select-helper-label">Areas</InputLabel>
                <Select
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    value={value?.type}
                    label="Age"
                // onChange={e => setSelectedArea(e.target.value)}
                >

                    <MenuItem value={AREAS.SQUARE}>Square</MenuItem>
                    <MenuItem value={AREAS.RECTANGLE}>Rectangle</MenuItem>
                    <MenuItem value={AREAS.CIRCLE}>Circle</MenuItem>
                    <MenuItem value={AREAS.TRIANGLE}>Triangle</MenuItem>
                </Select>
                <FormHelperText>Select Areas</FormHelperText>
            </FormControl>
            <TextFields size='small' className="mb-1" fullWidth label="Description" multiline rows={4} value={value?.description} />

            {renderTextFieldsDependingOnAreas()}

            <p className="mb-1 mt-2">ft<sup>2</sup> : 12.22</p>
            <p className="m-0">Rate (₹) : 12.22</p>
        </div>
    )
}

export default AccordionBody