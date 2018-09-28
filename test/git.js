const path = require('path');
const fs = require('fs');
const { default: cmd } = require('./cmd');

export const gitCmd = (directoryPath, command, options) => new Promise((resolve, reject) => {
  if (!directoryPath) {
    reject(new Error('path attribute is required.'));
    return;
  }

  fs.access(directoryPath, (error) => {
    if (error) {
      console.error(error);
      reject(error);
      return;
    }

    cmd(command, options)
      .then(resolve)
      .catch(reject);
  });
});

export const init = async directoryPath => (
  gitCmd(directoryPath, `git init ${directoryPath}`)
);

export const stage = async (directoryPath, what) => (
  gitCmd(directoryPath, `git add ${what}`, { cwd: directoryPath })
);

export const stageAll = async directoryPath => stage(directoryPath, '.');

export const stageFiles = async (directoryPath, filePaths = []) => {
  const result = [];

  for (let i = 0; i < filePaths.length; i += 1) {
    const filePath = filePaths[i].replace(path.normalize(`${directoryPath}/`), '');
    // This needs to be done one by one, otherwise Git will complain about lockfile
    // eslint-disable-next-line no-await-in-loop
    result.push(await stage(directoryPath, filePath));
  }

  return result;
};

export const commit = async (directoryPath, commitMessage = 'Commit') => (
  gitCmd(directoryPath, `git commit -m "${commitMessage}"`, { cwd: directoryPath })
);

export const resetHard = async directoryPath => (
  gitCmd(directoryPath, 'git reset --hard', { cwd: directoryPath })
);

export const cleanFd = async directoryPath => (
  gitCmd(directoryPath, 'git clean -fd', { cwd: directoryPath })
);
