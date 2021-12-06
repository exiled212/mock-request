/* eslint-disable require-jsdoc */
export class Utils {
  static getEnvs(name: string): string {
    return process.env[`REACT_APP_${name}`] as string;
  }
}
