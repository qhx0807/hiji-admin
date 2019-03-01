<template>
  <div class="box">
    <Card :bordered="false" class="mb10">
      <div class="tips">
        <p style="font-size:14px;">
          <img src="http://cdn.cqyyy.cn/PREVIEW.svg" alt="">
          模板页配置。
          <a @click="onClickAdd"><Icon size="14" type="md-add" />新建模板页</a>
          <input class="search" v-model="searchKey" placeholder="搜索..." type="text">
        </p>
      </div>
    </Card>
    <Card :bordered="false">
      <div class="table-box">
        <Table size="small" height="550" :loading="tableLoading" :columns="columns" :data="computedTable"></Table>
      </div>
    </Card>

    <Modal v-model="addModal" width="550">
      <p slot="header" style="text-align:center">
        <span>新增页面</span>
      </p>
      <Form :model="addData" ref="form" :label-width="90">
        <FormItem label="选择城市" required>
          <Select v-model="addData.city">
            <Option value="0">通用</Option>
            <Option v-for="(item, index) in cityList" :key="index" :value="item.id">{{item.areaname}}</Option>
          </Select>
        </FormItem>
        <FormItem label="选择类型" required>
          <Select v-model="addData.type">
            <Option value="2">自定义内容</Option>
            <Option value="3">商品列表（只需维护商品ID）</Option>
          </Select>
        </FormItem>
        <FormItem label="页面标题" required>
          <Input v-model="addData.name" placeholder="请输入" />
        </FormItem>
        <FormItem label="备注信息">
          <Input v-model="addData.desc" placeholder="请输入" />
        </FormItem>
        <!-- <FormItem label="排序">
          <InputNumber :max="99999999" :min="1" v-model="addData.order"></InputNumber>
        </FormItem> -->
      </Form>
      <div slot="footer">
        <Button @click="addModal = false">取消</Button>
        <Button type="primary" :loading="modal_loading" @click="onClickSaveAdd">保存</Button>
      </div>
    </Modal>

    <Modal v-model="editModal" width="550">
      <p slot="header" style="text-align:center">
        <span>修改信息</span>
      </p>
      <Form :model="editData" ref="formedit" :label-width="80">
        <FormItem label="选择城市" required>
          <Select v-model="editData.city">
            <Option :value="0">通用</Option>
            <Option v-for="(item, index) in cityList" :key="index" :value="item.id">{{item.areaname}}</Option>
          </Select>
        </FormItem>
        <FormItem label="页面标题" required>
          <Input v-model="editData.name" placeholder="请输入" />
        </FormItem>
        <FormItem label="备注信息">
          <Input v-model="editData.desc" placeholder="请输入" />
        </FormItem>
        <FormItem label="专题图" v-if="editData.type == 3">
          <Input v-model="editData.topimg" placeholder="请输入" />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="editModal = false">取消</Button>
        <Button type="primary" :loading="modal_loading" @click="onClickSaveMod">保存</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import serverApi from '../../axios'
import { arrSearch } from '../../utlis/tools.js'
export default {
  name: 'Templates',
  data () {
    return {
      tableLoading: false,
      addModal: false,
      modal_loading: false,
      searchKey: '',
      cityList: [],
      addData: {
        name: '',
        city: '0',
        order: '0',
        desc: '',
        type: '2'
      },
      tableData: [],
      columns: [
        {
          title: '#',
          key: 'id',
          width: 60
        },
        {
          title: '城市',
          key: 'areaname',
          width: 80
        },
        {
          title: '页面标题',
          key: 'name',
          align: 'center',
        },
        {
          title: '类型',
          key: 'type',
          align: 'center',
          render: (h, params) => {
            let text = params.row.type == 2 ? '自定义内容' : '商品类表（只需商品id）'
            return h('span', null, text)
          }
        },
        {
          title: '状态',
          key: 'show',
          render: (h, params) => {
            let text = params.row.show == 1 ? '启用' : '失效'
            let color = params.row.show == 1 ? 'success' : 'warning'
            return h('Tag', {
              props: {
                color: color,
                type: 'dot'
              }
            }, text)
          }
        },
        {
          title: '备注',
          key: 'desc',
        },
        {
          title: '操作',
          key: 'swiperid',
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
                  this.onClickMod(params.row)
                }
              }
            }, '修改')
            let bj = h('a', {
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
                  this.remove(params.row.id)
                }
              }
            }, '删除')

            return h('div', [edit, del, bj])
          }
        }
      ],
      editData: {},
      editModal: false,
    }
  },
  created () {
    this.getModules()
    this.getCityList()
  },
  computed: {
    actionTypeArr () {
      return this.$store.state.actionTypeArr
    },
    computedTable () {
      if (this.searchKey) {
        return arrSearch(this.tableData, this.searchKey)
      } else {
        return this.tableData
      }
    }
  },
  methods: {
    getModules () {
      this.tableLoading = true
      serverApi('/web/webareaindex', {type: '2,3'},
        response => {
          console.log(response)
          this.tableLoading = false
          if (response.data.code === 0){
            this.tableData = response.data.data
          }else{
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          this.tableLoading = false
          console.log(error)
        }
      )
    },
    getCityList () {
      serverApi('/area/index', {},
        response => {
          if (response.data.code === 0){
            this.cityList = response.data.data
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
    },
    onClickAdd () {
      this.addModal = true
    },
    onClickSaveAdd () {
      if (!this.addData.name) {
        this.$Message.warning('请输入名称')
        return false
      }
      this.modal_loading = true
      serverApi('/web/webareaadd', this.addData,
        response => {
          if (response.data.code === 0){
            this.getModules()
            this.addModal = false
            console.log(response)
          }else{
            this.$Message.warning(response.data.msg)
          }
          this.modal_loading = false
        },
        error => {
          this.addModal = false
          console.log(error)
          this.modal_loading = false
        }
      )
    },
    onClickSaveMod () {
      if (!this.editData.name) {
        this.$Message.warning('请输入名称')
        return false
      }
      this.modal_loading = true
      serverApi('/web/webareaedit', this.editData,
        response => {
          if (response.data.code === 0){
            this.getModules()
            this.editModal = false
            console.log(response)
          }else{
            this.$Message.warning(response.data.msg)
          }
          this.modal_loading = false
        },
        error => {
          this.editModal = false
          console.log(error)
          this.modal_loading = false
        }
      )
    },
    onClickEdit (row) {
      if (row.type == 2) {
        this.$router.push({name: 'TemplatesAdd', params: {id: row.id}})
      } else if (row.type == 3) {
        this.$router.push({name: 'TemplatesGoods', params: {id: row.id, type: row.type}})
      }
    },
    onClickMod (row) {
      this.editData = Object.assign({}, row)
      this.editModal = true
    },
    remove (id) {
      this.$Modal.confirm({
        title: '提示',
        content: '<p>删除此模板页？</p>',
        onOk: () => {
          serverApi('/web/wedareadel', {id: id},
            response => {
              if (response.data.code == 0) {
                this.getModules()
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
.tips{
    p{
      img{
        vertical-align: bottom;
      }
    }
    position: relative;
    .search{
      border: none;
      border-bottom: 1px solid #ddd;
      outline: none;
      position: absolute;
      top: 5px;
      left: 240px;
      font-size: 12px;
      color: #666;
      padding: 4px 5px;
      width: 180px;
      transition: width .2s ease;
      &:hover{
        width: 200px;
        border-bottom: 1px solid #2d8cf0;
      }
    }
  }
</style>
