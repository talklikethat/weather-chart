import YearPicker from '../YearPicker/YearPicker';
import { YearRange } from '../../../../types';
import { useState } from 'react';
import './YearPickerRange.css';

interface YearPickerRangeProps {
    yearsArray: string[];
    startYearValue: string;
    endYearValue: string;
    onChange(value: string, range: YearRange): void;
}
function YearPickerRange(props: YearPickerRangeProps) {
    const { startYearValue, endYearValue, yearsArray } = props;
    const [error, setError] = useState<string>('');

    const validateYears = (value: string, range: YearRange) => {
        let error: string = '';

        if (range === 'end' && parseInt(value) < parseInt(startYearValue)) {
            error = 'Дата конца не может быть меньше даты начала';
        }

        if (range === 'start' && parseInt(value) > parseInt(endYearValue)) {
            error = 'Дата начала не может быть больше даты конца';
        }
        return error;
    };

    const onChange = (value: string, range: YearRange) => {
        const error = validateYears(value, range);
        setError(error);
        // if (error) setError(error)
        // };
        !error && props.onChange(value, range);
    };

    return (
        <div className={'year-picker-range'}>
            <YearPicker
                onChange={(value) => {
                    onChange(value, 'start');
                }}
                value={startYearValue}
                options={yearsArray}
            />
            <span className={'year-picker-range__separator'}> — </span>
            <YearPicker
                onChange={(value) => {
                    onChange(value, 'end');
                }}
                value={endYearValue}
                options={yearsArray}
            />
            {!!error.length && (
                <span className={'year-picker-range__error'}>{error}</span>
            )}
        </div>
    );
}

export default YearPickerRange;
