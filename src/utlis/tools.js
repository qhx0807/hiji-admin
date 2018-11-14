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

const combineCell = (list) => {
  for (let field in list[0]) {
    var k = 0
    while (k < list.length) {
      list[k][field + 'span'] = 1
      list[k][field + 'dis'] = false
      for (var i = k + 1; i <= list.length - 1; i++) {
        if (list[k][field] === list[i][field] && list[k][field] !== '') {
          list[k][field + 'span']++
          list[k][field + 'dis'] = false
          list[i][field + 'span'] = 1
          list[i][field + 'dis'] = true
        } else {
          break
        }
      }
      k = i
    }
  }
  return list
}

const downloadFile = (path) => {
  if (!path) return false
  let aTag = document.createElement('a')
  aTag.download = path
  aTag.href = path
  aTag.click()
}
export { arrSearch, formatJsonTree, combineCell, downloadFile }
