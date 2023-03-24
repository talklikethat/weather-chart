import { WeatherAPIData, ItemData } from '../types';
import { STORE_NAMES } from '../const';
import { getData } from '../utils';

export async function initDatabase() {
    return new Promise((resolve, reject) => {
        // open database
        const openRequest = indexedDB.open('weatherDatabase', 1);

        openRequest.onerror = function (event) {
            // @ts-ignore
            // https://github.com/microsoft/TypeScript/issues/30669
            reject(event.target.errorCode);
        };

        openRequest.onupgradeneeded = function (event: any) {
            const db = event.target.result;

            // create stores if they don't exist or new version
            STORE_NAMES.forEach((storeName) => {
                db.createObjectStore(storeName, {
                    keyPath: 't',
                });
            });
        };

        openRequest.onsuccess = function (event: any) {
            const db = event.target.result;
            const requests: Promise<void>[] = [];

            STORE_NAMES.forEach((storeName) => {
                // read data from JSON file
                const request = getData(`/data/${storeName}.json`).then(
                    (data) => {
                        const transaction = db.transaction(
                            storeName,
                            'readwrite',
                        );
                        const store = transaction.objectStore(storeName);
                        // add data to store
                        for (let i = 0; i < data.length; i++) {
                            store.add(data[i]);
                        }
                    },
                );

                requests.push(request);
            });

            Promise.all(requests).then(() => {
                resolve(event.target.result);
            });
        };
    });
}

export async function getWeatherData(): Promise<WeatherAPIData[]> {
    const db = await initDatabase();
    const data: WeatherAPIData[] = [];

    for (let i = 0; i < STORE_NAMES.length; i++) {
        const storeName = STORE_NAMES[i];
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.getAll();

        const result: ItemData[] = await new Promise((resolve) => {
            request.onsuccess = (event) => {
                resolve(event.target.result);
            };
        });

        data.push({
            storeName: storeName,
            data: result,
        });
    }

    return data;
}
