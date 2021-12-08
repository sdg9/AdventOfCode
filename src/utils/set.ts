export const intersection = (a: string, b: string) => [...new Set(a)].filter((x) => b.includes(x)).join('');
export const difference = (a: string, b: string) => [...a].filter((x) => !b.includes(x)).join('');
// const union = (a, b) => [...new Set([...a, ...b])].join('');
export const union = (...args: string[]) => {
  const combinedArgs = args.reduce((a, b) => a + b);
  return [...new Set(combinedArgs)].join('');
};
