<template>
  <div class="box">
    <Card :bordered="false" class="mb10">
      <Form :label-width="60">
        <Row>
          <Col span="5">
            <FormItem label="搜索" style="margin-bottom:0">
              <Input placeholder="搜索..." v-model="searchObj.like"></Input>
            </FormItem>
          </Col>
          <Col span="5">
            <FormItem label="类型" style="margin-bottom:0">
              <Select v-model="searchObj.type" clearable placeholder="选择类型" style="width:100%">
                <Option v-for="(item, index) in type" :key="index" :value="item.value">{{item.name}}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="14">
            <FormItem style="margin-bottom:0">
              <Button @click="getTableData" type="primary" :loading="isloading" icon="md-search">查询</Button>
              <Button type="primary" style="margin-left:10px" icon="md-add" @click="onClickAdd">新增</Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Card>
    <Card :bordered="false">
      <div class="table-box">
        <Table height="600" border size="small" :loading="tableLoading" :columns="columns" :data="tableData"></Table>
      </div>
    </Card>

    <!-- add -->
    <Modal v-model="addModal" width="500" :mask-closable="false">
      <p slot="header" style="text-align:center">
        <span>配置面板</span>
      </p>
      <Form ref="form" :model="form" :rules="rules" :label-width="80">
        <FormItem label="类型">
          <Select v-model="addData.type"  clearable placeholder="选择类型">
            <Option v-for="(item, index) in type" :key="index" :value="item.value">{{item.name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="配置类型" v-show="addData.type == 1">
          <Select v-model="addData.parameterid" clearable placeholder="选择类型">
            <Option v-for="(item, index) in growtype" :key="index" :value="item.value">{{item.name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="配置类型" v-show="addData.type == 2">
          <Select v-model="addData.parameterid" clearable placeholder="选择类型">
            <Option v-for="(item, index) in integraltype" :key="index" :value="item.value">{{item.name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="配置名称">
          <Input v-model="addData.parametername" placeholder="请输入"></Input>
        </FormItem>
        <FormItem label="积分/成长值">
          <Input v-model="addData.minval" placeholder="请输入"></Input>
        </FormItem>
        <FormItem label="比例">
          <Input v-model="addData.svaleval" placeholder="请输入"></Input>
        </FormItem>
        <FormItem label="开始日期">
          <DatePicker type="date" style="width: 100%" placeholder="选择日期" :value="addData.starttime" @on-change="e => {addData.starttime = e}"></DatePicker>
        </FormItem>
        <FormItem label="结束日期">
          <DatePicker type="date" style="width: 100%" placeholder="选择日期" :value="addData.endtime" @on-change="e => {addData.endtime = e}"></DatePicker>
        </FormItem>
        <FormItem label="备注">
          <Input v-model="addData.remaks" placeholder="请输入"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="addModal = false">取消</Button>
        <Button type="primary" :loading="modal_loading" @click="add">提交</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import serverApi from '../../axios'
export default {
  name: 'MemberRules',
  data () {
    return {
      tableLoading: false,
      modal_loading: false,
      page: 1,
      pagesize: 10,
      count: 0,
      tableData: [],
      columns: [
        {
          title: '#',
          key: 'id',
          width: 80
        },
        {
          title: '配置ID',
          key: 'parameterid',
        },
        {
          title: '类型',
          key: 'typename',
        },
        {
          title: '配置名称',
          key: 'parametertypename',
        },
        {
          title: '名称',
          key: 'parametername',
        },
        {
          title: '增长值',
          key: 'minval',
        },
        {
          title: '比例',
          key: 'svaleval',
        },
        {
          title: '备注',
          key: 'remaks',
        },
        {
          title: '开始时间',
          key: 'starttime',
        },
        {
          title: '结束时间',
          key: 'endtime',
        },
        {
          title: '操作',
          key: 'id',
          align: 'center',
          width: 120,
          render: (h, params) => {
            const see = h('a', {
              on: {
                click: () => {
                  this.onClickEdit(params.row)
                }
              }
            }, '编辑')
            const pri = h('a', {
              on: {
                click: () => {
                  this.onClickDel(params.row)
                }
              },
              style: {
                marginLeft: '12px',
                color: '#f90'
              }
            }, '删除')
            return h('div',[see,pri])
          }
        }
      ],
      isloading: false,
      searchObj: {
        type: '',
        like: ''
      },
      addModal: false,
      addData: {
        type: 1,
        parameterid: '',
        parametername: '',
        minval: '',
        svaleval: '',
        starttime: '',
        endtime: '',
        remaks: ''
      },
      growtype: [],
      integraltype: [],
      type: [],
    }
  },
  created () {
    this.getRules()
    this.getTableData()
  },
  methods: {
    getTableData () {
      this.tableLoading = true
      this.isloading = true
      this.searchObj.exports = ''
      serverApi('/Member/parameterlist', this.searchObj,
        response => {
          if (response.data.code === 0) {
            this.tableData = response.data.data
          } else {
            this.$Message.warning(response.data.msg)
          }
          this.tableLoading = false
          this.isloading = false
        },
        error => {
          console.log(error)
          this.tableLoading = false
          this.isloading = false
          this.$Message.error(error.toString())
        }
      )
    },
    getRules () {
      serverApi('/Member/parameteridconfig', null,
        response => {
          if (response.data.code === 0) {
            this.growtype = response.data.data.growtype
            this.integraltype = response.data.data.integraltype
            this.type = response.data.data.type
          } else {
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          this.$Message.error(error.toString())
        }
      )
    },
    onClickAdd () {
      this.addData = {
        type: 1,
        parameterid: '',
        parametername: '',
        minval: '',
        svaleval: '1',
        starttime: '',
        endtime: '',
        remaks: ''
      }
      this.addModal = true
    },
    add () {
      console.log(this.addData)
      if (!this.addData.parameterid || !this.addData.minval || !this.addData.svaleval) {
        this.$Message.warning('请输入信息！')
        return false
      }
      serverApi('/Member/parameteridedit', this.addData,
        response => {
          if (response.data.code === 0) {
            this.addModal = false
            this.getTableData()
          } else {
            this.$Message.warning(response.data.msg)
          }
          this.modal_loading = false
        },
        error => {
          this.modal_loading = false
          this.$Message.error(error.toString())
        }
      )
    },
    onClickEdit (row) {
      this.addData = row
      this.addModal = true
    },
    onClickDel (row) {
      this.$Modal.confirm({
        title: '提示',
        content: '<p>是否删除此数据？</p>',
        onOk: () => {
          serverApi('/Member/parameteriddel', {id: row.id},
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

</style>
