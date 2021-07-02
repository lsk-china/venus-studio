function getBody (xhr) {
  const text = xhr.responseText || xhr.response
  if (!text) {
    return text
  }

  try {
    return JSON.parse(text)
  } catch (e) {
    return text
  }
}
function getError (action, option, xhr) {
  let msg
  if (xhr.response) {
    msg = `${xhr.response.error || xhr.response}`
  } else if (xhr.responseText) {
    msg = `${xhr.responseText}`
  } else {
    msg = `fail to post ${action} ${xhr.status}`
  }

  const err = new Error(msg)
  err.status = xhr.status
  err.method = 'post'
  err.url = action
  return err
}

export default function (api, options) {
  return new Promise((resolve, reject) => {
    if (typeof XMLHttpRequest === 'undefined') {
      return
    }
    let xhr = new XMLHttpRequest()
    let action = options.action
    let formData = new FormData()
    Object.keys(action.data).forEach(key => {
      formData.append(key, options.data[key])
    })
    formData.append(options.filename, options.file, options.file.name)
    xhr.onload = function () {
      if (xhr.status < 200 || xhr.status >= 300) {
        reject(getError(action, options, xhr))
      }
      resolve(getBody(xhr))
    }
    xhr.open('post', action, true)
    xhr.withCredentials = true
    let headers = options.headers || {}
    for (let item in headers) {
      if (headers.hasOwnProperty(item) && headers[item] !== null) {
        xhr.setRequestHeader(item, headers[item])
      }
    }
    xhr.send(formData)
  })
}
