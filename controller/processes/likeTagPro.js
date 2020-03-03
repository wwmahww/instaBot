const path = require('../../utils/direction');
const act = require('../../utils/action');
const web = require('../../utils/interfaces');
const comment_post = require('./commnet_post');
const _error = require('../../utils/errorClass');
const catchAsync = require('../../utils/catchAsync');

module.exports = tags =>
  new Promise(
    catchAsync(async (resolve, reject) => {
      for (let tag of tags) {
        await path.goto_page(
          web.TAG_URL(tag),
          'div canvas',
          30000,
          'networkidle0'
        );
        for (let i = 0; i < 3; i++) {
          let posts = await web.page.$$(
            'article > div:nth-child(3) img[decoding="auto"]'
          );
          let post = posts[i];
          await path.click(post, 'section  section svg', 10000);
          await web.page.waitFor(2000);
          await act.like();
          await comment_post();
          await web.page.goBack({ waitUntil: 'load' });
          await web.page.waitFor(2000);
          await web.page.goBack({ waitUntil: 'load' });
          // await path.goto_page(
          //   web.TAG_URL(tag),
          //   'div canvas',
          //   30000,
          //   'networkidle0'
          // );
          await web.page.waitFor(1000);
        }
      }
      resolve();
    })
  );

//   pickTag: async () => {
//     console.log('pickTag start');

//     let tagIsProper = true;
//     for (let tag of likeTagPro.tags) {
//       // Check if the tag has been used
//       for (let finishTag of likeTagPro.finishTags) {
//         if (tag === finishTag) {
//           tagIsProper = false;
//           break;
//         }
//       }
//       if (tagIsProper) {
//         likeTagPro.current_tag = tag;
//         return await likeTagPro.loadTag();
//       }
//     }
//     return 'its done'; // all tags has been used
//   },
//   // loadTag: async () => {
//   //   console.log('loadTag has started');

//   //   await path
//   //     .goto_page(
//   //       web.TAG_URL(likeTagPro.current_tag),
//   //       'div canvas',
//   //       30000,
//   //       'networkidle0'
//   //     )
//   //     .then(() => {
//   //       likeTagPro.finishTags.push(likeTagPro.current_tag);
//   //     });

//   //   return await likeTagPro.likeAndComment();
//   // },
//   likeAndComment: async () => {
//     console.log('likeandComment start');
//     // like first 3 post
//     for (let i = 0; i < 3; i++) {
//       // get the posts
//       let posts = await web.page.$$(
//         'article > div:nth-child(3) img[decoding="auto"]'
//       );
//       let post = posts[i];
//       console.log('post is: ', post);

//       // Like and comment         NO NEED FOR CATCHING ERROR
//       await likeAndComment(post)
//         .then(async () => {
//           await likeTagPro.getBack(2);
//         })
//         .catch(async err => {
//           await likeTagPro.getBack(1);
//         });

//       await web.page.waitFor(2000);

//       // Back to the first place
//     }
//     return 'it is done properly';
//   },
//   getBack: async num => {
//     for (let i = 0; i <= num; i++) {
//       await web.page.click('span[aria-label="Back"]');
//       await web.page.waitFor(1000);
//     }
//   }
// };
