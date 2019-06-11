import CutdownPreview from './CutdownPreview.vue'
import CutdownEditor from './CutdownEditor.vue'
import combine from '../../base/combineComponents'
const designType = 'cutdown'
const designDescription = '助力砍价'

const Cutdown = combine(CutdownPreview, CutdownEditor, designType, designDescription)

Cutdown.defaultValue = {
  ids: '',
  listStyle: 1,
  padding: 15,
  spacing: 10,
  itemStyle: 1,
  imgScale: 1,
  textStyle: 1,
  showContent: ['name', 'desc', 'disprice', 'orprice', 'timer', 'progress', 'buynum', 'buybtn', 'stock'],
  btnStyle: 1,
  btnText: '发起砍价',
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

export default Cutdown
