const path = require('path');
const fs = require('fs');
const { default: cmd } = require('./cmd');

export const createDirectory = async (directoryPath = path.join('.', '.tmp')) => new Promise((resolve, reject) => {
  fs.mkdir(directoryPath, (error) => {
    if (error) {
      console.error(error);
      reject(error);
      return;
    }

    resolve(directoryPath);
  });
});

export const removeDirectory = async directoryPath => cmd(`rimraf ${directoryPath}`);

export const createFile = (filePath, contents) => new Promise((resolve, reject) => {
  fs.writeFile(filePath, contents, (error) => {
    if (error) {
      console.error(error);
      reject(error);
      return;
    }

    resolve(filePath);
  });
});

export const createFiles = (directoryPath, len = 10, fn) => {
  const promises = [];

  for (let i = 0; i < len; i += 1) {
    promises.push(
      fn(path.join(directoryPath, `file${i}.js`)),
    );
  }

  return Promise.all(promises);
};

export const createEslintRc = (directoryPath) => {
  const contents = `{
  "rules": {
    "eol-last": "off",
    "quotes": ["error", "single"]
  }
}`;

  return createFile(path.join(directoryPath, '.eslintrc.json'), contents);
};

export const createValidFile = (filePath) => {
  const contents = '\'hello\';';

  return createFile(filePath, contents);
};

export const createValidFiles = (directoryPath, len = 10) => (
  createFiles(directoryPath, len, createValidFile)
);

export const createInvalidFile = (filePath) => {
  const contents = '"hello";';

  return createFile(filePath, contents);
};

export const createInvalidFiles = (directoryPath, len = 10) => (
  createFiles(directoryPath, len, createInvalidFile)
);
