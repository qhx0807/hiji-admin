import SharePreview from './SharePreview.vue'
import ShareEditor from './ShareEditor.vue'
import combine from '../../base/combineComponents'
const designType = 'share'
const designDescription = '分享'

const Share = combine(SharePreview, ShareEditor, designType, designDescription)

Share.defaultValue = {
  title: '',
  desc: '',
  link: '',
  imgUrl: ''
}

export default Share
