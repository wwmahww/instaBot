const path = require('../../utils/direction');
const web = require('../../utils/interfaces');
const _error = require('../../utils/errorClass');
const catchAsync = require('../../utils/catchAsync');

module.exports = (pageLink, notFollowBusiness, notFollowPrivate) => {
  return new Promise(
    catchAsync(async (resolve, reject) => {
      console.log('subFollow is started.');

      let isBusiness;
      let isPrivate;
      let hasPost;

      let shouldFollow = true;

      console.log('subFollow');
      await pageLink.click(); // go to the page
      await web.page.waitFor(3000);
      await path.click('', '//button[contains(.,"Follow")]');
      await web.page.waitFor(1000);
      console.log('reload');

      isBusiness = await web.page.evaluate(() => {
        return window._sharedData.entry_data.ProfilePage[0].graphql.user
          .is_business_account;
      });
      isPrivate = await web.page.evaluate(() => {
        return window._sharedData.entry_data.ProfilePage[0].graphql.user
          .is_private;
      });

      hasPost = await web.page.$('li span span');
      hasPost = await web.page.evaluate(
        element => element.textContent,
        hasPost
      );

      if (notFollowBusiness & isBusiness) shouldFollow = false;
      if (notFollowPrivate & isPrivate) shouldFollow = false;
      if (hasPost === '0') shouldFollow = false;

      // shouldFollow = notFollowBusiness & !isPrivate?true:false

      if (shouldFollow) {
        let button = await web.page.$x('//button[contains(.,"Follow")]');
        await button[0].click();
        web.page.waitFor('//button[contains(.,"Follow")]');
      }

      console.log('is page followd: ', shouldFollow);
      await web.page.waitFor(2000);
      resolve(shouldFollow);
    })
  );
};
