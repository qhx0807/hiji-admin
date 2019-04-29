<template>
  <div class="box">
    <Card :bordered="false" class="mb10">
      <Input v-model="searchKey" placeholder="搜索..." style="width: 230px" />
      <Button type="primary" icon="md-add" style="margin-left:12px" @click="onClickAdd">新增</Button>
      <Button type="primary" icon="md-add" style="margin-left:12px" @click="permissions">权限按钮</Button>
    </Card>
    <Card :bordered="false">
      <Table :loading="tableLoading" :columns="columns" height="560" :data="tableData"></Table>
      <div style="float: right; padding-top:12px">
        <Page :total="count" show-total :current="page" @on-change="changePage" ></Page>
      </div>
      <div style="clear:both"></div>
    </Card>

    <Modal v-model="editModal" width="850">
      <p slot="header" style="text-align:center">
        <span>编辑规则</span>
      </p>
      <Form :model="editData" ref="form" :rules="rules" :label-width="70">
        <Row>
          <Col span="8">
            <FormItem label="开始时间" prop="starttime">
              <Input v-model="editData.starttime"></Input>
            </FormItem>
            <FormItem label="奖励名称" >
              <Input v-model="editData.goodsname"></Input>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="结束时间" prop="endtime">
              <Input v-model="editData.endtime"></Input>
            </FormItem>
            <FormItem label="邀请人数" >
              <Input v-model="editData.invitenum"></Input>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="状态" prop="ison">
              <Select v-model="editData.ison" placeholder="请选择">
                <Option :value="1">启用</Option>
                <Option :value="0">关闭</Option>
              </Select>
            </FormItem>
            <FormItem label="奖品ID" >
              <Input v-model="editData.prizeid"></Input>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button @click="editModal = false">取消</Button>
        <Button type="primary" :loading="modal_loading" @click="onSaveEdit">保存</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import serverApi from '../../axios'
