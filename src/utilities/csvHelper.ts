/* eslint-disable import/prefer-default-export */
import fs from 'fs';
import parse from 'csv-parse';

/**
 * @description Converts a CSV file to JSON
 * @param {*} filePath
 * @return {Object} array of rows
 */
const csvFileToJSON = async (filePath: string): Promise<any> => {
  const result = await new Promise((resolve, reject) => {
    const data: any[] = [];
    fs.createReadStream(filePath)
      .pipe(parse())
      .on('data', (csvrow) => {
        data.push(csvrow);
      })
      .on('end', () => {
        resolve(data);
      })
      .on('error', (err) => {
        reject(err);
      });
  });

  return result;
};

export {
  csvFileToJSON,
};
