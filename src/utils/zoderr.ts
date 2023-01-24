interface parseZ_err {
  code: string;
  err: {
    expected: string;
    received: string;
  };
  where: string;
  isReq: boolean;
}

const zoderr = (errs: any): parseZ_err[] => {
  const result: parseZ_err[] = [];
  errs.issues.map((err: any) => {
    result.push({
      code: err.code,
      err: {
        expected: err.expected,
        received: err.received,
      },
      where: err.path.join('.'),
      isReq: err.message,
    });
  });
  return result;
};
export default zoderr;
