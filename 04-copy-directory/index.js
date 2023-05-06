const path = require('path');
const fs = require('fs');
const {stdout} = require('process');


(async () => {
    try {
      const pathToFolder = path.join(__dirname, 'files-copy');
      await fs.promises.mkdir(pathToFolder, { recursive: true });
      stdout.write('Succeded');
    } catch (error) {
      throw new Error('Folder exist');
    }
  })()
  .then(() => fs.promises.readdir(path.join(__dirname, 'files')))
  .then(files => {
    files.forEach(file => {
        const pathToFile = path.join(__dirname, 'files', file);
        const pathToCopyFile = path.join(__dirname, 'files-copy', file);
        fs.promises.copyFile(pathToFile, pathToCopyFile);
    });
  });