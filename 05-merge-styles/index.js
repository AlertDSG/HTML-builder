const path = require('path');
const fs = require('fs');
const {stdout} = require('process');

(async() => {
    try {
        const streamWrite = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'))
        const pathFromCss = path.join(__dirname, 'styles');
        const dataStyles = await fs.promises.readdir(pathFromCss);

        dataStyles.forEach(file => {
          const pathToFile = path.join(pathFromCss, file);
          const streamRead = fs.createReadStream(pathToFile, 'utf-8');
          const ext = path.extname(pathToFile);
          fs.stat((pathToFile), (err, info) => {
              if(!err && !info.isDirectory() && ext === '.css') {
                streamRead.on('data', css => streamWrite.write(css));
              } 
            });
        });
        stdout.write('Succeded');
    } catch (err) {
        throw new Error('Something wrong');
    }
})();