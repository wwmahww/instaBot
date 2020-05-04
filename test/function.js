exports.awFunction = () =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('2 second passed');
      resolve();
    }, 2000);
  });

exports.pFunction = Promise.resolve(async () => {
  for (let i = 0; i < 4; i++) {
    // eslint-disable-next-line no-await-in-loop
    await this.awFunction();
  }
});
