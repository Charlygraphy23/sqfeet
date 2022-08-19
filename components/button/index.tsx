/* eslint-disable react/button-has-type */
/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable no-unused-vars */
/* eslint-disable react/require-default-props */
/* eslint-disable prettier/prettier */
import { BarLoader } from 'react-spinners';

type Props = {
    type?: 'button' | 'submit' | 'reset' | undefined;
    value?: string;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    children?: JSX.Element | string;
    className?: string;
    style?: React.CSSProperties;
    loading?: boolean;
    loaderColor?: string;
    disabled?: boolean
};

const Button = ({
    type = 'button',
    value = '',
    onClick,
    children,
    style,
    className = '',
    loading = false,
    loaderColor = 'black',
    disabled = false
}: Props) => (
    <div className={`button ${className}`} style={style}>
        <BarLoader
            color={loaderColor}
            loading={loading}
            className='button__loader'
        />
        <button disabled={loading || disabled} type={type} onClick={onClick}>
            {children ?? value}
        </button>
    </div>
);

export default Button;
