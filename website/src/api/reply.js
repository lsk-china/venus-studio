import methods from './base'

const reply = {
  queryWorkReplies: function (app, wid, callback) {
    console.log(wid)
    return methods.get('/queryReplies', {
      srcType: 'WORK',
      srcID: wid
    }, callback, app)
  },
  addReply: async function (app, content, wid) {
    let resp = await methods.newGet('/addReply', {
      srcID: wid,
      srcType: 'work',
      content: content
    })
    return resp
  },
  queryReplyLikesById: function (app, rid, callback) {
    methods.get('/queryReplyLikes', {rid: rid}, callback, app)
  },
  isReplyLiked: function (app, rid, callback) {
    methods.get('/isLiked', {targetType: 'REPLY', targetID: rid}, callback, app)
  },
  likeReply: function (app, rid) {
    methods.get('/likeSomething', {targetID: rid, targetType: 'REPLY'}, null, app)
  },
  deLikeReply: function (app, rid) {
    methods.get('/deLikeSomething', {targetID: rid, targetType: 'REPLY'}, null, app)
  }
}
export default reply
