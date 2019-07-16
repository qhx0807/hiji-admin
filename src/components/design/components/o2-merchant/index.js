import O2MerchantPreview from './O2MerchantPreview.vue'
import O2MerchantEditor from './O2MerchantEditor.vue'
import combine from '../../base/combineComponents'
const designType = 'o2-merchant'
const designDescription = '商户页'

const O2Merchant = combine(O2MerchantPreview, O2MerchantEditor, designType, designDescription)

O2Merchant.defaultValue = {
  type: 'o2-merchant',
  ids: '', // 商户的 code
  items: [
    {
      img: 'http://cdn.cqyyy.cn/pic/20190610172641.png',
      name: '商户名称，最多显示一行',
      address: '邻水宏帆广场3楼',
      tel: '023-86271234',
      tags: [ '精品套餐', '销量火爆', '回头客多' ],
      code: 'njdatongbingshi',
      menus: [ '98买159元2-3人餐', '159元买299元6人餐' ]
    },
    {
      img: 'http://cdn.cqyyy.cn/pic/20190610172641.png',
      name: '商户名称，最多显示一行',
      address: '邻水宏帆广场3楼',
      tel: '023-86271234',
      tags: [ '精品套餐', '销量火爆', '回头客多' ],
      code: 'njdatongbingshi',
      menus: [ '98买159元2-3人餐', '159元买299元6人餐' ]
    },
    {
      img: 'http://cdn.cqyyy.cn/pic/20190610172641.png',
      name: '商户名称，最多显示一行',
      address: '邻水宏帆广场3楼',
      tel: '023-86271234',
      tags: [ '精品套餐', '销量火爆', '回头客多' ],
      code: 'njdatongbingshi',
      menus: [ '98买159元2-3人餐', '159元买299元6人餐' ]
    }
  ]
}

export default O2Merchant
