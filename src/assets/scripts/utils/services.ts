export function getRandomRange(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function delayCallback(ms: number, callback?: () => void) {
  return new Promise((res) => {
    setTimeout(() => {
      callback && callback();
      res(null);
    }, ms);
  });
}
