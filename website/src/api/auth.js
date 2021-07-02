import methods from './base'

const auth = {
  login: function (username, password, callback, app) {
    methods.post('/login', {
      username: username,
      password: password
    }, (resp) => {
      let data = resp.data
      if (data === 'SUCCESS') {
        callback()
      } else {
        let reason = data.message
        switch (reason) {
          case 'User not found':
            app.$message.error('用户' + username + '不存在')
            break
          case 'Incorrect password':
            app.$message.error('密码错误')
            break
          default:
            console.log(resp)
            break
        }
      }
    }, app)
  },
  register: function (username, password, mail, app, callback) {
    methods.post('/register', {
      username: username,
      password: password,
      email: mail
    }, callback, app)
  },
  token: function (app) {
    methods.get('/token', null, null, app)
  },
  userinfo: function (callback, app) {
    methods.get('/userinfo', null, callback, app)
  },
  logout: function (app) {
    methods.get('/logout', null, () => {
      app.$router.push('/login')
    }, app)
  },
  generateValidCode: function (app, callback) {
    methods.get('/generateValidCode', null, callback, app)
  },
  checkValidCode: function (app, callback, codeID, forApi, codeStr) {
    methods.get('/checkValidCode', {
      codeID: codeID,
      codeStr: codeStr,
      forAPI: forApi
    }, callback, app)
  },
  doneRegister: function (app, registerCode, callback) {
    methods.get('/doneRegister', {
      regCode: registerCode
    }, callback, app)
  },
  queryUserById: function (app, uid, callback) {
    methods.get('/queryUserById', {uid: uid}, callback, app)
  },
  asyncUserinfo: async function (uid) {
    let resp = await methods.newGet('/userinfo', {uid: uid})
    return resp
  }
}

export default auth
