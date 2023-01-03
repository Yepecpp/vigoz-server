import Logger from '@libs/logger';

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
  let result: parseZ_err[] = [];
  errs.errors.map((err: any) => {
    result.push({
      code: err.code,
      err: {
        expected: err.expected,
        received: err.received,
      },
      where: err.path.join('.'),
      isReq: err.message.includes('required'),
    });
  });
  Logger.info(result);
  return result;
};
export default zoderr;
