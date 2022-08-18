import { FormControl, InputAdornment, InputLabel, InputProps, MenuItem, OutlinedInput, TextField } from "@mui/material"
import { CURRENCY } from 'config/app.config'
import { useCallback } from "react"


type Props = {
    variant?: "outlined" | "filled" | "standard",
    error?: boolean,
    label?: string,
    defaultValue?: string,
    helperText?: string
    multiline?: boolean
    rows?: number
    maxRows?: number
    select?: boolean,
    currencies?: {
        value: string,
        label: string
    }[],
    InputProps?: InputProps,
    fullWidth?: boolean
    value?: string | number,
    onChange?: (e: any) => void
    type?: "text" | "number",
    id?: string,
    className?: string,
    prefix?: string,
    postfix?: string
    adornments?: boolean
    size?: "small" | "medium"
}


const TextFields = ({ type = "text", id = "", label = "", variant = "outlined", fullWidth = false,
    select = false, value = "", onChange, currencies = CURRENCY, helperText = "", className = "", prefix = "", postfix = "", adornments = false, rows = 3, multiline = false, size }: Props) => {

    const renderTextPrefix = useCallback(() => {

        if (prefix) return <InputAdornment position="start">{prefix}</InputAdornment>
        if (postfix) return <InputAdornment position="end">{postfix}</InputAdornment>

        return <></>
    }, [prefix, postfix])


    if (adornments) {
        return <FormControl className={className} fullWidth={fullWidth} >
            <InputLabel htmlFor={id}>{label}</InputLabel>
            <OutlinedInput
                type={type}
                id={id}
                value={value}
                onChange={onChange}
                startAdornment={renderTextPrefix()}
                label={label}
            />
        </FormControl>
    }

    if (select) {
        return <TextField type={type} className={className} id={id} label={label} variant={variant} fullWidth={fullWidth} select={select} value={value} onChange={onChange} helperText={helperText} size={size}>
            {currencies.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                    {option.label}
                </MenuItem>
            ))}
        </TextField>
    }

    if (multiline) {
        return <TextField
            type={type}
            multiline
            rows={rows}
            className={className} id={id} label={label} variant={variant} fullWidth={fullWidth} value={value} onChange={onChange}
            size={size}
        />
    }

    return <TextField type={type} className={className} id={id} label={label} variant={variant} fullWidth={fullWidth} value={value} onChange={onChange} size={size} />

}

export default TextFields