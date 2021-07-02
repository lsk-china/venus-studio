import storage from 'good-storage'
import auth from '../api/auth'

export async function getUserInfo (uid) {
  if (storage.has('USERINFO-' + uid)) {
    return storage.get('USERINFO-' + uid)
  } else {
    let userinfo = await auth.asyncUserinfo(uid)
    storage.set('USERINFO-' + uid, userinfo)
    return userinfo
  }
}
