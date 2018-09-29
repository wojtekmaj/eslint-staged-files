import path from 'path';
import cmd from '../../test/cmd';

import {
  init,
  stageFiles,
  stageAll,
  commit,
  resetHard,
  cleanFd,
} from '../../test/git';

import {
  createDirectory,
  createEslintRc,
  createValidFile,
  createValidFiles,
  createInvalidFile,
  createInvalidFiles,
  removeDirectory,
} from '../../test/utils';

import {
  link,
  unlink,
} from '../../test/yarn';

const verbose = false;

const log = (...args) => {
  if (verbose) {
    console.log(...args);
  }
};

describe('ESLint staged files', () => {
  let directoryPath;
  let currentTestFiles;

  const run = async () => cmd('eslint-staged-files --no-color', { cwd: directoryPath }, verbose);

  beforeAll(async () => {
    try {
      log('Linking eslint-staged-files command...');
      await link();
    } catch (err) {
      console.error('Failed to link eslint-staged-file command');
      throw err;
    }

    log('Creating new directory...');
    directoryPath = await createDirectory();

    log('Initializing Git repository...');
    await init(directoryPath);
    log('Creating .eslintrc.json...');
    await createEslintRc(directoryPath);
    log('Staging all files...');
    await stageAll(directoryPath);
    log('Committing...');
    await commit(directoryPath);
    log('Initialization done.');
  });

  afterEach(async () => {
    await resetHard(directoryPath);
    await cleanFd(directoryPath);
  });

  afterAll(async () => {
    log('Removing directory...');
    await removeDirectory(directoryPath);

    log('Unlinking eslint-staged-files command...');
    await unlink();
  });

  it('should exit with code 0 when no errors are found', async () => {
    currentTestFiles = await createValidFiles(directoryPath, 10);
    await stageAll(directoryPath);

    const { code, stdout, stderr } = await run();

    expect(code).toEqual(0);
    expect(stdout).toHaveLength(0);
    expect(stderr).toHaveLength(0);
  });

  it('should exit with code 1 when there is 1 error in staged files', async () => {
    currentTestFiles = await createInvalidFiles(directoryPath, 1);
    await stageAll(directoryPath);

    const { code, stdout, stderr } = await run();

    expect(code).toEqual(1);
    expect(stdout).toHaveLength(1);
    expect(stdout[0]).toContain('1 error, 0 warnings');
    expect(stderr).toHaveLength(0);
  });

  it('should exit with code 1 when there are 2 errors in staged files', async () => {
    currentTestFiles = await createInvalidFiles(directoryPath, 2);
    await stageAll(directoryPath);

    const { code, stdout, stderr } = await run();

    expect(code).toEqual(1);
    expect(stdout).toHaveLength(1);
    expect(stdout[0]).toContain('2 errors, 0 warnings');
    expect(stderr).toHaveLength(0);
  });

  it('should exit with code 0 when there is 1 error but none in staged files ', async () => {
    currentTestFiles = [
      await createValidFile(path.join(directoryPath, 'file0.js')),
      await createInvalidFile(path.join(directoryPath, 'file1.js')),
    ];
    await stageFiles(directoryPath, currentTestFiles.slice(0, 1));

    const { code, stdout, stderr } = await run();

    expect(code).toEqual(0);
    expect(stdout).toHaveLength(0);
    expect(stderr).toHaveLength(0);
  });

  it('should exit with code 1 when there are 2 errors but just 1 in staged files ', async () => {
    currentTestFiles = await createInvalidFiles(directoryPath, 2);
    await stageFiles(directoryPath, currentTestFiles.slice(0, 1));

    const { code, stdout, stderr } = await run();

    expect(code).toEqual(1);
    expect(stdout).toHaveLength(1);
    expect(stdout[0]).toContain('1 error, 0 warnings');
    expect(stderr).toHaveLength(0);
  });

  it('should not crash with 100 files', async () => {
    currentTestFiles = await createValidFiles(directoryPath, 100);

    await stageAll(directoryPath);

    const { code, stdout, stderr } = await run();

    expect(code).toEqual(0);
    expect(stdout).toHaveLength(0);
    expect(stderr).toHaveLength(0);
  });
});
