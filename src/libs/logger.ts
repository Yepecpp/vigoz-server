import chalk from 'chalk';
import fs from 'fs';
import fsAsync from 'fs/promises';
import path from 'path';
const logDir = fs.existsSync(path.join(__dirname, '/../../logs')) ? path.join(__dirname, '/../../logs') : undefined;
console.log(logDir ? `Logging to ${logDir}` : 'Logging disabled');
export default class Logger {
  static async info(message: any, reqData?: { ip?: string | string[]; url: string }) {
    if (process.env.NODE_ENV !== 'development') return; // Only log in development
    console.log(await ChalkFormat({ reqData, message, status: chalk.blue('INFO') }));
  }
  static async warn(message: any, reqData?: { ip?: string | string[]; url: string }) {
    console.log(await ChalkFormat({ reqData, message, status: chalk.yellow('WARN') }));
  }
  static async error(message: any, reqData?: { ip?: string | string[]; url: string }) {
    console.log(await ChalkFormat({ reqData, message, status: chalk.red('ERROR') }));
  }
  static async success(message: any, reqData?: { ip?: string | string[]; url: string }) {
    console.log(await ChalkFormat({ reqData, message, status: chalk.green('SUCCESS') }));
  }
  static async log(message: any, reqData?: { ip?: string | string[]; url: string }) {
    console.log(await ChalkFormat({ reqData, message, status: chalk.white('LOG') }));
  }
}
interface ChalkFormat {
  message: any;
  status: string;
  reqData?: { ip?: string | string[]; url: string };
}
const ChalkFormat = async (info: ChalkFormat): Promise<String> => {
  const date = new Date();
  if (info.reqData) {
    info.reqData.ip = Array.isArray(info.reqData.ip) ? info.reqData.ip[0]?.split(',')[0] : info.reqData.ip;
  }
  const line = `[${date.toLocaleString()}]${info.reqData?.ip ? chalk.blue(' -IP: ') + info.reqData.ip + '- ' : ''} ${info.status} ${info.message} ${
    info.reqData?.url ? 'on url: ' + info.reqData?.url : ''
  }`;
  if (!logDir) return line;
  const logLine = `[${date.toLocaleString()}]${info.reqData?.ip ? ' -IP: ' + info.reqData.ip + '- ' : ''} ${info.message} ${
    info.reqData?.url ? 'on url: ' + info.reqData?.url : ''
  }`;
  const logdate = `${date.getFullYear()}-${date.getMonth() + 1}`;
  if (!fs.existsSync(`${logDir}/${logdate}`)) {
    await fsAsync.mkdir(`${logDir}/${logdate}`);
  }
  //append to file
  await fsAsync.appendFile(`${logDir}/${logdate}/${date.getDate()}.log`, logLine + '\n', { encoding: 'utf8' });

  return line;
};
