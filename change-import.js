const fs = require('fs');
const path = require('path');

function replaceImports(file) {
  const content = fs.readFileSync(file, 'utf8');

  const updatedContent = content.replace(
    /^import\s+(.+)\s+from\s+['"](.+)['"];/gm,
    (_, imports, moduleName) => `const ${imports} = require('${moduleName}');`
  );

  fs.writeFileSync(file, updatedContent);
}

function processDirectory(dir) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);

    if (fs.statSync(filePath).isDirectory()) {
      if (file !== 'node_modules') {
        processDirectory(filePath);
      }
    } else if (path.extname(filePath) === '.js') {
      replaceImports(filePath);
    }
  });
}

// Change './src' to your project's root directory
processDirectory('./src');
