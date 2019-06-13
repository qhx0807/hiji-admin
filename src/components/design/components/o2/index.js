import O2Preview from './O2Preview.vue'
import O2Editor from './O2Editor.vue'
import combine from '../../base/combineComponents'
const designType = 'o2'
const designDescription = '卡券'

const O2 = combine(O2Preview, O2Editor, designType, designDescription)

O2.defaultValue = {
  ids: '',
  listStyle: 1,
  padding: 15,
  spacing: 10,
  itemStyle: 1,
  imgScale: 1,
  textStyle: 1,
  showContent: ['name', 'tags', 'disprice', 'orprice', 'address', 'buybtn'],
  btnStyle: 1,
  btnText: '马上抢',
  badgeStyle: 'new-arrival',
  badgeImg: 'http://cdn.cqyyy.cn/pic/20190613140550.png',
  items: [
    {
      name: '这里显示卡券名称，最多显示2行',
      address: '邻水宏帆广场3楼 咨询电话：15988885642',
      img: 'http://cdn.cqyyy.cn/pic/20190610172641.png',
      tags: ['精品套餐', '销售火爆', '回头客多'],
      disprice: '99',
      orprice: '129'
    },
    {
      name: '这里显示卡券名称，最多显示2行',
      address: '邻水宏帆广场3楼 咨询电话：15988885642',
      img: 'http://cdn.cqyyy.cn/pic/20190610172641.png',
      tags: ['精品套餐', '销售火爆', '回头客多'],
      disprice: '99',
      orprice: '129'
    },
    {
      name: '这里显示卡券名称，最多显示2行',
      address: '邻水宏帆广场3楼 咨询电话：15988885642',
      img: 'http://cdn.cqyyy.cn/pic/20190610172641.png',
      tags: ['精品套餐', '销售火爆', '回头客多'],
      disprice: '99',
      orprice: '129'
    }
  ]
}

export default O2
