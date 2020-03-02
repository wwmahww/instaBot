const path = require('../../utils/direction');
const web = require('../../utils/interfaces');
const act = require('../../utils/action');
const comment_post = require('./commnet_post');
const _error = require('../../utils/errorClass');
const catchAsync = require('../../utils/catchAsync');

module.exports = link => {
  return new Promise(
    catchAsync(async (resolve, reject) => {
      console.log('likeAndComment start');

      // Go to the post page
      await path.click(link, 'section  section span', 10000); //  #modify  not always has commnet button
      await web.page.waitFor(2000);

      await act.like();
      await comment_post();
      resolve();
    })
  );
};
