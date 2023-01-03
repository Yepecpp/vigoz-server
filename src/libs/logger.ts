import chalk from 'chalk';
import fs from 'fs';
const logDir = fs.existsSync(__dirname + '/../../logs') ? __dirname + '/../../logs' : undefined;
console.log(logDir ? `Logging to ${logDir}` : 'Logging disabled');
export default class Logger {
  static info(message: any, reqData?: { ip?: string | string[]; url: string }) {
    if (process.env.NODE_ENV !== 'development') return; // Only log in development
    console.log(ChalkFormat({ reqData, message, status: chalk.blue('INFO') }));
  }
  static warn(message: any, reqData?: { ip?: string | string[]; url: string }) {
    console.log(ChalkFormat({ reqData, message, status: chalk.yellow('WARN') }));
  }
  static error(message: any, reqData?: { ip?: string | string[]; url: string }) {
    console.log(ChalkFormat({ reqData, message, status: chalk.red('ERROR') }));
  }
  static success(message: any, reqData?: { ip?: string | string[]; url: string }) {
    console.log(ChalkFormat({ reqData, message, status: chalk.green('SUCCESS') }));
  }
  static log(message: any, reqData?: { ip?: string | string[]; url: string }) {
    console.log(ChalkFormat({ reqData, message, status: chalk.white('LOG') }));
  }
}
interface ChalkFormat {
  message: any;
  status: string;
  reqData?: { ip?: string | string[]; url: string };
}
const ChalkFormat = (info: ChalkFormat): String => {
  const date = new Date();
  if (info.reqData) {
    info.reqData.ip = Array.isArray(info.reqData.ip)
      ? info.reqData.ip[0]?.split(',')[0]
      : info.reqData.ip;
  }
  const line = `[${date.toLocaleString()}]${
    info.reqData?.ip ? chalk.blue(' -IP: ') + info.reqData.ip + '- ' : ''
  } ${info.status} ${info.message} ${info.reqData?.url ? 'on url: ' + info.reqData?.url : ''}`;
  if (!logDir) return line;
  const logLine = `[${date.toLocaleString()}]${
    info.reqData?.ip ? ' -IP: ' + info.reqData.ip + '- ' : ''
  } ${info.message} ${info.reqData?.url ? 'on url: ' + info.reqData?.url : ''}`;
  const logdate = `${date.getFullYear()}-${date.getMonth() + 1}`;
  if (!fs.existsSync(`${logDir}/${logdate}`)) {
    fs.mkdirSync(`${logDir}/${logdate}`);
  }
  //append to file
  fs.appendFile(
    `${logDir}/${logdate}/${date.getDay() + 1}.log`,
    logLine + '\n',
    { encoding: 'utf8' },
    (err) => {
      if (err) {
        console.log('error writing to log file');
        console.log(err);
        process.exit(1);
      }
    },
  );
  return line;
};
