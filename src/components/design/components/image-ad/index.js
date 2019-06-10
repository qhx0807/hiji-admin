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
  items: []
}

export default ImageAd
