import GroupBuyPreview from './GroupBuyPreview.vue'
import GroupBuyEditor from './GroupBuyEditor.vue'
import combine from '../../base/combineComponents'
const designType = 'groupbuy'
const designDescription = '拼团商品'

const GroupBuy = combine(GroupBuyPreview, GroupBuyEditor, designType, designDescription)

GroupBuy.defaultValue = {
  ids: '',
  listStyle: 1,
  padding: 15,
  spacing: 10,
  itemStyle: 1,
  imgScale: 1,
  textStyle: 1,
  // textAlign: 'left',
  showContent: ['name', 'desc', 'ptprice', 'orprice', 'timer', 'buynum', 'buybtn'],
  btnStyle: 1,
  btnText: '去开团',
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

export default GroupBuy
