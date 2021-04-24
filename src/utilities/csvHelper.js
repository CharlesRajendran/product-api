const fs = require('fs');
const parse = require('csv-parse');

/**
 * @description Converts a CSV file to JSON
 * @param {*} filePath
 * @return {Object} array of rows
 */
module.exports.csvFileToJSON = async (filePath) => {
  const result = await new Promise((resolve, reject) => {
    const data = [];
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
