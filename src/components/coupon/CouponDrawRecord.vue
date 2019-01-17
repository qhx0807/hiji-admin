<template>
  <div class="box">
    <Card :bordered="false" class="mb10">
      <Form label-width="60">
        <Row :gutter="10">
          <Col span="5">
            <FormItem label="卡券ID" style="margin-bottom:0">
              <Input v-model="searchObj.carditemid" clearable placeholder="卡券领取id"></Input>
            </FormItem>
          </Col>
          <Col span="5">
            <FormItem label="订单号" style="margin-bottom:0">
              <Input v-model="searchObj.orderno" clearable placeholder="订单号搜索..."></Input>
            </FormItem>
          </Col>
          <Col span="5">
            <FormItem label="手机号" style="margin-bottom:0">
              <Input v-model="searchObj.phone" clearable placeholder="用户手机号"></Input>
            </FormItem>
          </Col>
          <Col span="5">
            <FormItem label="卡券状态" style="margin-bottom:0">
              <Select v-model="searchObj.carditemstate" clearable>
                <Option value="0">未使用</Option>
                <Option value="1">已使用</Option>
                <Option value="2">过期</Option>
                <Option value="3">作废</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="4">
            <Button style="margin-left:12px" type="primary" @click="onClickFetch">查询</Button>
            <Button style="margin-left:10px" :loading="expLoading" @click="onClickExpot">导出数据</Button>
          </Col>
        </Row>
      </Form>
    </Card>

    <Card :bordered="false">
      <Table :loading="recLoading" :columns="recordsColumns" size="small" :data="recordsData"></Table>
      <div style="float: right; padding-top:12px">
        <Page :total="recordsCount" show-total :current="searchObj.page" @on-change="recCchangePage"></Page>
      </div>
      <div style="clear:both"></div>
    </Card>
  </div>
</template>
<script>
import serverApi from '../../axios'
import { downloadFile } from '../../utlis/tools.js'
export default {
  name: 'CouponDrawRecord',
  data () {
    return {
      searchObj: {
        carditemid: '',
        orderno: '',
        phone: '',
        carditemstate: '',
        page: 1,
        id: ''
      },
      expLoading: false,
      recordsColumns: [
        {
          title: '#',
          key: 'id',
          width: 80
        },
        {
          title: '用户',
          key: 'username',
          minWidth: 90
        },
        // {
        //   title: '发放时间',
        //   key: 'cardsendtime',
        //   width: 140
        // },
        {
          title: '领取时间',
          key: 'carddrawtime',
          width: 140
        },
        {
          title: '卡券名称',
          key: 'cardname',
          minWidth: 140
        },
        {
          title: '卡券类型',
          key: 'typename',
          minWidth: 90
        },
        {
          title: '领取来源',
          key: 'orderno',
          width: 100
        },
        {
          title: '备注',
          key: 'cardmsg',
          minWidth: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '使用时间',
          key: 'usetime',
          width: 140
        },
        {
          title: '状态',
          key: 'carditemstate',
          width: 100,
          render: (h, params) => {
            let text = ''
            let color = ''
            switch (params.row.carditemstate) {
              case 0:
                text = '未使用'
                color = 'success'
                break
              case 1:
                text = '已使用'
                color = 'warning'
                break
              case 2:
                text = '过期'
                color = 'warning'
                break
              case 3:
                text = '无效'
                color = 'error'
                break
              default:
                color = 'primary'
                text = params.row.carditemstate
            }
            return h('Tag', {
              props: {
                color: color,
                type: 'border'
              }
            }, text)
          }
        },
        {
          title: '作废原因',
          key: 'dsexplain',
          minWidth: 120,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '作废时间',
          key: 'dstime',
          width: 140,
        },
        {
          title: '操作',
          key: 'id',
          width: 90,
          align: 'center',
          fixed: 'right',
          render: (h, params) => {
            if (params.row.carditemstate == 0 || params.row.carditemstate == 1 || params.row.carditemstate == 2) {
              return h('Button', {
                props: {
                  type: 'info',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.onCLickRemoveCardItem(params.row.id)
                  }
                }
              }, '作废卡券')
            }
          }
        }
      ],
      recordsData: [],
      recordsCount: 0,
      recpage: 1,
      recLoading: false,
      voidResain: ''
    }
  },
  created () {
    this.getRecData()
  },
  methods: {
    getRecData () {
      this.searchObj.id = this.$route.params.id
      this.recLoading = true
      serverApi('/card/cardall', this.searchObj,
        response => {
          this.recLoading = false
          if (response.data.code === 0){
            this.recordsData = response.data.data.result
            this.recordsCount = response.data.data.counts
          }else{
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          this.recLoading = false
          this.$Message.error(error.toString())
        }
      )
    },
    onClickFetch () {
      this.searchObj.page = 1
      this.getRecData()
    },
    recCchangePage (e) {
      this.searchObj.page = e
      this.getRecData()
    },
    onClickExpot () {
      this.expLoading = true
      let d = Object.assign({}, this.searchObj)
      serverApi('/card/cardout', d,
        response => {
          console.log(response)
          if (response.data.code === 0){
            downloadFile(response.data.data)
          }else{
            this.$Message.warning(response.data.msg)
          }
          this.expLoading = false
        },
        error => {
          console.log(error)
          this.expLoading = false
          this.$Message.error(error.toString())
        }
      )
    },
    onCLickRemoveCardItem (id) {
      this.voidResain = ''
      this.$Modal.confirm({
        title: '作废此卡券？',
        render: (h) => {
          return h('Input', {
            props: {
              type: 'textarea',
              value: this.voidResain,
              autofocus: true,
              placeholder: '请输入作废原因...',
              rows: 5
            },
            on: {
              input: (val) => {
                this.voidResain = val
              }
            }
          })
        },
        loading: true,
        onOk: () => {
          let d = {
            id: id,
            dsexplain: this.voidResain,
            confirm: 'cancel'
          }
          serverApi('/card/cancelcard', d,
            response => {
              if (response.data.code === 0) {
                this.$Message.success(response.data.msg)
                this.getRecData()
              } else if (response.data.code === 2) {
                this.$Modal.confirm({
                  title: '提示',
                  content: response.data.msg,
                  onOk: () => {
                    let sd = {
                      id: id,
                      dsexplain: this.voidResain,
                      confirm: 'cancel',
                      drawmoneyid: response.data.data.drawmoneyid
                    }
                    serverApi('/card/cancelcard', sd,
                      res => {
                        if (res.data.code === 0) {
                          this.$Message.success(resizeBy.data.msg)
                          this.getRecData()
                        } else {
                          this.$Message.warning(res.data.msg)
                        }
                      },
                      err => {
                        this.$Message.error(err.toString())
                      }
                    )
                  }
                })
              } else {
                this.$Message.warning(response.data.msg)
              }
              this.voidResain = ''
              this.$Modal.remove()
            },
            error => {
              this.$Modal.remove()
              this.$Message.error(error.toString())
            }
          )
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>

</style>
