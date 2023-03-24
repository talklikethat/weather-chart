import './Button.css';
interface ButtonProps {
    text: string;
    onClick(): void;
    fullWidth?: boolean;
}

export const Button = (props: ButtonProps) => {
    const { text, fullWidth, onClick } = props;
    let classNames = 'button';
    if (fullWidth) classNames = `${classNames} button--full-width`;
    return (
        <button className={classNames} onClick={onClick}>
            {text}
        </button>
    );
};
