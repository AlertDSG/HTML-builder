const path = require('path');
const fs = require('fs');

const reader = (pathForRead) => {
    return new Promise((res, rej) => {       
        let value = '';
        const stream = fs.createReadStream(pathForRead, 'utf-8');
        stream.on('data', (text) => value += text.toString());
        stream.on('end', () => {
            res(value);
        });
        stream.on('error', (err) => {
            rej(err);
        });
    });
};

const builder = (pathFrom, obj) => {
    let count = 0;
    const pathToIndexHtml = path.join(__dirname, 'project-dist', 'index.html');
    const stream = fs.createReadStream(pathFrom, 'utf-8');
    const streamWrite = fs.createWriteStream(pathToIndexHtml);
    return new Promise((res, rej) => {
        let value = '';
        stream.on('data', (text) => value += text);
        stream.on('end', () => {
            let data = value;
            while (count < Object.keys(obj).length) {
                data = data.replace(`{{${Object.keys(obj)[count]}}}`, obj[Object.keys(obj)[count]]);
                count++;
            }
            streamWrite.write(data);
            streamWrite.on('finish', () => {
                res();
            });
            streamWrite.on('error', (error) => {
                rej(error);
            });
        });
    });
};

const joinCss = async () => {
    try {        
        const streamWrite = fs.createWriteStream(path.join(__dirname, 'project-dist', 'style.css'));
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
    } catch (err) {
        throw new Error('Something wrong with css');
    }
};

const joinHtml = async () => {
    try {
       const pathToComponents = path.join(__dirname, 'components');
       const files = await fs.promises.readdir(pathToComponents, {withFileTypes: true});
  
       const obj = {};

       for ( let file of files) {
        const pathToFile = path.join(pathToComponents, file.name);
        const stats = await fs.promises.stat(pathToFile);
        const [name, ext] = file.name.split('.');

        if(stats.isFile() && ext === 'html') {
            const value = await reader(pathToFile);
            obj[name] = value.toString();
        }   
       }     
       await builder(path.join(__dirname, 'template.html'), obj);
    } catch (err) {
        throw new Error('Something wrong with html');
    }
};

const copyFolder = async (copyToPath, copyFromPath) => {

    await fs.promises.mkdir(copyToPath, {recursive: true});

    const files = await fs.promises.readdir(copyFromPath, {withFileTypes: true});

    for (let file of files) {
        if(file.isFile()) {
            fs.promises.copyFile(path.join(copyFromPath, file.name), path.join(copyToPath, file.name))
        } else {
            copyFolder(path.join(copyToPath, file.name), path.join(copyFromPath, file.name))
        }
    }
}

(async () => {
    await fs.promises.rm(path.join(__dirname, 'project-dist'), {recursive: true, force: true});
    await fs.promises.mkdir(path.join(__dirname, 'project-dist'), {recursive: true});
    await copyFolder(path.join(__dirname, 'project-dist', "assets"), path.join(__dirname, 'assets'));
    await joinCss();
    await joinHtml();   
})();