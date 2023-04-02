const fs = require('fs-extra');
const glob = require('glob');
const path = require('path');

const targetDir = './'; // Set the target directory to search for files

const importRegex = /import {([^}]+)} from '(.+\.mjs)';/;

function replaceImport(content) {
  return content.replace(importRegex, (match, imports, paty) => {
    return `const {${imports}} = require('${paty.replace(/\.mjs$/, '.js')}');`;
  });
}

function replaceExport(line) {
  const exportRegex = /export default (\w+)/;
  const match = line.match(exportRegex);
  if (match) {
    const variableName = match[1];
    return `module.exports = { ${variableName} }`;
  }
  return line;
}

function updateFile(file) {
  fs.readFile(file, 'utf-8', (err, content) => {
    if (err) {
      console.error(`Error reading file ${file}:`, err);
      return;
    }

    const updatedContent = replaceImport(content);
    const newFile = file.replace(/\.mjs$/, '.js');

    fs.writeFile(newFile, updatedContent, 'utf-8', (err) => {
      if (err) {
        console.error(`Error writing file ${newFile}:`, err);
      } else {
        console.log(`Updated ${file} to ${newFile}`);
      }
    });
  });
}

(async function () {
  const files = await glob('**/*.js', { ignore: 'node_modules/**' });

  files.forEach((file) => {
    const filePath = path.resolve(file);
    updateFile(filePath);
  });
}());