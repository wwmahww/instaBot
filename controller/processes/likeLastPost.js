const web = require('../../utils/interfaces');
const act = require('../../utils/action');
const path = require('../../utils/direction');
const comment_post = require('./commnet_post');
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
        await path.click(link, 'section  section svg', 10000);
        await web.page.waitFor(2000);
        await act.like();
        await comment_post();
      }
      resolve();
    })
  );
};
