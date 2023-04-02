const fs = require('fs')
const path = require('path')

const changeExtension = (dir) => {
  fs.readdir(dir, { withFileTypes: true }, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err);
      return;
    }

    files.forEach((file) => {
      const fullPath = path.join(dir, file.name);

      if (file.isDirectory()) {
        changeExtension(fullPath);
      } else if (path.extname(file.name) === '.mjs') {
        const newFullPath = path.join(dir, path.basename(file.name, '.mjs') + '.js');
        fs.rename(fullPath, newFullPath, (err) => {
          if (err) {
            console.error('Error renaming file:', err);
          } else {
            console.log(`Renamed ${fullPath} to ${newFullPath}`);
          }
        });
      }
    });
  });
};

const directoryPath = './';
changeExtension(directoryPath);
