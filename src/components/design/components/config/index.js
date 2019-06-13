import ConfigEditor from './configEditor.vue'
import ConfigPreview from './ConfigPreview.vue'
import combine from '../../base/combineComponents'
const designType = 'config'
const designDescription = '页面配置'

const Config = combine(ConfigPreview, ConfigEditor, designType, designDescription)

Config.defaultValue = {
  title: '页面标题',
  bgcolor: '#fff',
  bgimg: ''
}

export default Config
