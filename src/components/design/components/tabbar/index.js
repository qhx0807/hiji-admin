import TabbarPreview from './TabbarPreview.vue'
import TabbarEditor from './TabbarEditor.vue'
import combine from '../../base/combineComponents'
const designType = 'tabbar'
const designDescription = '标签栏'

const Tabbar = combine(TabbarPreview, TabbarEditor, designType, designDescription)

Tabbar.defaultValue = {
  bgcolor: '#ffffff',
  bgimg: '',
  fixed: true,
  items: []
}

export default Tabbar