export default {
  name: 'InvitePrize',
  data () {
    return {
      searchKey: '',
      tableLoading: false,
      editModal: false,
      modal_loading: false,
      tableData: [],
      count: 0,
      page: 1,
      columns: [
        {
          title: '#',
          key: 'id',
          width: 80,
        },
        {
          title: '城市',
          key: 'cityid',
        },
        // {
        //   title: '邀请人数',
        //   key: 'invitenum',
        //   width: 80
        // },
        // {
        //   title: '奖励对象',
        //   key: 'invitetype',
        //   width: 100,
        //   render: (h, params) => {
        //     return h('span', {}, params.row.invitetype == 1 ? '邀请人' : '被邀请人' )
        //   }
        // },
        // {
        //   title: '奖励类型',
        //   key: 'type',
        //   width: 80
        // },
        // {
        //   title: '奖励内容',
        //   key: 'goodsname',
        //   minWidth: 200,
        //   render: (h, params) => {
        //     let img = h('img', {
        //       attrs: {
        //         src: params.row.goodsimg
        //       },
        //       style: {
        //         maxWidth: '45px',
        //         maxHeight: '50px'
        //       },
        //       directives: [
        //         {
        //           name: 'imgview'
        //         }
        //       ]
        //     })
        //     let text = h('span', null, params.row.goodsname)
        //     return h('div', [img, text])
        //   }
        // },
        // {
        //   title: '奖励数量',
        //   key: 'num',
        //   width: 80,
        // },
        // {
        //   title: '收取运费',
        //   key: 'isshipping',
        //   width: 100,
        //   render: (h, params) => {
        //     return h('span', {}, params.row.isshipping == 0 ? '不收取' : '收取')
        //   }
        // },
        // {
        //   title: '运费',
        //   key: 'shippingamout',
        //   width: 100,
        // },
        {
          title: '开始时间',
          key: 'starttime',
        },
        {
          title: '结束时间',
          key: 'endtime',
        },
        {
          title: '状态',
          key: 'ison',
          render: (h, params) => {
            let text = params.row.ison == 1 ? '启用' : '关闭'
            let color = params.row.ison == 1 ? 'success' : 'warning'
            return h('Tag', {
              props: {
                color: color,
                type: 'dot'
              }
            }, text)
          }
        },
        {
          title: '操作',
          key: 'id',
          width: 100,
          align: 'center',
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
        },
      ],
      editData: {},
      rules: []
    }
  },
  created () {
    this.getTableData()
    this.getTableData12()
  },
  computed: {
    inviteTypeArr () {
      return this.$store.state.inviteTypeArr
    }
  },
  methods: {
    getTableData () {
      let d = {
        page: this.page
      }
      this.tableLoading = true
      serverApi('/activity/inviteindexnew', d,
        response => {
          console.log(response)
          if (response.data.code === 0){
            this.count = response.data.data.count
            this.tableData = response.data.data.result
          }else{
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
    onClickEdit (row) {
      this.$router.push({name: 'InvitePrizeEdit', params: {id: row.id}})
      // this.$Message.loading({
      //   content: 'Loading...',
      //   duration: 0
      // })
      // serverApi('/activity/inviteinfonew', {id: row.id},
      //   response => {
      //     this.$Message.destroy()
      //     if (response.data.code === 0) {
      //       console.log(response)
      //       this.editData = response.data.data
      //       this.editModal = true
      //     } else {
      //       this.$Message.warning(response.data.msg)
      //     }
      //   },
      //   error => {
      //     this.$Message.destroy()
      //     this.$Message.error(error.toString())
      //     console.log(error)
      //   }
      // )
    },
    remove (row) {
      this.$Modal.confirm({
        title: '提示',
        content: '确定删除此条规则？',
        loading: true,
        onOk: () => {
          row.isuse = 0
          row.invitemsg = JSON.stringify(row.invitemsg)
          serverApi('/activity/invitedel', {id: row.id},
            response => {
              if (response.data.code === 0) {
                this.$Message.success(response.data.msg)
                this.getTableData()
              } else {
                this.$Message.warning(response.data.msg)
              }
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
    onClickAdd () {
      this.$router.push({name: 'InvitePrizeAdd'})
    },
    onSaveEdit () {
      let d = {
        "type": this.editData.type,
        "num":  this.editData.num,
        "prizeid": this.editData.prizeid,
        "goodstypeid": this.editData.goodstypeid,
        "isshipping": this.editData.isshipping,
        "shippingamout": this.editData.shippingamout,
        "invitenum": this.editData.invitenum,
        "invitetype": this.editData.invitetype,
        "goodsname": this.editData.goodsname,
        "goodsimg": this.editData.goodsimg,
      }
      this.editData.invitemsg = JSON.stringify(d)
      serverApi('/activity/inviteadd', this.editData,
        response => {
          if (response.data.code === 0) {
            this.$Message.success(response.data.msg)
            this.getTableData()
          } else {
            this.$Message.warning(response.data.msg)
          }
          this.editModal = false
        },
        error => {
          this.editModal = false
          this.$Message.error(error.toString())
        }
      )
    },
    changePage (e) {
      this.page = e
      this.getTableData()
    },
    permissions () {
      let d = {
        menuid: 55,
        button: '新增',
        explain: '邀请有礼包新增按钮'
      }
      serverApi('/rolebutton/edit', d,
        response => {
          if (response.data.code === 0) {
            this.$Message.success(response.data.msg)
          } else {
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          this.$Message.error(error.toString())
        }
      )
    },
    getTableData12 () {
      this.$store.commit('pageLoading', true)
      let userid = sessionStorage.userid
      serverApi('/menu/index', {userid, userid},
        response => {
          console.log(response)
          if (response.data.code === 0){
            getCas(cas)
            cas.push({
              label: '根目录菜单',
              value: '1'
            })
            this.casData = cas
          }else{
            this.$Message.warning(response.data.msg)
          }
          this.$store.commit('pageLoading', false)
        },
        error => {
          console.log(error)
          this.$store.commit('pageLoading', false)
        }
      )
    }
  }
}
</script>
<style lang="less" scoped>

</style>
