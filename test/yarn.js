const { default: cmd } = require('./cmd');

export const link = () => cmd('yarn link');

export const unlink = () => cmd('yarn unlink');
