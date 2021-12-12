export const arrayToSingleNumber = (array: number[]) => Number(array.join(''));

export const tail = (array) => array[array.length - 1];

export const sum = (acc: number, i: number) => acc + i;

export const countItems = (names) => names.reduce((a, b) => ({ ...a, [b]: (a[b] || 0) + 1 }), {});

export const findDuplicates = (dict) => Object.keys(dict).filter((a) => dict[a] > 1);
