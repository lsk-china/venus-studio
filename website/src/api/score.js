import methods from './base'
import storage from 'good-storage'

const score = {
  canClockIn: function (callback, app) {
    methods.get('/canClockIn', null, callback, app)
  },
  clockIn: function (app, requestKey) {
    methods.get('/clockin', {requestKey: requestKey}, resp => {
      if (resp.data === 'Not match') {
        app.$message.error('验证码错误')
        return
      }
      app.$message.success('签到成功')
      app.showClockInButton = false
      app.clockInState = '您今天已经签到过了'
      let user = storage.session.get('user')
      user.score += 50
      storage.session.set('user', user)
    }, app)
  },
  clockInStatistic: function (app, callback) {
    methods.get('/clockInStatistic', null, callback, app)
  }
}

export default score
