import GoodsPreview from './GoodsPreview.vue'
import GoodsEditor from './GoodsEditor.vue'
import combine from '../../base/combineComponents'
const designType = 'goods'
const designDescription = '商品'

const Goods = combine(GoodsPreview, GoodsEditor, designType, designDescription)

Goods.defaultValue = {
  ids: '',
  listStyle: 1,
  padding: 15,
  spacing: 10,
  itemStyle: 1,
  imgScale: 1,
  textStyle: 1,
  showContent: ['name', 'desc', 'price', 'buybtn'],
  btnStyle: 1,
  badgeStyle: '新品',
  btnText: '马上抢',
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

export default Goods
