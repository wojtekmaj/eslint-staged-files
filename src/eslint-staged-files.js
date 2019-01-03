#!/usr/bin/env node

const { exec } = require('child_process');

exec('git diff --staged --diff-filter=ACMTUXB --name-only', (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  if (stderr) {
    console.error(`git diff error: ${stderr}`);
    return;
  }
  if (!stdout) {
    return;
  }
  // Get the list of staged files
  const files = stdout
    .split('\n')
    .map(path => path.trim())
    .filter(Boolean)
    .filter(path => path.endsWith('.js'));

  // As ESLint by default runs with no color if executed by exec, add --color flag anyway
  const flags = process.argv.slice(2);
  if (!flags.includes('--no-color') && !flags.includes('--color')) {
    flags.push('--color');
  }

  // Run ESLint
  const eslint = exec(`eslint ${flags.join(' ')} ${files.join(' ')}`);

  eslint.stdout.on('data', (data) => {
    // Print whatever ESLint would like to print
    console.log(data);
  });

  eslint.stderr.on('data', (data) => {
    console.error(`eslint error: ${data}`);
  });

  eslint.on('close', (code) => {
    process.exit(code);
  });
});
