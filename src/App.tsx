import { useState, useEffect } from 'react';

import Header from './Components/Header/Header';
import Sidebar from './Components/Sidebar/Sidebar';
import YearPickerRange from './Components/UI/Pickers/YearPickerRange/YearPickerRange';
import WeatherChartContainer from './Components/Chart/WeatherChartContainer';

import { getYearFromDateString, checkNumberInRange } from './utils';
import type { WeatherAPIData, ItemData, YearRange } from './types';
import { GENERATED_YEARS_ARRAY } from './const';

import { getWeatherData } from './database/database';

function App() {
    const [temperatureIsSelected, setTemperatureIsSelected] =
        useState<boolean>(true);
    const [precipitationIsSelected, setPrecipitationIsSelected] =
        useState<boolean>(true);
    const [temperature, setTemperature] = useState<ItemData[]>([]);
    const [precipitation, setPrecipitation] = useState<ItemData[]>([]);
    const [selectedStartYear, setSelectedStartYear] = useState<string>('');
    const [selectedEndYear, setSelectedEndYear] = useState<string>('');
    const [uniqueYearsArray, setUniqueYearsArray] = useState<string[]>(
        GENERATED_YEARS_ARRAY,
    );

    // mount
    useEffect(() => {
        // wait for all data to be fetched
        getWeatherData()
            .then((data) => {
                setData(data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    const setData = (storesArray: WeatherAPIData[]) => {
        const temperatureStoreData = storesArray.find(
            (item) => item.storeName === 'temperature',
        );
        const precipitationStoreData = storesArray.find(
            (item) => item.storeName === 'precipitation',
        );

        if (!!temperatureStoreData?.data.length) {
            setTemperature(temperatureStoreData.data);

            // create unique years array
            const uniqueYears = [
                ...new Set(
                    temperatureStoreData.data.map((item: any) =>
                        getYearFromDateString(item.t),
                    ),
                ),
            ];

            // set initial states for pickers
            setSelectedStartYear(uniqueYears[0]);
            setSelectedEndYear(uniqueYears[uniqueYears.length - 1]);
            setUniqueYearsArray(uniqueYears);
        }
        if (!!precipitationStoreData?.data.length) {
            setPrecipitation(precipitationStoreData.data);
        }
    };

    const handleChangeDataState = (id: string, value: boolean) => {
        if (id === 'temperature') setTemperatureIsSelected(value);
        if (id === 'precipitation') setPrecipitationIsSelected(value);
    };

    const handleChangeYear = (value: string, range: YearRange) => {
        if (range === 'start') setSelectedStartYear(value);
        if (range === 'end') setSelectedEndYear(value);
    };

    const filteredTemperatureItems = temperature.filter((item) => {
        const year = parseInt(getYearFromDateString(item.t));
        return checkNumberInRange(
            year,
            parseInt(selectedStartYear),
            parseInt(selectedEndYear),
        );
    });

    const filteredPrecipitationItems = precipitation.filter((item) => {
        const year = parseInt(getYearFromDateString(item.t));
        return checkNumberInRange(
            year,
            parseInt(selectedStartYear),
            parseInt(selectedEndYear),
        );
    });

    return (
        <main className={'weather-archive'}>
            <Header />
            <div className={'weather-archive__content'}>
                <Sidebar
                    precipitationIsSelected={precipitationIsSelected}
                    temperatureIsSelected={temperatureIsSelected}
                    onClick={(id, value) => {
                        handleChangeDataState(id, value);
                    }}
                />
                <div className={'weather-archive__visual'}>
                    <YearPickerRange
                        onChange={(value, range) => {
                            handleChangeYear(value, range);
                        }}
                        startYearValue={selectedStartYear}
                        endYearValue={selectedEndYear}
                        yearsArray={uniqueYearsArray}
                    />
                    <WeatherChartContainer
                        temperatureIsSelected={temperatureIsSelected}
                        precipitationIsSelected={precipitationIsSelected}
                        data={filteredTemperatureItems}
                        data2={filteredPrecipitationItems}
                    />
                </div>
            </div>
        </main>
    );
}

export default App;
