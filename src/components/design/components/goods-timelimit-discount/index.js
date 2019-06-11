import TimeLimitDiscountPreview from './TimeLimitDiscountPreview.vue'
import TimeLimitDiscountEditor from './TimeLimitDiscountEditor.vue'
import combine from '../../base/combineComponents'
const designType = 'timelimit-discount'
const designDescription = '限时抢购'

const TimeLimitDiscount = combine(TimeLimitDiscountPreview, TimeLimitDiscountEditor, designType, designDescription)

TimeLimitDiscount.defaultValue = {
  ids: '',
  listStyle: 1,
  padding: 15,
  spacing: 10,
  itemStyle: 1,
  imgScale: 1,
  textStyle: 1,
  showContent: ['name', 'desc', 'disprice', 'orprice', 'timer', 'progress', 'buynum', 'buybtn', 'stock'],
  btnStyle: 1,
  btnText: '立即抢购',
  goodsItem: [
    {
      goodsname: '这里显示商品名称，最多显示2行',
      goodsdesc: '这里显示商品描述，最多显示1行',
      goodsimg: 'http://cdn.cqyyy.cn/pic/20190610172641.png',
      goodsprice: '99'
    },
    {
      goodsname: '这里显示商品名称，最多显示2行',
      goodsdesc: '这里显示商品描述，最多显示1行',
      goodsimg: 'http://cdn.cqyyy.cn/pic/20190610172641.png',
      goodsprice: '99'
    },
    {
      goodsname: '这里显示商品名称，最多显示2行',
      goodsdesc: '这里显示商品描述，最多显示1行',
      goodsimg: 'http://cdn.cqyyy.cn/pic/20190610172641.png',
      goodsprice: '99'
    },
    {
      goodsname: '这里显示商品名称，最多显示2行',
      goodsdesc: '这里显示商品描述，最多显示1行',
      goodsimg: 'http://cdn.cqyyy.cn/pic/20190610172641.png',
      goodsprice: '99'
    }
  ]
}

export default TimeLimitDiscount
