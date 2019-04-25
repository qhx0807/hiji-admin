import pingyinJson from './pinyin.json'

const isChinese = (str) => {
  let cnChar = str.match(/[^\x00-\x80]/g) // eslint-disable-line
  if (cnChar) return true
  return false
}

const arraySearch = (str) => {
  for (var name in pingyinJson) {
    if (~pingyinJson[name].indexOf(str)) {
      return name
    }
  }
  return false
}

const getPinYinFirstCharacter = (str, uppercase = true) => {
  let len = str.length
  let result = ''
  for (let i = 0; i < len; i++) {
    let val = str.charAt(i)
    if (isChinese(val)) {
      let name = arraySearch(val)
      if (name) {
        result += name.substring(0, 1)
      } else {
        result += val
      }
    } else {
      result += val
    }
  }
  return uppercase ? result.toUpperCase() : result
}

export { getPinYinFirstCharacter }
