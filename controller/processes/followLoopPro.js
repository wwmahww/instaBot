const web = require('../../utils/interfaces');
const subFollow = require('./subFollowPro');
const likeLastPost = require('./likeLastPost');
const _error = require('../../utils/errorClass');
const catchAsync = require('../../utils/catchAsync');
const act = require('../../utils/action');
const path = require('../../utils/direction');

module.exports = (counter, currentPage) => {
  return new Promise(
    catchAsync(async (resolve, reject) => {
      console.log('loop is started.');
      while (counter.hasFollowed <= web.limit) {
        console.log('loop 1');
        let buttons = await web.page.$$('button');
        let pageLinks = await web.page.$$('a[title]');
        while (counter.round < buttons.length) {
          console.log('loop 2');
          console.log(counter);
          if (!buttons) {
            buttons = await web.page.$$('button');
            pageLinks = await web.page.$$('a[title]');
          }
          console.log('buttons lenght: ', buttons.length);
          let button = buttons[counter.round];

          let buttonText = await web.page.evaluate(
            button => button.textContent,
            button
          );
          // let pageName = await web.page.evaluate(
          //   element => element.textContent,
          //   linkPage[i]
          // );

          console.log('text: ', buttonText);
          if (buttonText === 'Follow') {
            let isFollowed = await subFollow(pageLinks[counter.round]);
            if (isFollowed) {
              counter.hasFollowed++;
              if (web.likeLastPost) {
                await likeLastPost();
              }
            }
            console.log('is followed: ', isFollowed);
            if (counter.hasFollowed >= web.limit) break;
            buttons = false;
            // Go to  main page again
            let permission = false;
            while (!permission) {
              await act.loadPage(currentPage);
              await web.page.waitFor(2000);
              await path
                .click('//a[contains(., "followers")]', 'li canvas', 10000)
                .then(res => {
                  permission = res;
                  console.log('res: ', permission);
                });
            }
            console.log('loaded');
            await web.page.waitFor(2000);
          }
          counter.round++;
        }
        console.log('not yet!');
        // check limit
        if (counter.hasFollowed >= web.limit) return;
        // scroll
        console.log('ttt!');
        let elementscroll = await web.page.$('html');
        await web.page.evaluate(
          elementscroll => elementscroll.scrollBy(0, 500),
          elementscroll
        );
      }
      web.allHasFollowed += counter.hasFollowed;
      resolve(counter);
    })
  );
};
