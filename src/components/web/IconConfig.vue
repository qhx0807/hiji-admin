<template>
  <div class="box">
    <Card :bordered="false" class="mb10">
      <div class="tips">
        <p style="font-size:14px;">
          <img src="http://cdn.cqyyy.cn/PREVIEW.svg" alt="">
          首页Icon配置。图片，跳转action.
          <router-link :to="{name: 'IconAdd'}"><Icon size="14" type="md-add" />新建ICON项</router-link>
        </p>
      </div>
    </Card>
    <Card :bordered="false">
      <div class="table-box">
        <Table size="small" :columns="columns" :data="tableData"></Table>
      </div>
    </Card>
    <div class="phonepreview">
      <!-- <img src="http://cdn.cqyyy.cn/PREVIEW.svg" alt=""> -->
      ICON oreview
    </div>
  </div>
</template>
<script>
import serverApi from '../../axios'
export default {
  name: 'IconConfig',
  data () {
    return {
      tableData: [],
      columns: [
        {
          title: '#',
          key: 'id',
          width: 60
        },
        {
          title: '城市',
          key: 'city',
          width: 80
        },
        {
          title: '图片',
          key: 'imgurl',
          align: 'center',
          width: 170,
          render: (h, params) => {
            return h('img', {
              attrs: {
                src: params.row.imgurl
              },
              style: {
                maxWidth: '150px',
                maxHeight: '70px'
              },
              directives: [
                {
                  name: 'imgview'
                }
              ]
            })
          }
        },
        {
          title: '跳转地址',
          key: 'url',
        },
        {
          title: '文字',
          key: 'url',
        },
        {
          title: '跳转类型',
          key: 'urltype',
        },
        {
          title: '排序',
          key: 'sort',
          width: 80
        },
        {
          title: '状态',
          key: 'sort',
        },
        {
          title: '操作',
          key: 'swiperid',
          align: 'center',
          width: 120,
          fixed: 'right',
          render: (h, params) => {
            let edit = h('a', {
              style: {
                marginRight: '10px'
              },
              on: {
                click: () => {
                  this.onClickEdit(params.row)
                }
              }
            }, '编辑')
            let del = h('a', {
              style: {
                color: '#f90',
                marginRight: '10px'
              },
              on: {
                click: () => {
                  this.remove(params.row)
                }
              }
            }, '删除')

            return h('div', [edit, del])
          }
        }
      ]
    }
  },
  created () {},
  methods: {}
}
</script>
<style lang="less" scoped>
.box{
  .phonepreview{
    position: fixed;
    z-index: 99;
    right: 10px;
    top: 154px;
    width: 370px;
    height: 220px;
    border-radius: 3px;
    background-color: #fff;
    box-shadow: 0 2px 2px 0 rgba(0,0,0,0.16), 0 0 0 1px rgba(0,0,0,0.08);
    .demo-carousel{
      height: 220px;
    }
  }
  .tips{
    p{
      img{
        vertical-align: bottom;
      }
    }
  }
  .table-box{
    padding-right: 375px;
  }
}
</style>
