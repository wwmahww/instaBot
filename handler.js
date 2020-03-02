const puppeteer = require('puppeteer');

const web = require('./utils/interfaces');
const follow = require('./controller/processes/followPro');
const unfollow = require('./controller/processes/unfollowProcess');
const likeTagPro = require('./controller/processes/likeTagPro');
const catchAsync = require('./utils/catchAsync');
const act = require('./utils/action');
const path = require('./utils/direction');

const iPhone = puppeteer.devices['Galaxy Note 3'];

exports.initialize = () =>
  new Promise(
    catchAsync(async (resolve, reject) => {
      console.log('lunch started');
      web.browser = await puppeteer.launch({
        headless: false,
        executablePath: './chrome-win/chrome.exe'
      });

      console.log('newpage started');
      // web.page = await web.browser.newPage();
      web.page = await web.browser.pages();
      web.page = web.page[0];
      await web.page.emulate(iPhone);
      await web.page.waitFor(1000);
      console.log('done');
      resolve();
    })
  );

exports.login = (username, password) => {
  return new Promise(
    catchAsync(async (resolve, reject) => {
      await path.goto_page(web.login_URL, '//button[contains(., "Log In")]');
      console.log('auth begine');
      await act.authenticate(username, password);
      resolve();
    })
  );
};

exports.follow = targets =>
  new Promise(
    catchAsync(async (resolve, reject) => {
      let counter = { hasFollowed: 0, round: 0 };
      for (let target of targets) {
        switch (target.search('#')) {
          case 0:
            await follow.followTag(target, counter);
          case -1:
            await follow.followPage(target, counter);
        }
      }
      resolve();
    })
  );

exports.unfollow = () =>
  new Promise(
    catchAsync(async (resolve, reject) => {
      await unfollow();
      resolve();
    })
  );

exports.likeTags = items =>
  new Promise(
    catchAsync(async (resolve, reject) => {
      await likeTagPro(items);
      resolve();
    })
  );

exports.closeBrowser = catchAsync(async () => {
  await web.browser.close();
});
