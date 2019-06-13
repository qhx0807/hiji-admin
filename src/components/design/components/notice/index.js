import NoticePreview from './NoticePreview.vue'
import NoticeEditor from './NoticeEditor.vue'
import combine from '../../base/combineComponents'
const designType = 'notice'
const designDescription = '公告'

const Notice = combine(NoticePreview, NoticeEditor, designType, designDescription)

Notice.defaultValue = {
  color: '#ed6a0c',
  bgcolor: '#fffbe8',
  content: '请填写内容，如果过长，将会在手机上滚动显示',
  linktype: 0,
  linkurl: '',
  city: [1, 2, 3, 4, 5, 6, 7]
}

export default Notice
