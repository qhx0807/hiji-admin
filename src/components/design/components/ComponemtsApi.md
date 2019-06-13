#### 页面配置

- `type`: `comfig`
- `title`: '页面标题',
- `bgcolor`: '#ffffff'

#### 空白辅助

- `type`: `whitespace`
- `height`: 30,
- `bgcolor`: '#ffffff'

#### 辅助线

- `type`: `line`
- `style`: solid, 边框样式
- `padding`: '0' 页面边距
- `color`: '#eee

#### 轮播组件

- `type`: `swiper`
- `height`: 37.5vw, 高度
- `items`: [item]
```javascript
// item
{
  imageurl: '',
  linktype: '',
  linkurl: '',
  city: ''
}
```

#### Icon组件

- `type`: `icon`
- `rownum`: 5
- `bgimg`: ''
- `items`: [item]
```javascript
// item
{
  imageurl: '',
  linktype: '',
  linkurl: '',
  city: '',
  name: ''
}
```

#### 公告

- `type`: `notice`
- `bgcolor`: #FFF8E9
- `color`: '#666666'
- `content`: '请填写内容，如果过长，将会在手机上滚动显示'
- `linktype`: 0
- `linkurl`: ''

#### 图片广告

- `type`: `image-ad`
- `padding`: 0 页面边距
- `spacing`: 0 图片间距
- `width`: 30(百分比，在横向滚动时使用)
- `template`: 1: 一行一个， 2: 横向滚动
- `items`: 同上

#### 商品
- type: 'goods'
- ids: '',
- listStyle: '', // 列表样式
- padding: 0, // 页面边距
- spacing: 0, // 商品间距
- itemStyle: 1, // 商品样式
- imgScale: 1, // 图片比例
- textStyle: 1, // 文本样式
- showContent: ['name', 'desc', 'price', 'buybtn', 'bage'],
- buybtnStyle: 1
- items: []
```javascript
items = [{
  `name`: // 名称
  `orprice` // 商品原价
  `disprice` // 售价
  `desc` //描述
  `img` // 商品图片
  `id` // 商品id
}]
```

#### 拼团商品
- type: 'groupbuy'
- ids: '',
- listStyle: '', // 列表样式
- padding: 0, // 页面边距
- spacing: 0, // 商品间距
- itemStyle: 1, // 商品样式
- imgScale: 1, // 图片比例
- textStyle: 1, // 文本样式
- showContent: ['name', 'desc', 'price', 'buybtn', 'bage'],
- buybtnStyle: 1
- items: []
```javascript
items = [{
  `name`: // 名称
  `orprice` // 商品原价
  `disprice` // 拼团价格
  `desc` //描述
  `img` // 商品图片
  `id` // 商品id
  `sales` // 已拼人数
  `endtime` // 结束时间
  `groupnum` // 成团人数
}]
```

#### 抢购商品
- type: 'timelimit-discount'
- ids: '',
- listStyle: '', // 列表样式
- padding: 0, // 页面边距
- spacing: 0, // 商品间距
- itemStyle: 1, // 商品样式
- imgScale: 1, // 图片比例
- textStyle: 1, // 文本样式
- showContent: ['name', 'desc', 'price', 'buybtn', 'bage'],
- buybtnStyle: 1
- items: []
```javascript
items = [{
  `name`: // 名称
  `orprice` // 商品原价
  `disprice` // 抢购价格
  `desc` // 描述
  `img` // 商品图片
  `id` // 商品id
  `sales` // 已抢数量
  `endtime` // 结束时间
  `reaminstock` // 剩余库存
  `allstock` // 总库存
}]
```
#### 砍价商品
- type: 'cutdown'
- ids: '',
- listStyle: '', // 列表样式
- padding: 0, // 页面边距
- spacing: 0, // 商品间距
- itemStyle: 1, // 商品样式
- imgScale: 1, // 图片比例
- textStyle: 1, // 文本样式
- showContent: ['name', 'desc', 'price', 'buybtn', 'bage'],
- buybtnStyle: 1
- items: []
```javascript
items = [{
  `name`: // 名称
  `orprice` // 商品原价
  `disprice` // 抢购价格
  `desc` // 描述
  `img` // 商品图片
  `id` // 商品id
  `sales` // 已抢数量
  `endtime` // 结束时间
  `reaminstock` // 剩余库存
  `allstock` // 总库存
}]
```

#### 卡券
- type: 'o2'
- ids: '',
- listStyle: '', // 列表样式
- padding: 0, // 页面边距
- spacing: 0, // 商品间距
- itemStyle: 1, // 商品样式
- imgScale: 1, // 图片比例
- textStyle: 1, // 文本样式
- showContent: ['name', 'desc', 'price', 'buybtn', 'bage'],
- buybtnStyle: 1
- items: []
```javascript
items = [{
  `orprice` // 门市原价
  `disprice` // 售价
  `name`: // 名称
  `img` // 主图片
  `id` // 卡券id
  `address` // 地址
  `phone` // 电话
  `tags`: // 标签 如： ['精品套餐', '销售火爆', '回头客多']
  `byname`: // 别名
}]
```
#### 抢购卡券

- type: 'o2-timelimit-dsicount'
- ids: '',
- listStyle: '', // 列表样式
- padding: 0, // 页面边距
- spacing: 0, // 商品间距
- itemStyle: 1, // 商品样式
- imgScale: 1, // 图片比例
- textStyle: 1, // 文本样式
- showContent: ['name', 'desc', 'price', 'buybtn', 'bage'],
- buybtnStyle: 1
- items: []
```javascript
items = [{
  `orprice` // 门市原价
  `disprice` // 售价
  `name`: // 名称
  `img` // 主图片
  `id` // 卡券id
  `address` // 地址
  `phone` // 电话
  `tags`: // 标签 如： ['精品套餐', '销售火爆', '回头客多']
  `byname`: // 别名
  `endtime`: // 结束时间
  `reaminstock` // 剩余库存
  `allstock` // 总库存
  `sales` // 已抢数量
}]
```
