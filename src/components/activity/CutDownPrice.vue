<template>
  <div class="box">
    <Card :bordered="false" class="mb10">
      <div class="shop-img">
        <img src="http://cdn.cqyyy.cn/cutdown.png" alt="">
      </div>
      <div class="tips">
        <h4><span style="font-size:14px;font-weight:500">砍价狂欢趴</span></h4>
        <p>添加砍价活动
          <router-link :to="{name: 'CutDownPriceAdd'}">添加砍价活动</router-link>
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
import { downloadFile } from '../../utlis/tools.js'
export default {
  name: 'CutDownPrice',
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
          title: '活动id',
          key: 'id',
          width: 60
        },
        {
          title: '商品id',
          key: 'goodsid',
          width: 80
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
          width: 100
        },
        {
          title: '砍价目标',
          key: 'lowerprice',
          width: 100
        },
        {
          title: '最高砍价金额',
          key: 'topprice',
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
          title: '状态',
          key: 'ison',
          width: 130,
          render: (h, params) => {
            let text = params.row.ison == 1 ? '发布' : '下线'
            let color = params.row.ison == 1 ? 'success' : 'warning'
            return h('Tag', {
              props: {
                type: 'dot',
                color: color
              }
            }, text)
          }
        },
        {
          title: '操作',
          key: 'id',
          align: 'center',
          width: 260,
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
            let info = h('a', {
              style: {
                color: '#f90',
                marginRight: '10px'
              },
              on: {
                click: () => {
                  this.seeActivity(params.row)
                }
              }
            }, '查看活动进度')
            let exps = h('a', {
              style: {
                color: 'green',
                marginRight: '10px'
              },
              on: {
                click: () => {
                  this.onClickUserExport(params.row)
                }
              }
            }, '导出砍价人详情')
            let del = h('a', {
              style: {
                color: '#f60'
              },
              on: {
                click: () => {
                  this.onClickRemoveItem(params.row)
                }
              }
            }, '删除')
            return h('div', [edit, info, exps, del])
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
      serverApi('/activity/activityindex', d,
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
      this.$router.push({name: 'CutDownPriceReport', params: {id: row.id}})
    },
    onClickEdit (row) {
      this.$router.push({name: 'CutDownPriceEdit', params: {id: row.id}})
    },
    onClickUserExport (row) {
      this.isloading = true
      this.$Message.loading({
        duration: 0,
        content: '加载中...'
      })
      serverApi('/activity/activityreport2', {id: row.id},
        response => {
          this.$Message.destroy()
          this.isloading = false
          if (response.data.code === 0) {
            downloadFile(response.data.data)
          } else {
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          this.isloading = false
          this.$Message.destroy()
          console.log(error)
          this.$Message.warning('连接失败！')
        }
      )
    },
    onClickRemoveItem (row) {
      this.$Modal.confirm({
        title: '提示',
        content: '<p>确认删除此活动记录？</p>',
        loading: true,
        onOk: () => {
          serverApi('/activity/activitydel', {id: row.id},
            response => {
              this.$Modal.remove()
              if (response.data.code == 0) {
                this.getTableData()
              }
              this.$Message.info(response.data.msg)
            },
            error => {
              this.$Modal.remove()
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
