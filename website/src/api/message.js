import methods from './base'

const message = {
  applyJoin: function (app, qq) {
    methods.get('/applyJoin', {qq: qq}, (resp) => {
      app.$message.success('申请成功，请等待管理员批准')
    }, app)
  },
  isApplySent: function (app, callback) {
    methods.get('/isApplySent', null, callback, app)
  },
  messages: function (app, filter, page, callback) {
    methods.get('/messages', {
      filter: filter,
      page: page
    }, callback, app)
  },
  deleteMessage: function (app, mid, callback) {
    methods.get('/deleteMessage', {mid: mid}, callback, app)
  },
  createMessage: function (app, content, type, showPermission, requestKey) {
    methods.get('/createMessage', {
      content: content,
      type: type,
      showPermission: showPermission,
      requestKey: requestKey
    }, null, app)
  },
  allowJoin: function (app, mid, callback) {
    methods.get('/allowJoin', {
      messageID: mid
    }, callback, app)
  }
}

export default message
