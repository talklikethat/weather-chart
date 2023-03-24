import React, { useEffect, useState } from 'react';
import { ItemData } from '../../types';
import MultiAxesChart from './MultiAxesChart';
import { TextLoader } from '../UI/Loaders/Loader';
import './WeatherChartContainer.css';

interface Props {
    data: ItemData[];
    data2: ItemData[];
    temperatureIsSelected?: boolean;
    precipitationIsSelected?: boolean;
}

const WeatherChartContainer: React.FC<Props> = (props: Props) => {
    const {
        data,
        data2,
        temperatureIsSelected = true,
        precipitationIsSelected = true,
    } = props;
    const [loading, setLoading] = useState<boolean>(true);
    const [width, setWidth] = useState<number>(0);
    const [height, setHeight] = useState<number>(0);

    useEffect(() => {
        // reset loading state when data from any of the charts is loaded
        if (data.length || data2.length) setLoading(false);
    }, [data, data2]);

    useEffect(() => {
        const container = document.querySelector('.weather-chart');
        const widthOfContainer = container?.clientWidth || 0;
        const heightOfContainer = container?.clientHeight || 0;
        setWidth(widthOfContainer);
        setHeight(heightOfContainer);
    }, []);

    return (
        <div className={'weather-chart'}>
            {loading ? (
                <TextLoader />
            ) : (
                <MultiAxesChart
                    width={width}
                    height={height}
                    chart={{
                        title: 'Температура',
                        data,
                        isVisible: temperatureIsSelected,
                    }}
                    chart2={{
                        title: 'Осадки',
                        data: data2,
                        isVisible: precipitationIsSelected,
                    }}
                />
            )}
        </div>
    );
};
export default WeatherChartContainer;
