import { STORE_NAMES } from './const';

/** one element in data */
export interface ItemData {
    /** time */
    t: string;
    /** value */
    v: number;
}
/** data from one store */
export interface WeatherAPIData {
    storeName: StoreNames;
    data: ItemData[];
}

export type YearRange = 'start' | 'end';

/** generated array of store names */
export type StoreNames = (typeof STORE_NAMES)[number];
