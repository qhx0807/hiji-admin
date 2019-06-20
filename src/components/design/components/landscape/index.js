import LandscapePreview from './LandscapePreview.vue'
import LandscapeEditor from './LandscapeEditor.vue'
import combine from '../../base/combineComponents'
const designType = 'landscape'
const designDescription = '压屏窗'

const Landscape = combine(LandscapePreview, LandscapeEditor, designType, designDescription)

Landscape.defaultValue = {
  imgurl: '',
  mask: true,
  linktype: 0,
  linkurl: '',
  city: []
}

export default Landscape
