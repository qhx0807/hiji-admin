<template>
  <div class="box">
    <Card :bordered="false" class="mb10">
      <Form ref="form" :label-width="80">
        <Row>
          <Col span="4">
            <FormItem label="商品名称" style="margin-bottom: 0;">
              <Input v-model="warename" placeholder="请输入商品名称" clearable/>
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem label="商品/卡券/活动ID" style="margin-bottom: 0;">
              <Input v-model="wareid" placeholder="商品ID/卡券ID/活动ID" clearable/>
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem label="商品类型" style="margin-bottom: 0;">
              <Input v-model="waretype" placeholder="请输入商品类型" clearable/>
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem label="会员等级" style="margin-bottom: 0;">
              <Input v-model="gradeid" placeholder="请输入会员等级" clearable/>
            </FormItem>
          </Col>
          <Col span="4">
          <Button type="primary" icon="md-search" style="margin-left:12px" @click="onClickQuery">确认查询</Button>
          <Button type="primary" icon="md-add" style="margin-left:12px" @click="onClickAdd">新增</Button>
        </Col>
        </Row>
      </Form>
    </Card>
    <Card :bordered="false">
      <div class="table-box">
        <Table size="small" :loading="tableLoading" :columns="columns" :data="tableData"></Table>
      </div>
      <div style="float: right; padding-top:12px">
        <Page :total="count" show-total :current="page" @on-change="changePage" show-sizer @on-page-size-change="onChangeSize"></Page>
      </div>
      <div style="clear:both"></div>
    </Card>
    <!-- 新增 -->
    <Modal v-model="addModal" width="500">
      <p slot="header" style="text-align:center">
        <span>新增</span>
      </p>
      <Form :model="addData" ref="form" :label-width="120">
        <Row>
          <Col span="24">
            <FormItem label="商品名称">
              <Input v-model="addData.warename" placeholder="请输入商品名称" clearable style="width: 300px"/>
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem label="商品/卡券/活动ID">
              <Input v-model="addData.wareid" placeholder="商品ID/卡券ID/活动ID" clearable style="width: 300px"/>
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem label="商品类型">
              <Input v-model="addData.waretype" placeholder="请输入商品类型" clearable style="width: 300px"/>
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem label="会员等级">
              <Input v-model="addData.gradeid" placeholder="请输入会员等级" clearable style="width: 300px"/>
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem label="购买类型">
              <Input v-model="addData.buytype" placeholder="请输入购买类型" clearable style="width: 300px"/>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button @click="addModal = false">取消</Button>
        <Button type="primary" :loading="modal_loading" @click="onSave">发送</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import serverApi from '../../axios'
export default {
  name: 'MemberPower',
  data () {
    return {
      tableLoading: false,
      addModal: false,
      searchKey: '',
      count: 0,
      page: 1,
      pagesize: 10,
      tableData: [],
      addData: {},
      wareid: '',
      waretype: '',
      gradeid: '',
      warename: '',
      columns: [
        {
          title: '#',
          key: 'id',
          width: 60
        },
        {
          title: '商品名称',
          key: 'warename',
        },
        {
          title: '商品类型',
          key: 'waretype',
        },
        {
          title: '购买类型',
          key: 'buytype',
        },
        {
          title: '会员等级',
          key: 'gradeid',
        },
        {
          title: '商品/卡劵/活动ID',
          key: 'wareid',
        },
        {
          title: '操作',
          fixed: 'right',
          width: 100,
          render: (h, params) => {
            // let edit =  h('a', {
            //   on: {
            //     click: () => {
            //       this.onClickEdit(params.row)
            //     }
            //   }
            // }, '编辑')
            let del =  h('a', {
              style: {
                marginLeft: '12px',
                color: '#f90'
              },
              on: {
                click: () => {
                  this.onClickDel(params.row)
                }
              }
            }, '删除')
            return h('div', [del])
          }
        },
      ]
    }
  },
  created () {
    this.getTableData()
  },
  methods: {
    changePage (e) {
      this.page = e
      this.getTableData()
    },
    onChangeSize (e) {
      this.pageSize = e
      this.getTableData()
    },
    getTableData () {
      this.tableLoading = true
      let d = {
        wareid: '',
        waretype: '',
        gradeid: '',
        warename: '',
        page: this.page,
        pagesize: this.pagesize,
      }
      serverApi('/member/governlist', d,
        response => {
          if (response.data.code === 0) {
            console.log(response)
            this.count = response.data.data.total
            this.tableData = response.data.data.data
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
    onClickEdit (row) {
      this.$router.push({name: 'AfterScancodePayEdit', params: {id: row.codepayid}})
    },
    onClickAdd () {
      this.addModal = true
    },
    onClickDel (row) {
      this.$Modal.confirm({
        title: '提示',
        content: '<p>确认删除此条记录？</p>',
        onOk: () => {
          serverApi('/member/governdel', {id: row.id},
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
    onClickQuery () {
      this.getTableData()
    },
    onSave () {
      serverApi('/member/governadd', this.addData,
        response => {
          if (response.data.code === 0) {
            console.log(response)
          } else {
            this.$Message.warning(response.data.msg)
          }
          this.tableLoading = false
          this.addModal = false
        },
        error => {
          console.log(error)
          this.tableLoading = false
          this.addModal = false
          this.$Message.error(error.toString())
        }
      )
    }
  }
}
</script>
<style lang="less" scoped>

</style>
