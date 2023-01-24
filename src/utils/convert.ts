const Convert = {
  convertToTuple: (arr: string[]): [string, ...string[]] => {
    if (arr === undefined) {
      throw new Error('Array cannot be undefined');
    }
    return [arr[0] as string, ...arr.slice(1)];
  },
};
export default Convert;
