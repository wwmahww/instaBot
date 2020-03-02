const path = require('../../utils/direction');
const act = require('../../utils/action');
const web = require('../../utils/interfaces');
const _error = require('../../utils/errorClass');

const Login = {
  username: '',
  password: '',

  start: async (username, password) => {
    console.log('login is started.');
    this.username = username;
    this.password = password;
    return await Login.load();
  },
  load: async () => {
    let login;
    await path
      .goto_page(web.login_URL, '//button[contains(., "Log In")]')
      .catch(async err => {
        if (!(await act.loginCheck()))
          throw new _error('login/load', 'start', err, 'redo');
        login = true;
      });
    if (login) return true;
    return await Login.authenticate();
  },
  authenticate: async () => {
    return await act.authenticate(this.username, this.password).catch(err => {
      err.code = 'login/auth' + err.code;
      throw err;
    });
  }
};

module.exports = Login;
