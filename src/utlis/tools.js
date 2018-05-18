const arrSearch = (arr, search) => {
  if (search) {
    return arr.filter(function (item) {
      return Object.keys(item).some(function (k) {
        return String(item[k]).toLowerCase().indexOf(search) > -1
      })
    })
  } else {
    return arr
  }
}

let res = []
const formatJsonTree = (arr, childrenName) => {
  let name = childrenName || 'child'
  arr.forEach(item => {
    if (!item[name] || item[name].length === 0) {
      res.push(item)
    } else {
      formatJsonTree(item[name], name)
    }
  })
  return res
}

export { arrSearch, formatJsonTree }
