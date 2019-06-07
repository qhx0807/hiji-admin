import SwiperPreview from './SwiperPreview.vue'
import SwiperEditor from './SwiperEditor.vue'
import combine from '../../base/combineComponents'
const designType = 'swiper'
const designDescription = '轮播广告'

const Swiper = combine(SwiperPreview, SwiperEditor, designType, designDescription)

Swiper.defaultValue = {
  height: '37.5vw',
  items: [
    // {
    //   imageurl: 'http://cdn.cqyyy.cn/hi_logo_201906071543562168.png',
    //   linktype: '',
    //   linkurl: '1212',
    //   city: '1'
    // }
  ]
}

export default Swiper
