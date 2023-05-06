const path = require('path');
const fs = require('fs');
const {stdout} = require('process');

const pathToFile = path.join(__dirname, 'secret-folder');

const stream = fs.createReadStream(pathToFile, 'utf-8');

stream.on('data', text => stdout.write(text));
