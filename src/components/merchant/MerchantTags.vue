<template>
  <div class="box">
    <Card :bordered="false" class="mb10">
      <Form :label-width="60">
        <Row>
          <Col span="24">
            <FormItem label="查询" style="margin-bottom:0">
              <Input placeholder="搜索..." style="width:200px" v-model="searchkey" clearable></Input>
              <Button
                type="primary"
                style="margin-left:12px"
                icon="ios-search"
                @click="onClickSearch"
              >搜索</Button>
              <Button type="primary" style="margin-left:12px" icon="md-add" @click="onClickAdd">新增</Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Card>
    <Card :bordered="false" style="margin-top:12px;">
      <div class="body">
        <Table :columns="columns" size="small" height="550" :data="tableData"></Table>
      </div>
    </Card>

    <!-- add -->
    <Modal v-model="addModal" width="550">
      <p slot="header" style="text-align:center">
        <span>新增</span>
      </p>
      <Form ref="addData" :model="addData" :rules="rules" :label-width="70">
        <FormItem prop="tagname" label="标签名称">
          <Input v-model="addData.tagname" placeholder="请输入"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="addModal = false">取消</Button>
        <Button type="primary" :loading="modal_loading" @click="add">提交</Button>
      </div>
    </Modal>

    <!-- edit -->
    <Modal v-model="editModal" width="550">
      <p slot="header" style="text-align:center">
        <span>修改</span>
      </p>
      <Form ref="editData" :model="editData" :rules="rules" :label-width="70">
        <FormItem prop="tagname" label="标签名称">
          <Input v-model="editData.tagname" placeholder="请输入"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="editModal = false">取消</Button>
        <Button type="primary" :loading="modal_loading" @click="edit">提交</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import serverApi from '../../axios'
export default {
  name: 'MerchantTags',
  data() {
    return {
      addModal: false,
      editModal: false,
      modal_loading: false,
      editData: {},
      addData: {
        tagname: ''
      },
      searchkey: '',
      columns: [
        {
          title: '#',
          key: 'id',
          width: 150
        },
        {
          title: '标签名称',
          key: 'tagname',
          minWidth: 300
        },
        {
          title: '创建日期',
          key: 'createtime',
          minWidth: 300
        },
        {
          title: '操作',
          key: 'id',
          align: 'center',
          width: 200,
          fixed: 'right',
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'text',
                    size: 'small',
                    icon: 'edit'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.onClickEdit(params.row)
                    }
                  }
                },
                '编辑'
              ),
              h(
                'Button',
                {
                  props: {
                    type: 'text',
                    size: 'small',
                    icon: 'trash-a'
                  },
                  on: {
                    click: () => {
                      this.remove(params.row)
                    }
                  }
                },
                '删除'
              )
            ])
          }
        }
      ],
      tableData: [],
      rules: {
        tagname: [{ required: true, message: '不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getTableData()
  },
  methods: {
    getTableData() {
      let d = {
        like: this.searchkey
      }
      this.$store.commit('pageLoading', true)
      serverApi(
        '/Orgmerchanttag/index',
        d,
        response => {
          // console.log(response)
          if (response.data.code === 0) {
            this.tableData = response.data.data
          } else {
            this.$Message.warning(response.data.msg)
          }
          this.$store.commit('pageLoading', false)
        },
        error => {
          console.log(error)
          this.$Message.error(error.data.msg)
          this.$store.commit('pageLoading', false)
        }
      )
    },
    onClickSearch() {
      this.getTableData()
    },
    onClickEdit(e) {
      this.editData = Object.assign({}, e)
      this.editModal = true
    },
    onClickAdd() {
      this.$refs.addData.resetFields()
      this.addModal = true
    },
    add() {
      this.$refs.addData.validate(valid => {
        if (valid) {
          serverApi(
            '/Orgmerchanttag/edit',
            this.addData,
            response => {
              // console.log(response)
              if (response.data.code === 0) {
                this.addModal = false
                this.getTableData()
              }
              this.$Message.info(response.data.msg)
            },
            error => {
              console.log(error)
              this.$Message.error(error.data.msg)
            }
          )
        }
      })
    },
    edit() {
      this.$refs.editData.validate(valid => {
        if (valid) {
          let d = {
            tagname: this.editData.tagname,
            id: this.editData.id
          }
          serverApi(
            '/Orgmerchanttag/edit',
            d,
            response => {
              // console.log(response)
              if (response.data.code === 0) {
                this.editModal = false
                this.getTableData()
              }
              this.$Message.info(response.data.msg)
            },
            error => {
              console.log(error)
              this.$Message.error(error.data.msg)
            }
          )
        }
      })
    },
    remove(e) {
      this.$Modal.confirm({
        title: '提示',
        content: '<p>确认删除此条信息？</p>',
        onOk: () => {
          serverApi(
            '/Orgmerchanttag/del',
            { id: e.id },
            response => {
              if (response.data.code == 0) {
                this.getTableData()
              }
              this.$Message.info(response.data.msg)
            },
            error => {
              console.log(error)
              this.$Message.error(error.data.msg)
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