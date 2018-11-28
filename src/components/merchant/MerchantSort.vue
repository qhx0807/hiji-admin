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
          <Input readonly v-model="fatherName"></Input>
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

  </div>
</template>
<script>
import serverApi from '../../axios'
export default {
  name: 'MerchantSort',
  data () {
    return {
      addModal: false,
      modal_loading: false,
      addData: {
        name: '',
        updid: '',
        sort: 1
      },
      fatherName: '',
      rules: {
        name: [{ required: true, message: '名称不能为空', trigger: 'blur' }]
      },
      tableData: [],
      casData: [],
      treeData: [
        {
          title: '商户分类',
          expand: true,
          render: (h, { root, node, data }) => {
              return h('span', {
                  style: {
                    display: 'inline-block',
                    width: '100%'
                  }
              }, [
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
                h('span', {
                  style: {
                    display: 'inline-block',
                    float: 'right',
                    marginRight: '32px'
                  }
                }, [
                  h('Button', {
                    props: Object.assign({}, this.buttonProps, {
                      icon: 'ios-add',
                      type: 'primary'
                    }),
                    style: {
                      width: '64px'
                    },
                    on: {
                      click: () => { this.addTreeNode(data) }
                    }
                  })
                ])
              ])
            },
          children: []
      }
      ],
      buttonProps: {
        type: 'default',
        size: 'small',
      }
    }
  },
  created () {
    this.getTableData()
  },
  methods: {
    getCas (arr) {
      arr.forEach(item => {
        item.title = item.name,
        item.children = item.child
        item.expand = true
        if (item.child.length > 0) {
          this.getCas(item.child)
        }
      })
    },
    getTableData () {
      this.$store.commit('pageLoading', true)
      serverApi('/merchant/cateindex', null,
        response => {
          // console.log(response)
          if (response.data.code === 0){
            this.tableData = response.data.data
            let cas = response.data.data
            this.getCas(cas)
            this.casData = cas
            this.treeData[0].children = cas
            console.log(this.treeData[0].children);
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
    renderContent (h, { root, node, data }) {
      return h('span', {
        style: {
            display: 'inline-block',
            width: '100%'
        }
      }, [
          h('span', [
            h('Icon', {
                props: {
                    type: 'ios-home-outline'
                },
                style: {
                    marginRight: '8px'
                }
            }),
            h('span', data.title)
          ]),
          h('span', {
            style: {
              display: 'inline-block',
              float: 'right',
              marginRight: '32px'
            }
          }, [
              h('Button', {
                props: Object.assign({}, this.buttonProps, {
                  icon: 'ios-add'
                }),
                style: {
                  marginRight: '8px'
                },
                on: {
                  click: () => { this.addTreeNode(data) }
                }
              }),
              h('Button', {
                props: Object.assign({}, this.buttonProps, {
                    icon: 'ios-remove'
                }),
                on: {
                    click: () => { this.delTreeNode(root, node, data) }
                }
              })
          ])
      ])
    },
    addTreeNode (data) {
      console.log(data)
      if (!data.id) {
        this.addData.updid = 0
      } else {
        this.addData.updid = data.id
      }
      this.addData.name = ''
      this.addData.sort = 1
      this.fatherName = data.title
      this.addModal = true
    },
    delTreeNode (root, node, data) {
      this.$Modal.confirm({
        title: '提示',
        content: '确认删除此分类？',
        loading: true,
        onOk: () => {
          serverApi('/merchant/catedel', {id: data.id},
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
    },
    add () {
      console.log(this.addData)
      if (!this.addData.name) {
        this.$Message.warning('请输入分类名称！')
        return false
      }
      this.modal_loading = true
      serverApi('/merchant/cateadd', this.addData,
        response => {
          if (response.data.code === 0) {
            this.getTableData()
            this.addModal = false
            this.$Message.success(response.data.msg)
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
    }
  }
}
</script>
<style lang="less" scoped>

</style>
