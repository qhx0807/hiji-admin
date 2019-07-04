import GoodsPreview from './GoodsPreview.vue'
import GoodsEditor from './GoodsEditor.vue'
import combine from '../../base/combineComponents'
const designType = 'goods'
const designDescription = '商品'

const Goods = combine(GoodsPreview, GoodsEditor, designType, designDescription)

Goods.defaultValue = {
  ids: '',
  templateId: '',
  listStyle: 1,
  padding: 15,
  spacing: 10,
  itemStyle: 1,
  imgScale: 1,
  textStyle: 1,
  showContent: ['name', 'desc', 'disprice', 'orprice', 'buybtn'],
  btnStyle: 1,
  badgeStyle: 'new-arrival',
  badgeImg: 'http://cdn.cqyyy.cn/pic/20190613140550.png',
  btnText: '马上抢',
  items: [
    {
      name: '这里显示商品名称，最多显示2行',
      desc: '这里显示商品描述，最多显示1行',
      img: 'http://cdn.cqyyy.cn/pic/20190610172641.png',
      disprice: '99',
      orprice: '129',
      id: '1'
    },
    {
      name: '这里显示商品名称，最多显示2行',
      desc: '这里显示商品描述，最多显示1行',
      img: 'http://cdn.cqyyy.cn/pic/20190610172641.png',
      disprice: '99',
      orprice: '129',
      id: '1'
    },
    {
      name: '这里显示商品名称，最多显示2行',
      desc: '这里显示商品描述，最多显示1行',
      img: 'http://cdn.cqyyy.cn/pic/20190610172641.png',
      disprice: '99',
      orprice: '129',
      id: '1'
    },
    {
      name: '这里显示商品名称，最多显示2行',
      desc: '这里显示商品描述，最多显示1行',
      img: 'http://cdn.cqyyy.cn/pic/20190610172641.png',
      disprice: '99',
      orprice: '129',
      id: '1'
    }
  ]
}

export default Goods
