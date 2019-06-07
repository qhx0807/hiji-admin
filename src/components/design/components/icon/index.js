import IconPreview from './IconPreview.vue'
import IconEditor from './IconEditor.vue'
import combine from '../../base/combineComponents'
const designType = 'icon'
const designDescription = 'Icon图标'

const Icon = combine(IconPreview, IconEditor, designType, designDescription)

Icon.defaultValue = {
  rownum: 5,
  bgimg: '',
  items: [
    {
      imageurl: 'http://cdn.cqyyy.cn/hiji_201906071709171979.jpg',
      linktype: 1,
      linkurl: '1212',
      city: 1,
      name: '测试图标'
    },
    {
      imageurl: 'http://cdn.cqyyy.cn/hiji_201906071709171979.jpg',
      linktype: 1,
      linkurl: '1212',
      city: 1,
      name: '测试图标'
    },
    {
      imageurl: 'http://cdn.cqyyy.cn/hiji_201906071709171979.jpg',
      linktype: 1,
      linkurl: '1212',
      city: 1,
      name: '测试图标'
    },
    {
      imageurl: 'http://cdn.cqyyy.cn/hiji_201906071709171979.jpg',
      linktype: 1,
      linkurl: '1212',
      city: 1,
      name: '测试图标'
    },
    {
      imageurl: 'http://cdn.cqyyy.cn/hiji_201906071709171979.jpg',
      linktype: 1,
      linkurl: '1212',
      city: 1,
      name: '测试图标'
    },
    {
      imageurl: 'http://cdn.cqyyy.cn/hiji_201906071709171979.jpg',
      linktype: 1,
      linkurl: '1212',
      city: 1,
      name: '测试图标'
    }
  ]
}

export default Icon
