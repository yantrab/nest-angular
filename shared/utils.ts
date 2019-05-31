import { round, max, min } from 'lodash';

export const pathBySelector = (fun: (a) => {}) =>
    fun
        .toString()
        .split('=>')[1]
        .trim();

export const getDistribution = (data: number[], count?: number): Array<{ x: number; y: number }> => {
    if (!count) {
        count = round(Math.log10(data.length) * 3.32 + 1);
    }
    const step = (max(data) - min(data)) / count;
    const counterArr = data.reduce((arr, b) => {
        const index = Math.floor(b / step);
        if (!arr[index]) {
            arr[index] = { c: 0, a: 0, i: index };
        }
        arr[index].c++;
        arr[index].a += b;
        return arr;
    }, []);
    const result = Object.values(counterArr.filter(c => c)).map(c => {
        return {
            x: round(c.a / c.c, 2),
            y: c.c,
        };
    });
    return [{ x: min(data), y: 0 }].concat(result).concat([{ x: max(data), y: 0 }]);
};
