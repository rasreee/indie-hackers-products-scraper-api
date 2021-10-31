import { logger } from './logger';
import fs from 'fs';
import path from 'path';

export const saveFixture = (fileName: string, data: any) => {
  fs.writeFile(path.resolve(__dirname, `../../cypress/fixtures/${fileName}`), JSON.stringify(data), (err: any) => {
    if (err) {
      err instanceof Error && logger.error(`Failed to save fixture ${fileName}:`, err);
      throw err;
    }
    logger.info(`✅ Saved fixture ${fileName}`);
  });
};
