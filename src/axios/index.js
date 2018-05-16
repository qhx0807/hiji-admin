import axios from 'axios'

const apiUrl = 'http://192.168.1.200/index.php/admin'

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
