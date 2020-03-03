// const CronJob = require('Cron').CronJob;

const handler = require('./handler');
const catchAsync = require('./utils/catchAsync');
const web = require('./utils/interfaces');

let targets = ['#car', 'film_bazzan'];
const tags = ['فیلم', 'مووی'];
const username = web.pageName;
const password = '!23M78i90';

web.username = username;
// console.log('before instantiation')
// const job1 = new CronJob('*/1 * * * * *',() => {
//     let date = new Date()
//     let time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
//     console.log('-------')
//     console.log('date',time)
// })

// console.log('after instantiaion')

// job1.start();

// const job2 = new job('*/1 * * * * *',() => {console.log('5')})
// const job3 = new job('*/2 * * * * *', () => {console.log('6')})
// job3.schedule().start();
// job2.schedule().start();

catchAsync(async () => {
  await handler.initialize();
  await handler.login(username, password);
  // await handler.follow(targets);
  // await handler.unfollow();
  await handler.likeTags(tags);
  // const followProcess = new job('0 7 13 * * *', () => {ig.followProcess(['car'])});
  // const unfollowProcess = new job('0 10 13 * * *', ig.unfollowProcess);
  // const likeAndCommentProcess = new job('0 13 13 * * *', () => {ig.likeTagsProcess(['cars'])});
  // followProcess.schedule().start()
  // unfollowProcess.schedule().start()
  // likeAndCommentProcess.schedule().start()
})();

// async function start() {
//   await handler.initialize();
//   await handler.login(username, password);
//   return true;
// }

// let counter = 0;
// let result;
// async function startApp() {
//   while (!(result = await start())) {
//     console.log('conter is : ', ++counter, result);
//     await handler.close_handler.run();
//   }
// }
