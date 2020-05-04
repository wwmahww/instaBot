const { fork } = require('child_process');

const delay = require('./delay');

module.exports = async num => {
  const child = fork('./test/function.js');

  child.send(num);
  const { pid } = child;
  console.log('pid: ', pid);
  await delay(5000);
  process.kill(pid);

  child.on('error', err => {
    console.log('error: ', err);
  });

  child.on('exit', () => {
    console.log('cp exited');
  });

  child.on('message', data => {
    console.log('received data: ', data);
  });
};
