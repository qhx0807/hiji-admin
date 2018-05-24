import axios from 'axios'

// const apiUrl = 'http://192.168.1.200/index.php/admin'
// const apiUrl = 'http://39.108.15.145:8082/index.php?s=/admin'

const host = 'http://' + window.location.host

let apiUrl = process.env.API_URL

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

axios.interceptors.request.use(function (config) {
  if (config.url.indexOf('login') === -1) {
    config.headers[`token`] = sessionStorage.token
  }
  return config
}, function (error) {
  return Promise.reject(error)
})

axios.interceptors.response.use(function (res) {
  if (res.data.code === 100 || res.data.code === 80) {
    // alert('token 错误，请重新登录')
    window.location.href = host
  }
  return res
}, function (error) {
  return Promise.reject(error)
})

const serverApi = (url, data, succFoo, errorFoo) => {
  axios({
    method: 'post',
    url: apiUrl + url,
    data: data,
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
