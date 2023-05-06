const path = require('path');
const fs = require('fs');
const {stdout} = require('process');

const pathToFile = path.join(__dirname, 'secret-folder');

fs.readdir(pathToFile,  (err, data) => {
    if (err) throw new Error('Is Empty');
    data.forEach(file => {
        fs.stat(path.join(pathToFile, file), (err, info) => {
            if(!err && !info.isDirectory()) {
                const [name, ext] = file.split('.');
                const size = info.size/1000  + "kb"
            stdout.write(`${name} - ${ext} - ${size}\n`);
            }           
        });
    });  
});