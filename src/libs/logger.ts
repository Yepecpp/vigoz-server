import chalk from 'chalk';
//import fs from "fs";
export default class Logger {
  static info(message: any) {
    if (process.env.NODE_ENV !== 'development') return; // Only log in development
    console.log(ChalkFormat({ message, status: chalk.blue('INFO') }));
  }
  static warn(message: any) {
    console.log(ChalkFormat({ message, status: chalk.yellow('WARN') }));
  }
  static error(message: any) {
    console.log(ChalkFormat({ message, status: chalk.red('ERROR') }));
  }
  static success(message: any) {
    console.log(ChalkFormat({ message, status: chalk.green('SUCCESS') }));
  }
  static log(message: any) {
    console.log(ChalkFormat({ message, status: chalk.white('LOG') }));
  }
}
interface ChalkFormat {
  message: any;
  status: string;
}
const ChalkFormat = (info: ChalkFormat): String => {
  return `-${new Date().toLocaleString()}- ${info.status} ${info.message}`;
};
