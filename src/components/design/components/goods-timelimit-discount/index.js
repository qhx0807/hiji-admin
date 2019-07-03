import TimeLimitDiscountPreview from './TimeLimitDiscountPreview.vue'
import TimeLimitDiscountEditor from './TimeLimitDiscountEditor.vue'
import combine from '../../base/combineComponents'
const designType = 'timelimit-discount'
const designDescription = '限时抢购'

const TimeLimitDiscount = combine(TimeLimitDiscountPreview, TimeLimitDiscountEditor, designType, designDescription)

TimeLimitDiscount.defaultValue = {
  ids: '',
  listStyle: 1,
  templateId: '',
  padding: 15,
  spacing: 10,
  itemStyle: 1,
  imgScale: 1,
  textStyle: 1,
  showContent: ['name', 'desc', 'disprice', 'orprice', 'timer', 'progress', 'buynum', 'buybtn', 'stock'],
  btnStyle: 1,
  btnText: '立即抢购',
  badgeStyle: 'new-arrival',
  badgeImg: 'http://cdn.cqyyy.cn/pic/20190613140550.png',
  items: [
    {
      name: '这里显示商品名称，最多显示2行',
      desc: '这里显示商品描述，最多显示1行',
      img: 'http://cdn.cqyyy.cn/pic/20190610172641.png',
      disprice: '99.88',
      orprice: '129.99'
    },
    {
      name: '这里显示商品名称，最多显示2行',
      desc: '这里显示商品描述，最多显示1行',
      img: 'http://cdn.cqyyy.cn/pic/20190610172641.png',
      disprice: '99.88',
      orprice: '129.99'
    },
    {
      name: '这里显示商品名称，最多显示2行',
      desc: '这里显示商品描述，最多显示1行',
      img: 'http://cdn.cqyyy.cn/pic/20190610172641.png',
      disprice: '99.88',
      orprice: '129.99'
    },
    {
      name: '这里显示商品名称，最多显示2行',
      desc: '这里显示商品描述，最多显示1行',
      img: 'http://cdn.cqyyy.cn/pic/20190610172641.png',
      disprice: '99.88',
      orprice: '129.99'
    }
  ]
}

export default TimeLimitDiscount
