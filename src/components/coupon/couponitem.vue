<template>
  <div class="box">
    <Card :bordered="false">
      <Row>
        <Form :label-width="45" label-position="right">
          <Col span="5">
            <FormItem label="搜索" style="margin-bottom:0">
              <Input v-model="searchKey" clearable placeholder="搜索关键字..." ></Input>
            </FormItem>
          </Col>
          <Col span="5">
            <FormItem label="状态" style="margin-bottom:0">
              <Select v-model="status" clearable>
                <Option value="0">编制</Option>
                <Option value="1">发布</Option>
                <Option value="2">有效</Option>
                <Option value="3">停止</Option>
                <Option value="4">无效</Option>
                <Option value="5">过期</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="8">
            <Button type="primary" style="margin-left:8px" icon="ios-search" @click="onClickSearch">搜索</Button>
            <Button type="primary" style="margin-left:8px" icon="md-add" @click="onClickAdd">新增</Button>
            <Button type="default" :loading="recLoading" style="margin-left:8px" icon="md-arrow-down" @click="onClickExport">导出卡卷列表</Button>
          </Col>
        </Form>
      </Row>
    </Card>
    <Card :bordered="false" style="margin-top:12px;">
      <div class="body">
        <Table size="small" :columns="columns" :data="tableData"></Table>
      </div>
      <div style="float: right; padding-top:12px">
        <Page :total="count" show-total :current="page" @on-change="changePage" show-sizer show-elevator @on-page-size-change="onChangeSize"></Page>
      </div>
      <div style="clear:both"></div>
    </Card>

    <Modal v-model="recModal" width="1000":styles="{top: '20px'}">
      <p slot="header" style="text-align:center">
        <span>卡券领取记录</span>
      </p>
      <div>
        <div class="body">
          <Table :loading="recLoading" :columns="recordsColumns" size="small" :data="recordsData"></Table>
        </div>
        <div style="float: right; padding-top:12px">
          <Page :total="recordsCount" show-total :current="recpage" @on-change="recCchangePage"></Page>
        </div>
        <div style="clear:both"></div>
      </div>
      <div slot="footer">
        <!-- <Button @click="recModal = false">取消</Button>
        <Button type="primary" @click="recModal = false">确定</Button> -->
      </div>
    </Modal>
    <Modal v-model="modal12" draggable scrollable title="状态选择">
        <RadioGroup v-model="itemData.cardmainstate" @on-change="onCardmainstate">
          <Radio :label="0">编制</Radio>
          <Radio :label="1">发布</Radio>
          <Radio :label="2">有效</Radio>
          <Radio :label="3">停止</Radio>
          <Radio :label="4">无效</Radio>
          <Radio :label="5">过期</Radio>
        </RadioGroup>
        <div slot="footer">
        <Button @click="modal12 = false">取消</Button>
        <Button type="primary" @click="cardState">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import serverApi from '../../axios'
