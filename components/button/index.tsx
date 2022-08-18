import { BarLoader } from 'react-spinners';

type Props = {
    type?: "button" | "submit" | "reset" | undefined;
    value?: string;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    children?: JSX.Element | string;
    className?: string,
    style?: React.CSSProperties;
    loading?: boolean,
    loaderColor?: string
}

const Button = ({
    type = "button",
    value = "",
    onClick,
    children,
    style,
    className = "",
    loading = false,
    loaderColor = "black"

}: Props) => {
    return (
        <div className={`button ${className}`} style={style}>
            <BarLoader color={loaderColor} loading={loading} className="button__loader" />
            <button disabled={loading} type={type} onClick={onClick}>{children ?? value}</button>
        </div>
    )
}

export default Button