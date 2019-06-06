import WhitespacePreview from './WhitespacePreview.vue'
import WhitespaceEditor from './WhitespaceEditor.vue'
import combine from '../../base/combineComponents'
const designType = 'whitespace'
const designDescription = '空白辅助'

const WhiteSpace = combine(WhitespacePreview, WhitespaceEditor, designType, designDescription)

WhiteSpace.defaultValue = {
  height: 30,
  bgcolor: '#ffffff'
}

export default WhiteSpace
