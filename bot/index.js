/* eslint-disable no-fallthrough */
/* eslint-disable default-case */
const { CronJob } = require('cron');

const handler = require('./handler');
const catchAsync = require('./utils/catchAsync');
const web = require('./utils/interfaces');
const pool = require('./initializer');

let targetPages;
let targetTags;
let pageName;
let pagePassword;
let page;
let resourcePromise;

const init = () =>
  new Promise(resolve => {
    resourcePromise = pool.acquire();
    resourcePromise.then(async fun => {
      console.log('we are in then!');
      page = await fun();
      web.page = page;
      web.turn = 'login';
      resolve();
    });
  });

const sequence = async () => {
  switch (web.turn) {
    case 'init':
      await init();
    case 'login':
      await handler.login(page, pageName, pagePassword);
    case 'getDetail':
    // await handler.getDetail(page);
    case 'follow':
    // await handler.follow(page, targetPages);
    case 'unfollow':
    // await handler.unfollow(page);
    case 'likeTags':
      await handler.likeTags(page, targetTags);
  }
  web.followCounter = { hasDone: 0, round: 0 };
  web.Unfollowed = 0;
  web.likeCounter = { hasDone: 0, round: 0 };
};

const manager = order => {
  switch (order) {
    case 'sequence': {
      const min = Math.floor(Math.random() * 59);
      console.log('min: ', min);
      // prettier-ignore
      const job = new CronJob(`0 ${min} 8-23 * * *`,sequence,null,true,'Iran');
      job.start();
      break;
    }
    // case ''
  }
};

process.on('message', obj => {
  ({ pageName, pagePassword, targetTags, targetPages } = obj);
  web.pageName = pageName;
  web.comments = obj.comments;
  web.directTexts = obj.directTexts;
  web.whiteList = obj.whiteList;
  web.followPrivate = obj.followPrivate;
  web.likeLastPost = obj.likeLastPost;
  switch (obj.commentPace) {
    case 'fast':
      web.commentPace = 4;
      break;
    case 'medium':
      web.commentPace = 5;
      break;
    default:
      web.commentPace = 6;
  }
  console.log(pageName);
  process.send(`started`);

  console.log('like last post: ', web.likeLastPost);
  console.log('follow private: ', web.followPrivate);

  // manager('sequence');
  sequence();
});

module.exports.sequence = sequence;
module.exports.init = init;
