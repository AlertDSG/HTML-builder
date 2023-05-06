const path = require('path');
const fs = require('fs');
const {stdout, stdin, exit} = require('process');

const pathToFile = path.join(__dirname, 'text.txt');
const stream = fs.createWriteStream(pathToFile);

stdout.write('Hi my friend. You can write something..."When you will want to stop write exit or touch ctrl + c"\n');

stdin.on('data', message => {
    if(message.toString().trim() === 'exit') {
        exit();
    } else {
        stream.write(message);
    }  
});

process.on('exit', () => {
        stdout.write('See you next time...\n');   
});

process.on('SIGINT', exit);