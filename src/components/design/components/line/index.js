import LinePreview from './LinePreview.vue'
import LineEditor from './LineEditor.vue'
import combine from '../../base/combineComponents'
const designType = 'line'
const designDescription = '辅助线'

const Line = combine(LinePreview, LineEditor, designType, designDescription)

Line.defaultValue = {
  style: 'solid',
  padding: '0',
  color: '#eeeeee'
}

export default Line
