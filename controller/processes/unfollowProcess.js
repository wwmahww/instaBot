const path = require('../../utils/direction');
const act = require('../../utils/action');
const web = require('../../utils/interfaces');
const methods = require('../../utils/methods');
const _error = require('../../utils/errorClass');
const catchAsync = require('../../utils/catchAsync');

module.exports = () =>
  new Promise(
    catchAsync(async (resolve, reject) => {
      const saveList = ['human_david', 'animals.co'];
      let unfollowed = 0;
      let limit = 20;
      let round = 0;
      console.log('1');
      await path.goto_page(
        `https://www.instagram.com/${web.pageName}/`,
        `a[href="/${web.pageName}/followers/"]`,
        20000
      );
      console.log('2');

      await path.click(`a[href="/${web.pageName}/following/"]`, 'img', 5000);
      await web.page.waitFor(2000);
      const bodyElement = await web.page.$('html');

      console.log('3');

      console.log(
        'scrollHeight: ',
        await web.page.evaluate(
          bodyElement => bodyElement.scrollHeight,
          bodyElement
        )
      );
      // take the scroll bar to the bottom
      while (1) {
        await web.page.evaluate(
          bodyElement => bodyElement.scrollBy(0, bodyElement.scrollHeight),
          bodyElement
        );
        await web.page.waitFor(3000);
        let finish = await web.page.evaluate(bodyElement => {
          return Promise.resolve(
            bodyElement.scrollHeight - bodyElement.clientHeight ==
              Math.round(bodyElement.scrollTop)
              ? true
              : false
          );
        }, bodyElement);

        console.log(finish);
        if (finish) break;
      }

      while (unfollowed < limit) {
        await web.page.waitFor(2000);
        console.log('4');

        let buttons = await web.page.$x('//button[contains(., "Following")]');
        let names = await web.page.$$('a[title]');

        console.log('number of buttons: ', buttons.length);
        console.log('number of names: ', names.length);

        for (let i = buttons.length; i >= 0; i--) {
          console.log('5');
          let button = buttons[i - 1];
          let name = names[i - 1];
          name = await web.page.evaluate(name => name.textContent, name);
          buttonText = await web.page.evaluate(
            button => button.textContent,
            button
          );
          await web.page.waitFor(2000);

          // if (saveList.includes(name)) continue;
          if (!saveList.includes(name) & (buttonText === 'Following')) {
            await path.click(button, '//button[contains(.,"Unfollow")]', 3000);
            const admitUnfollow = await web.page.$x(
              '//button[contains(.,"Unfollow")]'
            );
            await admitUnfollow[0].click();
            await web.page.waitFor(1500);
            unfollowed++;
          }
          round++;
          if (unfollowed >= 20) {
            resolve();
            return;
          }
        }
        console.log('6');
        let finish = await web.page.evaluate(bodyElement => {
          bodyElement.scrollTop === 0 ? true : false;
        }, bodyElement);

        if (finish) break;
        await web.page.evaluate(
          bodyElement => bodyElement.scrollBy(0, -500),
          bodyElement
        );
      }
      resolve();
    })
  );

// const unfollow = {
//   round: 0, // Number of pages that has checked
//   text: '',
//   hasUnfollowed: 0, // Number of pages that has unfollowed
//   followingNameList: [], // List of following names
//   followingName: '', // name of one following name
//   followersButtons: [], // List of buttons
//   perDelete: { user: true, time: false }, // Unfollow pages over their time
//   save: false, // #Modify to turn to boolean.
//   limit: 20, // The number that limit the number of unfollowing
//   saveList: [
//     // List of protected pages from being unfollow
//     'human_david',
//     'pariaakhavass',
//     'developers_team'
//   ],

//   loadFollowingPage: async () => {
//     console.log('here we are');

//     // Goto profile
//     await path.goto_page(
//       `https://www.instagram.com/${web.pageName}/`,
//       `a[href="/${web.pageName}/followers/"]`,
//       20000
//     );

//     await path.click(`a[href="/${web.pageName}/following/"]`, 'img', 5000);
//     await web.page.waitFor(2000);

//     return await unfollow.loopOnUnfollowButtons();
//   },
//   loopOnUnfollowButtons: async () => {
//     console.log('loop is started.');

//     // Limit for unfollow count
//     while (unfollow.hasUnfollowed < unfollow.limit) {
//       console.log('its here.');
//       // Need to be reviewed          #Modify

//       unfollow.followersButtons = await web.page.$x(
//         '//button[contains(., "Following")]'
//       );
//       unfollow.followingNameList = await web.page.$$('a[title]'); // List of following names in order to check if thay are protected or not

//       // count on has goten buttons
//       for (let i = unfollow.round; i < unfollow.followersButtons.length; i++) {
//         console.log('inner loop');
//         unfollow.perDelete.time = false;

//         // DO not unfollow protect users
//         followingName = followingNameList[i];
//         followingName = await web.page.evaluate(
//           followingName => followingName.textContent,
//           followingName
//         );

//         // If user is protected from unfollowing
//         if (unfollow.saveList.includes(unfollow.followingName)) continue;

//         //          check if database has the current user to unfollow or not
//         if (methods.check(unfollow.followingName, web.following)) {
//           if (methods.timePeriod(web.following[key]) > unfollowPeriod) {
//             delete web.following.key;
//             unfollow.perDelete.time = true;
//           }
//         } else {
//           if (unfollow.perDelete.user) unfollow.perDelete.time = true;
//         }
//         if (unfollow.perDelete.time) {
//           console.log('i is :', i);
//           let button = unfollow.followersButtons[i];

//           console.log('**button: ');
//           await act.unfollow(button); // unfollow
//           hasUnfollowed++;
//         }
//         round++;
//         if (unfollow.hasUnfollowed >= 20)
//           // check whether it should stop unfollowing
//           break;
//       }
//       console.log('out of inner loop');
//       // Get the element scroll
//       let elementscroll = await web.page.$('main');
//       let finish = await web.page.evaluate(elementscroll => {
//         return Promise.resolve(
//           elementscroll.scrollHeight - elementscroll.clientHeight ==
//             Math.round(elementscroll.scrollTop)
//             ? 1
//             : 0
//         );
//       }, elementscroll);

//       console.log(finish);
//       if (finish) break;
//       await web.page.evaluate(
//         elementscroll => elementscroll.scrollBy(0, 500),
//         elementscroll
//       );
//     }
//     await web.page.waitFor(2000);
//     return 'unfollow process has done perfectly';
//   }
// };
