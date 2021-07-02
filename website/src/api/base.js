import _axios from 'axios'
// import qs from 'qs'

_axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

export let dataAxios = _axios.create({
  baseURL: 'http://localhost:40000',
  timeout: 10000,
  withCredentials: true
})
export let assetsAxios = _axios.create({
  baseURL: 'http://localhost:10002',
  timeout: 10000,
  withCredentials: false
})

const methods = {
  async get (api, params, callback, app) {
    if (callback === null) {
      callback = (resp) => {}
    }
    // let par = qs.stringify(params)
    await dataAxios.request({
      url: api,
      method: 'GET',
      params: params
    }).then((resp) => {
      callback(resp)
    }).catch(reason => {
      console.log(reason)
      app.$message.error('Cannot get api ' + api + '. Reason: ' + reason)
    })
  },
  async post (api, param, callback, app) {
    if (callback === null) {
      callback = (resp) => {}
    }
    await dataAxios.request({
      url: api,
      method: 'POST',
      params: param
    }).then((resp) => {
      callback(resp)
    }).catch((reason) => {
      console.log(reason)
      app.$message.error('Cannot post api ' + api + '. Reason: ' + reason)
    })
  },
  newGet: async function (api, params, error) {
    // let resp = await dataAxios.get(api, {
    //   params: params
    // })
    // let data = resp.data
    // if (data.code !== undefined) {
    //   console.error('Get api ' + api + 'failed. code: ' + data.code + ' message: ' + data.message)
    //   return {
    //     code: data.code,
    //     message: data.message,
    //     data: null
    //   }
    // } else {
    //   return {
    //     code: 200,
    //     message: 'Success',
    //     data: data.data
    //   }
    // }
    let promise = new Promise(resolve => {
      console.log(params)
      dataAxios.get(api, {params: params}).then(resp => {
        let data = resp.data
        if (data.code !== undefined) {
          console.error('Get api ' + api + 'failed.Code: ' + data.code + ' Message: ' + data.message)
          if (error !== null) {
            error(data)
          }
        } else {
          resolve(data)
        }
      })
    })
    // eslint-disable-next-line no-return-await
    return await promise
  }
}

export default methods
