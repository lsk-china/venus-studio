import methods from './base'

const work = {
  queryWorksByUser: function (app, page, callback) {
    methods.get('/queryWorkByUser', {page: page}, callback, app)
  },
  changeWorkName: function (app, wid, newName) {
    return methods.get('/changeWorkName', {
      wid: wid,
      newname: newName
    }, null, app)
  },
  queryWorkById: function (app, wid, callback) {
    methods.get('/queryWorkById', {wid: wid}, callback, app)
  },
  queryWorkLikeById: async function (app, wid) {
    let resp = await methods.newGet('/queryWorkLikes', {wid: wid})
    return resp
  },
  queryWorkAssets: async function (app, wid) {
    let resp = await methods.newGet('/queryWorkAssets', {wid: wid})
    return resp
  },
  queryAllWorks: async function (app, page) {
    let resp = await methods.newGet('/queryAllWorks', {page: page}, reason => {
      app.$message.error('查询作品失败！')
      console.error(reason)
    })
    return resp
  },
  enableWork: async function (app, wid) {
    let resp = await methods.newGet('/enableWork', {wid: wid}, reason => {
      console.error(reason)
      app.$message.error('操作失败！')
    })
    return resp
  },
  increaseWorkViews: function (app, wid) {
    methods.get('/increaseWorkViews', {wid: wid}, null, app)
  }
}

export default work
