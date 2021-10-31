import fs from 'fs';
import path from 'path';
import { logger } from './logger';

/**
 * @method isEmpty
 * @param {String | Number | Object} value
 * @returns {Boolean} true & false
 * @description this value is Empty Check
 */
export const isEmpty = (value: string | number | object): boolean => {
  if (value === null) {
    return true;
  } else if (typeof value !== 'number' && value === '') {
    return true;
  } else if (typeof value === 'undefined' || value === undefined) {
    return true;
  } else if (value !== null && typeof value === 'object' && !Object.keys(value).length) {
    return true;
  } else {
    return false;
  }
};

export const isObject = (o: any): o is object => {
  return typeof o === 'object';
};

export const isString = (o: any): o is string => {
  return typeof o === 'string';
};

export const isNumber = (o: any): o is number => {
  return typeof o === 'number';
};

export const mergeMessages = (msgs: string[]) => {
  return msgs.join('\n');
};

export const saveFixture = (fileName: string, data: any) => {
  fs.writeFile(path.join(__dirname, 'fixtures', fileName), JSON.stringify(data), err => {
    if (err) {
      err instanceof Error && logger.error(`Failed to save fixture ${fileName}:`, err);
      throw err;
    }
    logger.info(`✅ Saved fixture ${fileName}`);
  });
};
