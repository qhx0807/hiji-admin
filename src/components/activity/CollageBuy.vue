<template>
  <div class="box">
    <Card :bordered="false" class="mb10">
      <div class="shop-img">
        <img src="http://cdn.cqyyy.cn/collage.png" alt="">
      </div>
      <div class="tips">
        <h4><span style="font-size:14px;font-weight:500">拼团购买</span></h4>
        <p>用户拼团限时购买商品
          <router-link :to="{name: 'CollageBuyAdd'}">添加拼团购买商品</router-link>
        </p>
      </div>
      <div class="clear-fix"></div>
    </Card>
    <Card :bordered="false">
      <div class="table-box">
        <Table size="small" :loading="tableLoading" :columns="columns" :data="tableData"></Table>
      </div>
      <div style="float: right; padding-top:12px">
        <Page :total="count" show-total :current="page" @on-change="changePage" show-sizer></Page>
      </div>
      <div style="clear:both"></div>
    </Card>
  </div>
</template>
<script>
import serverApi from '../../axios'
import CountDown from 'vue2-countdown'
export default {
  name: 'CollageBuy',
  components: {
    CountDown
  },
  data () {
    return {
      page: 1,
      count: 0,
      pagesize: 10,
      tableData: [],
      tableLoading: false,
      columns: [
        {
          title: '#',
          key: 'id',
          width: 60
        },
        {
          title: '商品',
          key: 'goodsimg',
          minWidth: 120,
          render: (h, params) => {
            let img = h('img', {
              attrs: {
                src: params.row.goodsimg
              },
              style: {
                maxWidth: '30px',
                maxHeight: '30px'
              },
              directives: [
                {
                  name: 'imgview'
                }
              ]
            })
            let name = h('span', {}, params.row.goodsname)
            return h('div', [img, name])
          }
        },
        {
          title: '商品价格',
          key: 'goodsprice',
          width: 110
        },
        {
          title: '拼团价格',
          key: 'groupprice',
          width: 110
        },
        {
          title: '成团人数',
          key: 'peoplenum',
          width: 110
        },
        {
          title: '已拼人数',
          key: 'countnum',
          width: 110
        },
        {
          title: '活动时间',
          key: 'goodsprice',
          width: 230,
          render: (h, params) => {
            return h(CountDown, {
              props: {
                currentTime: new Date().getTime(),
                startTime: new Date().getTime(),
                endTime: new Date(params.row.endtime).getTime(),
                tipText: '离开始',
                tipTextEnd: '离结束',
                endText: '已结束',
                dayTxt: '天',
                hourTxt: '小时',
                minutesTxt: '分钟',
                secondsTxt: '秒'
              },
              on: {
                start_callback: () => {

                },
                end_callback: () => {

                }
              }
            })
          }
        },
        {
          title: '操作',
          key: 'id',
          align: 'center',
          width: 150,
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
                marginRight: '10px',
                color: '#ff9900'
              },
              on: {
                click: () => {
                  this.onClickRemove(params.row)
                }
              }
            }, '删除')
            let info = h('a', {
              style: {
                color: '#19be6b',
                marginRight: '10px'
              },
              on: {
                click: () => {
                  this.seeActivity(params.row)
                }
              }
            }, '查看进度')

            return h('div', [edit, del, info])
          }
        }
      ]
    }
  },
  created () {
    this.getTableData()
  },
  methods: {
    getTableData () {
      this.tableLoading = true
      let d = {
        page: this.page,
        pagesize: this.pagesize,
      }
      serverApi('/activity/collageindex', d,
        response => {
          if (response.data.code === 0) {
            this.count = response.data.data.counts
            this.tableData = response.data.data.result
          } else {
            this.$Message.warning(response.data.msg)
          }
          this.tableLoading = false
        },
        error => {
          console.log(error)
          this.tableLoading = false
          this.$Message.error(error.toString())
        }
      )
    },
    changePage (e) {
      this.page = e
      this.getTableData()
    },
    seeActivity (row) {

    },
    onClickEdit (row) {
      this.$router.push({name: 'CollageBuyEdit', params: {id: row.id}})
    },
    onClickRemove (row) {
      this.$Modal.confirm({
        title: '提示',
        content: '<p>确认删除此团购商品？</p>',
        onOk: () => {
          serverApi('/activity/collagedel', {id: row.id},
            response => {
              if (response.data.code == 0) {
                this.getTableData()
              }
              this.$Message.info(response.data.msg)
            },
            error => {
              console.log(error)
              this.$Message.error('链接失败！')
            }
          )
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.shop-img{
  width: 60px;
  height: 60px;
  float: left;
  img{
    height: 100%;
    width: 100%;
  }
}
.tips{
  padding-left: 70px;
  h4{
    margin-top: 10px;
  }
  p{
    margin-top: 5px;
  }
}
</style>
