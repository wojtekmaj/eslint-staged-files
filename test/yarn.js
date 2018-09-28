const { default: cmd } = require('./cmd');

export const link = async () => cmd('yarn link');

export const unlink = async () => cmd('yarn unlink');
