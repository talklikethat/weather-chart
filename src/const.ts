export const STORE_NAMES = ['temperature', 'precipitation'] as const;

// years for pickers before successful fetch data
export const GENERATED_YEARS_ARRAY = (): string[] => {
    const years: string[] = [];
    for (let year = 1881; year <= 2006; year++) {
        years.push(year.toString());
    }
    return years;
};
