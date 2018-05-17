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

export { arrSearch }
