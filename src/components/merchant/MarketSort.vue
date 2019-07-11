<template>
  <div class="box">
    <Card :bordered="false">
      <Row>
        <Col span="24">
          <div style="max-width: 600px">
            <Tree :data="treeData" :render="renderContent"></Tree>
          </div>
        </Col>
      </Row>
    </Card>

    <!-- add -->
    <Modal v-model="addModal" width="460">
      <p slot="header" style="text-align:center">
        <span>新增商户分类</span>
      </p>
      <Form ref="form" :model="addData" :rules="rules" :label-width="70">
        <FormItem label="上级名称">
          <Input readonly v-model="fatherName" />
        </FormItem>
        <FormItem prop="name" label="分类名称">
          <Input v-model="addData.name" placeholder="请输入分类名称"></Input>
        </FormItem>
        <FormItem required label="排序">
          <InputNumber style="width:100%" v-model="addData.sort" :max="255" :min="1"></InputNumber>
        </FormItem>
      </Form>

      <div slot="footer">
        <Button @click="addModal = false">取消</Button>
        <Button type="primary" :loading="modal_loading" @click="add">提交</Button>
      </div>
    </Modal>

    <!-- edIt -->
    <Modal v-model="editModal" width="460">
      <p slot="header" style="text-align:center">
        <span>修改分类名称</span>
      </p>
      <Form ref="form" :model="editData" :rules="rules" :label-width="70">
        <!-- <FormItem label="上级名称">
          <Input readonly v-model="fatherName"></Input>
        </FormItem>-->
        <FormItem prop="name" label="分类名称">
          <Input v-model="editData.name" placeholder="请输入分类名称"></Input>
        </FormItem>
        <FormItem required label="排序">
          <InputNumber style="width:100%" v-model="editData.sort" :max="255" :min="1"></InputNumber>
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
  name: 'MarketSort',
  data() {
    return {
      fatherName: '',
      addModal: false,
      editModal: false,
      addData: {
        name: '',
        sort: '',
        updid: ''
      },
      editData: {},
      treeData: [
        {
          title: '超市到家分类',
          expand: true,
          render: (h, { root, node, data }) => {
            return h(
              'span',
              {
                style: {
                  display: 'inline-block',
                  width: '100%'
                }
              },
              [
                h('span', [
                  h('Icon', {
                    props: {
                      type: 'ios-home'
                    },
                    style: {
                      marginRight: '8px'
                    }
                  }),
                  h('span', data.title)
                ]),
                h(
                  'span',
                  {
                    style: {
                      display: 'inline-block',
                      float: 'right',
                      marginRight: '32px'
                    }
                  },
                  [
                    h('Button', {
                      props: Object.assign({}, this.buttonProps, {
                        icon: 'ios-add',
                        type: 'primary'
                      }),
                      style: {
                        width: '100px'
                      },
                      on: {
                        click: () => {
                          //添加 蓝底
                          this.addTreeNode(data)
                        }
                      }
                    })
                  ]
                )
              ]
            )
          },
          children: []
        }
      ],
      buttonProps: {
        type: 'default',
        size: 'small'
      },
      modal_loading: false,
      rules: {
        name: [{ required: true, message: '名称不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getTableData()
  },
  methods: {
    formatData(data) {
      data.forEach(item => {
        item.title = item.name
        item.expand = true
        item.children = item.child
        if (item.child.length > 0) {
          this.formatData(item.child)
        }
      })
    },
    getTableData() {
      this.$store.commit('pageLoading', true)
      serverApi(
        '/supermarket/cateindex',
        null,
        response => {
          // console.log(response)
          if (response.data.code === 0) {
            let res = response.data.data
            this.formatData(res)
            this.treeData[0].children = res
            // console.log(this.treeData)
          } else {
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
    renderContent(h, { root, node, data }) {
      return h(
        'span',
        {
          style: {
            display: 'inline-block',
            width: '100%'
          }
        },
        [
          h('span', [
            h('Icon', {
              props: {
                type: 'ios-paper-outline'
              },
              style: {
                marginRight: '8px'
              }
            }),
            h('span', data.title)
          ]),
          h(
            'span',
            {
              style: {
                display: 'inline-block',
                float: 'right',
                marginRight: '32px'
              }
            },
            [
              h('Button', {
                props: Object.assign({}, this.buttonProps, {
                  icon: 'ios-add'
                }),
                style: {
                  marginRight: '8px'
                },
                on: {
                  click: () => {
                    this.addTreeNode(data)
                  }
                }
              }),
              h('Button', {
                props: Object.assign({}, this.buttonProps, {
                  icon: 'ios-build-outline'
                }),
                style: {
                  marginRight: '8px'
                },
                on: {
                  click: () => {
                    this.editTreeNode(data)
                  }
                }
              }),
              h('Button', {
                props: Object.assign({}, this.buttonProps, {
                  icon: 'ios-remove'
                }),
                on: {
                  click: () => {
                    this.delTreeNode(root, node, data)
                  }
                }
              })
            ]
          )
        ]
      )
    },
    add() {
      if (!this.addData.name) {
        this.$Message.warning('请输入分类名称！')
        return false
      }
      this.modal_loading = true
      serverApi(
        '/supermarket/cateadd',
        this.addData,
        response => {
          // console.log(response)
          if (response.data.code === 0) {
            this.getTableData()
            this.$Message.success(response.data.msg)
            this.addModal = false
          } else {
            this.$Message.warning(response.data.msg)
          }
          this.modal_loading = false
        },
        error => {
          this.modal_loading = false
          console.log(error)
          this.$Message.error(error.toString())
        }
      )
    },
    edit() {
      if (!this.editData.name) {
        this.$Message.warning('请输入分类名称！')
        return false
      }
      this.modal_loading = true
      serverApi(
        '/supermarket/cateadd',
        this.editData,
        response => {
          if (response.data.code === 0) {
            this.getTableData()
            this.$Message.success(response.data.msg)
            this.editModal = false
          } else {
            this.$Message.warning(response.data.msg)
          }
          this.modal_loading = false
        },
        error => {
          this.modal_loading = false
          console.log(error)
          this.$Message.error(error.toString())
        }
      )
    },
    addTreeNode(e) {
      // if (!e.id) {
      //   this.addData.updid = 0
      // } else {
      //   this.addData.updid = e.id
      // }
      ;(e.id && (this.addData.updid = e.id)) || (this.addData.updid = 0)
      // console.log(e)
      this.addData.name = ''
      this.addData.sort = e.children.length + 1
      this.fatherName = e.title
      this.addModal = true
    },
    editTreeNode(e) {
      // console.log(e)
      this.editData = e
      this.editModal = true
    },
    delTreeNode(root, node, data) {
      this.$Modal.confirm({
        title: '提示',
        content: '确认删除此分类？',
        loading: true,
        onOk: () => {
          serverApi(
            '/supermarket/catedel',
            { id: data.id },
            response => {
              if (response.data.code === 0) {
                this.getTableData()
                this.$Message.success(response.data.msg)
              } else {
                this.$Message.warning(response.data.msg)
              }
              this.$Modal.remove()
            },
            error => {
              this.$Modal.remove()
              console.log(error)
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
