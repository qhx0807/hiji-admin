import axios from 'axios'
import { apiUrl } from '../config/index.js'

axios.defaults.crossDomain = true
axios.defaults.withCredentials = true

// const host = 'http://' + window.location.host

// let apiUrl = process.env.API_URL

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

axios.interceptors.request.use(function (config) {
  if (config.url.indexOf('login') === -1) {
    config.headers[`token`] = window.sessionStorage.token
  }
  return config
}, function (error) {
  return Promise.reject(error)
})

axios.interceptors.response.use(function (res) {
  if (res.data.code === 100 || res.data.code === 80) {
    // sessionStorage.clear()
    // alert('token 错误，请重新登录')
    // window.location.href = host
  } else if (res.data.code === 10) {
    // sessionStorage.clear()
    // alert('无权限访问！')
    // window.location.href = host
  }
  return res
}, function (error) {
  return Promise.reject(error)
})

const serverApi = (url, data, succFoo, errorFoo) => {
  let userid = window.sessionStorage.userid || ''
  axios({
    method: 'post',
    url: apiUrl + url,
    data: Object.assign({ userid: userid }, data),
    transformRequest: [function (data) {
      let ret = ''
      for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }]
  }).then(response => {
    succFoo(response)
  })
    .catch(error => {
      errorFoo(error)
    })
}

export default serverApi
