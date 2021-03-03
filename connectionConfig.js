let fileStream = require('fs'),
connectionFilePath = './connection.json';
let connectionInfoObj = JSON.parse(fileStream.readFileSync(connectionFilePath, 'UTF-8'));
exports.storageConfig =  connectionInfoObj;