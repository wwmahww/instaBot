const path = require('../../utils/direction');
const web = require('../../utils/interfaces');
const act = require('../../utils/action');
const _error = require('../../utils/errorClass');
const catchAsync = require('../../utils/catchAsync');

module.exports = () => {
  return new Promise(
    catchAsync(async (resolve, reject) => {
      console.log('commentPost started');

      let link = await web.page.$('svg[aria-label="Comment"]');
      if (link) {
        console.log('inside of comment');
        // Add commnet
        await path.click('svg[aria-label="Comment"]', 'textarea');
        await web.page.waitFor(1000);
        //      write the comment
        await act.comment();
      }
      console.log('done');
      resolve();
    })
  );
};
