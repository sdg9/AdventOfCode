export function curry(f: Function) {
  // curry(f) does the currying transform
  return function (a: any) {
    return function (b: any) {
      return f(a, b);
    };
  };
}