import { downloadFile } from '../../utlis/tools.js'
export default {
  name: 'CouponItem',
  data () {
    return {
      searchKey: '',
      tableData: [],
      addModal: false,
      modal_loading: false,
      recLoading: false,
      recModal: false,
      modal12: false,
      status: '',
      count: 0,
      page: 1,
      pageSize: 10,
      animal: '',
      cardid: '',
      cardmainstate: '',
      columns: [
        {
          title: '编号',
          key: 'id',
          width: 80
        },
        {
          title: '卡券图',
          key: 'imgmaster',
          width: 66,
          align: 'center',
          render: (h, params) => {
            if (!params.row.imgmaster) return h('div',{},'')
            return h('img', {
              attrs: {
                src: params.row.imgmaster
              },
              style: {
                maxWidth: '50px',
                maxHeight: '55px',
                margin: '3px 0'
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
          title: '卡券名称',
          key: 'cardname',
          width: 190
        },
        // {
        //   title: '所属商家',
        //   key: 'cardname',
        //   width: 190
        // },
        {
          title: '类型',
          key: 'typename',
          width: 140
        },
        {
          title: '状态',
          key: 'cardmainstate',
          width: 80,
          render: (h, params) => {
            // if (params.row.cardmainstate == 1) {
            //   return h('Tag', {
            //     props: {
            //       color: 'success'
            //     }
            //   }, '发布')
            // }
            let text = this.stateData[params.row.cardmainstate] || ''
            // return h('span', {}, text)
            return h('span', {
              style: {
                color: 'blue',
                cursor: 'pointer'
              },
              on: {
                click: ()=>this.onChangeCard(params.row)
              },
            }, text)

          }
        },
        {
          title: '总库存',
          key: 'totalcount',
          width: 100,
          render: (h, params) => {
            return h('InputNumber', {
              props: {
                // min: params.row.remaincount,
                value: params.row.totalcount,
                'active-change': false
              },
              on: {
                "on-change": (e) => {
                  this.onChangeStock(e, params.row.id)
                }
              }
            })
          }
        },
        {
          title: '剩余库存',
          key: 'remaincount',
          width: 90
        },
        {
          title: '当前价格',
          key: 'price',
          width: 90
        },
        {
          title: '发放时间',
          key: 'id',
          minWidth: 170,
          render: (h, params) => {
            return h('div', {}, `${params.row.startsendtime} 至 ${params.row.endsendtime}`)
          }
        },
        {
          title: '使用时间',
          key: 'id',
          minWidth: 170,
          render: (h, params) => {
            return h('div', {}, `${params.row.startusetime} 至 ${params.row.endusetime}`)
          }
        },
        {
          title: '操作',
          key: 'id',
          align: 'center',
          width: 145,
          fixed: 'right',
          render: (h, params) => {
            let edit = h('a', {
              style: {
                marginRight: '6px'
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
                marginRight: '6px'
              },
              on: {
                click: () => {
                  this.remove(params.row)
                }
              }
            }, '删除')
            let records = h('a', {
              style: {
                color: '#19be6b',
              },
              on: {
                click: () => {
                  this.seeRecords(params.row)
                }
              }
            }, '领取记录')

            return h('div', [edit, del, records])
          }
        }
      ],
      activtyData: [],
      editData: {},
      stateData: ['编制', '发布', '有效', '停止', '无效', '过期'],
      recordsColumns: [
        {
          title: '#',
          key: 'id',
          width: 80
        },
        {
          title: '用户',
          key: 'username',
          width: 90
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
          minWidth: 120
        },
        {
          title: '卡券类型',
          key: 'typename',
          width: 90
        },
        {
          title: '领取来源',
          key: 'orderno',
          minWidth: 100
        },
        {
          title: '备注',
          key: 'cardmsg',
          width: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '使用时间',
          key: 'usetime',
          width: 100
        },
        {
          title: '状态',
          key: 'carditemstate',
          width: 80,
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
          width: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '操作',
          key: 'id',
          width: 80,
          align: 'center',
          fixed: 'right',
          render: (h, params) => {
            if (params.row.carditemstate == 0 || params.row.carditemstate == 1) {
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
      recId: null,
      bool: true,
      voidResain: '',
      itemData: {}
    }
  },
  created () {
    this.getTableData()
  },
  methods: {
    onClickSearch () {
      this.page = 1
      this.getTableData()
    },
    getTableData (page, size, key) {
      let d = {
        pagesize: this.pageSize,
        page: this.page,
        like: this.searchKey,
        status: this.status
      }
      this.$store.commit('pageLoading', true)
      serverApi('/card/coupon', d,
        response => {
          console.log(response)
          if (response.data.code === 0){
            this.tableData = response.data.data.result
            this.count = response.data.data.counts
          }else{
            this.$Message.warning(response.data.msg)
          }
          this.$store.commit('pageLoading', false)
        },
        error => {
          console.log(error)
          this.$store.commit('pageLoading', false)
          this.$Message.error('连接失败！')
        }
      )
    },
    changePage (e) {
      this.page = e
      this.getTableData()
    },
    onChangeSize (e) {
      this.pageSize = e
      this.getTableData()
    },
    onClickAdd () {
      this.$router.push({name: 'CouponItemAdd'})
    },
    onClickEdit (row) {
      this.$router.push({name: 'CouponItemEdit', params: {id: row.id}})
    },
    remove (row) {
      this.$Modal.confirm({
        title: '提示',
        content: '<p>确认删除此条信息？</p>',
        onOk: () => {
          serverApi('/card/coupondel', {id: row.id},
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
    },
    onSelectSendDate (e) {
      this.form.startsendtime = e[0]
      this.form.endsendtime = e[1]
    },
    onSelectUseDate (e) {
      this.form.startusetime = e[0]
      this.form.endusetime = e[1]
    },
    seeRecords (row) {
      // this.recpage = 1
      // this.recId = row.id
      // this.voidResain = ''
      // this.getRecData(this.recId)
      // this.recordsData = []
      // this.recModal = true
      this.$router.push({name: 'CouponDrawRecord', params: {id: row.id}})
    },
    getRecData (id) {
      let d = {
        page: this.recpage,
        id: id
      }
      this.recLoading = true
      serverApi('/card/cardall', d,
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
    recCchangePage (e) {
      this.recpage = e
      this.getRecData(this.recId)
    },
    onChangeStock (e, id) {
      let d = {
        id: id,
        stock: e
      }
      if (!this.bool) return false
      this.bool = false
      serverApi('/card/couponstockedit', d,
        response => {
          if (response.data.code === 0){
            this.$Message.success(response.data.msg)
            this.getTableData()
          }else{
            this.$Message.warning(response.data.msg)
          }
          this.bool = true
        },
        error => {
          console.log(error)
          this.bool = true
          this.$Message.error('修改失败！')
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
                this.getRecData(this.recId)
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
                          this.getRecData(this.recId)
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
    },
    onChangeCard (row) {
      this.itemData = row
      this.modal12 = true


    },
    onCardmainstate (e) {
      console.log(e)
      this.cardmainstate = e

    },
    cardState () {
      this.modal12 = false
      let d = {
        id: this.itemData.id,
        cardmainstate: this.cardmainstate
      }
      serverApi('/card/cardmainstatechange', d,
        response => {
          if (response.data.code === 0){
            this.$Message.success(response.data.msg)
            this.itemData.cardmainstate = this.cardmainstate
          }else{
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          console.log(error)
          this.$Message.error('修改失败！')
        }
      )
    },
    onClickExport () {
      this.recLoading = true
      this.$Message.loading({
        duration: 0,
        content: '正在生成Excel...'
      })
      let d = {
        like: this.searchKey,
        status: this.status
      }
      serverApi('/card/cardmainout', d,
        response => {
          console.log(response)
          this.$Message.destroy()
          if (response.data.code === 0) {
            if (typeof(response.data.data) === 'string') {
              downloadFile(response.data.data)
            } else {
              this.$Message.warning('返回数据格式不正确！')
            }
          } else {
            this.$Message.warning(response.data.msg)
          }
          this.recLoading = false
        },
        error => {
          this.$Message.destroy()
          console.log(error)
          this.recLoading = false
          this.$Message.warning('连接失败！')
        }
      )
    },
  }
}
</script>
<style lang="less" scoped>
</style>
