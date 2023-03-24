/**
 * Request for data
 * @param url request
 * @returns data
 */
export async function getData<T>(url: string): Promise<T[]> {
    const res = await fetch(url);

    if (res.ok) {
        return await res.json();
    }

    throw new Error();
}

/**
 * Check if number is in range
 * @param number
 * @param min
 * @param max
 */
export const checkNumberInRange = (
    number: number,
    min: number,
    max: number,
) => {
    return number >= min && number <= max;
};

/**
 * Get year from date string
 * @param dateString [YYYY-MM-DD]
 */
export const getYearFromDateString = (dateString: string) => {
    return dateString.slice(0, 4);
};
