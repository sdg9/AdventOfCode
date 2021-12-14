export const mergeAndSum = (mapA: { [key: string]: number }, mapB: { [key: string]: number }) => {
  let retVal = { ...mapA };

  Object.keys(mapB).forEach((i) => {
    // console.log(i);
    if (retVal[i] === undefined) {
      retVal[i] = mapB[i];
    } else {
      retVal[i] += mapB[i];
    }
  });

  return retVal;
};
