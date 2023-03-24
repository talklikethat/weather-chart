import './YearPicker.css';

interface YearPickerProps {
    options: string[];
    value: string;
    onChange(value: string): void;
}
function YearPicker(props: YearPickerProps) {
    const { options, value } = props;

    return (
        <select
            value={value}
            className={'year-picker'}
            onChange={(event) => {
                props.onChange(event.currentTarget.value);
            }}
        >
            {options?.length &&
                options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
        </select>
    );
}

export default YearPicker;
