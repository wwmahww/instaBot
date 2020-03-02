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
      // counter contains <round> and <hasfollowed>
      console.log('loop is started.');
      console.log('counter: ', counter);
      while (counter.hasFollowed <= web.limit) {
        console.log('loop 1');
        let buttons = await web.page.$$('button');
        for (let i = counter.round; i < buttons.length; i++) {
          if (!buttons) {
            buttons = await web.page.$$('button');
            linkPage = await web.page.$$('a[title]');
          }
          let button = buttons[i];

          let buttenText = await web.page.evaluate(
            button => button.textContent,
            button
          );
          // let pageName = await web.page.evaluate(
          //   element => element.textContent,
          //   linkPage[i]
          // );

          console.log('text: ', buttenText);
          if (buttenText === 'Follow') {
            let isFollowed = await subFollow(
              linkPage[i],
              web.notFollowBusinessPage,
              web.notFollowPrivatePage
            );
            if (isFollowed) {
              counter.hasFollowed++;
              if (likeLastPost) {
                await likeLastPost();
              }
              if (counter.hasFollowed >= web.limit) break;
            }
            console.log('is followed: ', isFollowed);
            buttons = false;
            // Go to  main page again
            await act.loadPage(currentPage);
            await web.page.waitFor(2000);
            await path.click('//a[contains(., "followers")]', 'img', 10000);
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
