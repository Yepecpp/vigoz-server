import chalk from 'chalk';
import fs from 'fs';
const logDir = fs.existsSync(__dirname + '/../../logs')
  ? __dirname + '/../../logs'
  : undefined;
console.log(logDir ? `Logging to ${logDir}` : 'Logging disabled');
export default class Logger {
  static info(message: any, ip?: string) {
    if (process.env.NODE_ENV !== 'development') return; // Only log in development
    console.log(ChalkFormat({ ip, message, status: chalk.blue('INFO') }));
  }
  static warn(message: any, ip?: string) {
    console.log(ChalkFormat({ ip, message, status: chalk.yellow('WARN') }));
  }
  static error(message: any, ip?: string) {
    console.log(ChalkFormat({ ip, message, status: chalk.red('ERROR') }));
  }
  static success(message: any, ip?: string) {
    console.log(ChalkFormat({ ip, message, status: chalk.green('SUCCESS') }));
  }
  static log(message: any, ip?: string) {
    console.log(ChalkFormat({ ip, message, status: chalk.white('LOG') }));
  }
}
interface ChalkFormat {
  message: any;
  status: string;
  ip?: string;
}
const ChalkFormat = (info: ChalkFormat): String => {
  const date = new Date();
  const line = `[${date.toLocaleString()}]${
    info.ip ? chalk.blue(' -IP: ') + info.ip + '- ' : ''
  } ${info.status} ${info.message}`;
  if (!logDir) return line;
  //create if not exists
  const logLine = `[${date.toLocaleString()}]${
    info.ip ? ' -IP: ' + info.ip + '- ' : ''
  } ${info.message}`;
  const logdate = `${date.getFullYear()}-${date.getMonth() + 1}`;
  if (!fs.existsSync(`${logDir}/${logdate}`)) {
    fs.mkdirSync(`${logDir}/${logdate}`);
  }
  //append to file
  fs.appendFileSync(
    `${logDir}/${logdate}/${date.getDay() + 1}.log`,
    logLine + '\n',
    {
      encoding: 'utf8',
    }
  );
  return line;
};
