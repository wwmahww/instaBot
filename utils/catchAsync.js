const util = require('util');
const web = require('./interfaces');
const handler = require('../handler');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});
const question = util.promisify(readline.question).bind(readline);
const rlon = util.promisify(readline.on).bind(readline);

module.exports = fn => {
  return (...args) => {
    fn(...args).catch(async err => {
      if (err) console.log('Error💥:', err);
      await question(`choose 0 to exit and 1 to continue:\n`).catch(
        async reply => {
          switch (reply) {
            case '0':
              web.browser.close();
              readline.close();
              break;
            case '1':
              await handler.follow('car');
              readline.close();
              break;
          }
        }
      );
    });
  };
};
