const path = require('../../utils/direction');
const web = require('../../utils/interfaces');
const act = require('../../utils/action');
const methods = require('../../utils/methods');
const followLoop = require('./followLoopPro');
const _error = require('../../utils/errorClass');
const catchAsync = require('../../utils/catchAsync');

exports.followTag = (tag, counter) =>
  new Promise(
    catchAsync(async (resolve, reject) => {
      console.log('follow tag');
      let login = false;
      await act.loginCheck().then(res => (login = res));
      console.log('login: ', login);
      console.log('success');
      // Go to tag page
      await path.goto_page(
        web.TAG_URL(tag.substring(1)),
        'article > div:nth-child(1) img[decoding="auto"]'
      );
      for (let i = 0; i <= 6; i++) {
        let posts = await web.page.$$(
          'article > div:nth-child(1) img[decoding="auto"]'
        ); // Get all postS.
        let post = posts[i];

        // Click on the post
        await web.page.waitFor(2000);
        await path.click(
          post,
          'header > div:nth-child(2) a:nth-child(1)',
          5000
        );

        await web.page.waitFor(1000);

        // Check if page was already used
        title = web.page.$('header > div:nth-child(2) a:nth-child(1)');
        title = web.page.evaluate(title => title.textContent, title);

        used = methods.check(title, web.used_pages);
        if (!used) break;
        // If used.
        await web.page.click('span[aria-label="Back"]');
        await web.page.waitFor(1000);
        break;
      }
      await act.loadPage('header > div:nth-child(2) a:nth-child(1)');

      await web.page.waitFor(2000);
      let permission = false;
      while (!permission) {
        console.log('click on follower button');
        await path
          .click(
            '//a[contains(., "followers")]',
            'main > div:first-child[contians(.,"Followers")]',
            10000,
            'load'
          )
          .then(res => {
            permission = res;
            console.log('res: ', res);
          });

        if (!permission) {
          await web.page.reload({ waitUntil: 'load' });
          continue;
        }
        await web.page.waitFor(3000);
      }
      console.log('it is loaded');
      resolve(await followLoop(counter, web.page.url()));
    })
  );

exports.followPage = (page, counter) =>
  new Promise(
    catchAsync(async (resolve, reject) => {
      console.log('follow page');
      await path.goto_page(
        web.Page_URL(page),
        'article > div:nth-child(1) img[decoding="auto"]'
      );
      await web.page.waitFor(2000);
      let permission = false;
      while (!permission) {
        console.log('click on follower button');
        await path
          .click(
            '//a[contains(., "followers")]',
            'main > div:first-child[contians(.,"Followers")]',
            10000,
            'load'
          )
          .then(res => {
            permission = res;
            console.log('res: ', res);
          });

        if (!permission) {
          await web.page.reload({ waitUntil: 'load' });
          continue;
        }
        await web.page.waitFor(3000);
      }
      console.log('it is loaded');
      resolve(await followLoop(counter, web.Page_URL(page)));
    })
  );
