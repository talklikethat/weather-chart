import './Checkbox.css';
interface Props {
    id: string;
    label: string;
    isSelected: boolean;
    onClick(id: string, value: boolean): void;
    fullWidth?: boolean;
}
export const Checkbox = (props: Props) => {
    const { id, label, isSelected, fullWidth } = props;
    let classNames = 'checkbox';
    if (fullWidth) classNames = `${classNames} checkbox--full-width`;
    return (
        <div className={classNames}>
            <input
                type="checkbox"
                id={id}
                checked={isSelected}
                onChange={() => {
                    props.onClick(id, !isSelected);
                }}
            />
            <label htmlFor={id}>{label}</label>
        </div>
    );
};
