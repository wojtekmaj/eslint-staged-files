const { exec } = require('child_process');

export default (command, options, verbose) => new Promise((resolve, reject) => {
  if (!command) {
    reject(new Error('command attribute is required.'));
    return;
  }

  const execInstance = exec(command, options);

  const stdout = [];
  const stderr = [];

  execInstance.stdout.on('data', (data) => {
    stdout.push(data);

    if (verbose) {
      // Print whatever exec would like to print
      console.log(data);
    }
  });

  execInstance.stderr.on('data', (data) => {
    stderr.push(data);

    reject(data);
  });

  execInstance.on('close', (code) => {
    resolve({ code, stdout, stderr });
  });
});
