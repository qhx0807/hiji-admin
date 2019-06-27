import ImageAdPreview from './ImageAdPreview.vue'
import ImageAdEditor from './ImageAdEditor.vue'
import combine from '../../base/combineComponents'
const designType = 'image-ad'
const designDescription = '图片广告'

const ImageAd = combine(ImageAdPreview, ImageAdEditor, designType, designDescription)

ImageAd.defaultValue = {
  padding: 0,
  spacing: 0,
  width: 30,
  template: 1,
  city: [1, 2, 3, 4, 5, 6, 7],
  items: [
    // {
    //   imageurl: 'http://cdn.cqyyy.cn/01_02_201906120957157391.jpg',
    //   linktype: 0,
    //   linkurl: 0,
    //   city: 0
    // },
    // {
    //   imageurl: 'http://cdn.cqyyy.cn/01_03_201906120957194078.jpg',
    //   linktype: 0,
    //   linkurl: 0,
    //   city: 0
    // }
  ]
}

export default ImageAd
