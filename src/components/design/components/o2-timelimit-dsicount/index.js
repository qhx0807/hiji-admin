import O2TimeLimitDiscountPreview from './O2TimeLimitDiscountPreview.vue'
import O2TimeLimitDiscountEditor from './O2TimeLimitDiscountEditor.vue'
import combine from '../../base/combineComponents'
const designType = 'o2-timelimit-discount'
const designDescription = '限时抢购'

const O2TimeLimitDiscount = combine(O2TimeLimitDiscountPreview, O2TimeLimitDiscountEditor, designType, designDescription)

O2TimeLimitDiscount.defaultValue = {
  ids: '',
  templateId: '',
  listStyle: 1,
  padding: 15,
  spacing: 10,
  itemStyle: 1,
  imgScale: 1,
  textStyle: 1,
  showContent: ['name', 'tags', 'disprice', 'orprice', 'address', 'buybtn', 'progress', 'timer', 'stock', 'buynum'],
  btnStyle: 1,
  btnText: '马上抢',
  badgeStyle: 'new-arrival',
  badgeImg: 'http://cdn.cqyyy.cn/pic/20190613140550.png',
  items: [
    {
      id: '1',
      name: '这里显示卡券名称，最多显示2行',
      address: '邻水宏帆广场3楼 咨询电话：15988885642',
      img: 'http://cdn.cqyyy.cn/pic/20190610172641.png',
      tags: ['精品套餐', '销售火爆', '回头客多'],
      disprice: '99',
      orprice: '129',
      endtime: '',
      sales: 10,
      reaminstock: 17,
      allstock: 89,
      byname: '90团120'
    },
    {
      id: '2',
      name: '这里显示卡券名称，最多显示2行',
      address: '邻水宏帆广场3楼 咨询电话：15988885642',
      img: 'http://cdn.cqyyy.cn/pic/20190610172641.png',
      tags: ['精品套餐', '销售火爆', '回头客多'],
      disprice: '99',
      orprice: '129',
      endtime: '',
      sales: 10,
      reaminstock: 17,
      allstock: 89,
      byname: '90团120'
    },
    {
      id: '3',
      name: '这里显示卡券名称，最多显示2行',
      address: '邻水宏帆广场3楼 咨询电话：15988885642',
      img: 'http://cdn.cqyyy.cn/pic/20190610172641.png',
      tags: ['精品套餐', '销售火爆', '回头客多'],
      disprice: '99',
      orprice: '129',
      endtime: '',
      sales: 10,
      reaminstock: 17,
      allstock: 89,
      byname: '90团120'
    },
    {
      id: '4',
      name: '这里显示卡券名称，最多显示2行',
      address: '邻水宏帆广场3楼 咨询电话：15988885642',
      img: 'http://cdn.cqyyy.cn/pic/20190610172641.png',
      tags: ['精品套餐', '销售火爆', '回头客多'],
      disprice: '99',
      orprice: '129',
      endtime: '',
      sales: 10,
      reaminstock: 17,
      allstock: 89,
      byname: '90团120'
    }
  ]
}

export default O2TimeLimitDiscount
