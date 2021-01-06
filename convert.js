const csvToJson = require('convert-csv-to-json');
 
const input = './vancouvercrime.csv'; 
const output = './public/vancouvercrime.json';
 
csvToJson.fieldDelimiter(',').formatValueByType().generateJsonFileFromCsv(input, output);