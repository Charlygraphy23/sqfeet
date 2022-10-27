/* eslint-disable no-unused-vars */
/* eslint-disable react/require-default-props */
/* eslint-disable prettier/prettier */

import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import TextField from '@mui/material/TextField';



import { CURRENCY } from 'config/app.config';
import { useCallback } from 'react';

type Props = {
    variant?: 'outlined' | 'filled' | 'standard';
    error?: boolean;
    label?: string;
    helperText?: string;
    multiline?: boolean;
    rows?: number;
    select?: boolean;
    currencies?: {
        value: string;
        label: string;
    }[];

    fullWidth?: boolean;
    value?: string | number;
    onChange?: (e: any) => void;
    type?: 'text' | 'number';
    id?: string;
    name?: string;
    className?: string;
    prefix?: string;
    postfix?: string;
    adornments?: boolean;
    size?: 'small' | 'medium';
};

const TextFields = ({
    type = 'text',
    id = '',
    label = '',
    variant = 'outlined',
    fullWidth = false,
    select = false,
    value = '',
    onChange,
    currencies = CURRENCY,
    helperText = '',
    className = '',
    prefix = '',
    postfix = '',
    adornments = false,
    rows = 3,
    multiline = false,
    size,
    name = '',
    error = false
}: Props) => {
    const renderTextPrefix = useCallback(() => {
        if (prefix)
            return <InputAdornment position='start'>{prefix}</InputAdornment>;
        if (postfix)
            return <InputAdornment position='end'>{postfix}</InputAdornment>;

        return <></>;
    }, [prefix, postfix]);

    if (adornments) {
        return (
            <FormControl className={className} fullWidth={fullWidth}>
                <InputLabel htmlFor={id}>{label}</InputLabel>
                <OutlinedInput
                    error={error}
                    name={name}
                    type={type}
                    id={id}
                    value={value}
                    onChange={onChange}
                    startAdornment={renderTextPrefix()}
                    label={label}
                />
            </FormControl>
        );
    }

    if (select) {
        return (
            <TextField
                error={error}
                name={name}
                type={type}
                className={className}
                id={id}
                label={label}
                variant={variant}
                fullWidth={fullWidth}
                select={select}
                value={value}
                onChange={onChange}
                helperText={helperText}
                size={size}
            >
                {currencies.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </TextField>
        );
    }

    if (multiline) {
        return (
            <TextField
                error={error}
                name={name}
                type={type}
                multiline
                rows={rows}
                className={className}
                id={id}
                label={label}
                variant={variant}
                fullWidth={fullWidth}
                value={value}
                onChange={onChange}
                size={size}
                helperText={helperText}
            />
        );
    }

    return (
        <TextField
            error={error}
            name={name}
            type={type}
            className={className}
            id={id}
            label={label}
            variant={variant}
            fullWidth={fullWidth}
            value={value}
            onChange={onChange}
            size={size}
            helperText={helperText}
        />
    );
};

export default TextFields;
