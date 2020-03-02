const likeAndComment = require('./likeAndCommentPro');
const web = require('../../utils/interfaces');
const catchAsync = require('../../utils/catchAsync');

module.exports = () => {
  return new Promise(
    catchAsync(async (resolve, reject) => {
      let private = await web.page.evaluate(() => {
        return window._sharedData.entry_data.ProfilePage[0].graphql.user
          .is_private;
      });
      if (!private) {
        let link = await web.page.$('article div a');
        await likeAndComment(link);
      }
      resolve();
    })
  );
};
