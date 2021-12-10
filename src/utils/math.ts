export const median = (array: number[]) => {
  const sorted = array.sort((a, b) => a - b);
  const half = Math.floor(array.length / 2);
  return sorted[half];
};
export const average = (array: number[]) => array.reduce((a, b) => a + b) / array.length;
export const nthTriangle = (n: number) => (Math.pow(n, 2) + n) / 2;
