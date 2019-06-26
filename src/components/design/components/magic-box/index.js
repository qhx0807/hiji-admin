import MagicBoxPreview from './MagicBoxPreview.vue'
import MagicBoxEditor from './MagicBoxEditor.vue'
import combine from '../../base/combineComponents'
const designType = 'magic-box'
const designDescription = '魔方'

const MagicBox = combine(MagicBoxPreview, MagicBoxEditor, designType, designDescription)

MagicBox.defaultValue = {
  template: 0,
  spacing: 0,
  padding: 0,
  city: [],
  items: []
}

export default MagicBox
