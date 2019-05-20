<template>
  <div class="box">
    <Card :bordered="false">
      <div>
        <Input v-model="searchKey" placeholder="搜索关键字..." style="width: 200px"></Input>
        <Button type="primary" style="margin-left:8px" icon="ios-search" @click="onClickSearch">搜索</Button>
        <Button type="primary" style="margin-left:8px" icon="md-add" @click="onClickAdd">上传</Button>
      </div>
    </Card>
    <Card :bordered="false" style="margin-top:12px">
      <div class="body">
        <Table :columns="columns" :data="tableData"></Table>
      </div>
      <div style="float: right; padding-top:12px">
        <Page :total="count" show-total :current="page" @on-change="changePage" show-sizer show-elevator @on-page-size-change="onChangeSize"></Page>
      </div>
      <div style="clear:both"></div>
    </Card>
    <!-- add -->
    <Modal v-model="addModal" width="550">
      <p slot="header" style="text-align:center">
        <span>新增</span>
      </p>
      <Form ref="form" :model="form" :rules="rules" :label-width="70">
        <FormItem label="类型名称">
          <Upload :action="uploadApiUrl" :on-success="uploadImgSucc" :on-error="uploadImgErr">
            <Button   icon="ios-cloud-upload-outline">上传图片</Button>
          </Upload>
        </FormItem>
        <FormItem prop="imgsrc" label="图片地址">
          <Input v-model="form.imgsrc" placeholder="请输入"></Input>
        </FormItem>
        <FormItem prop="imgtype" label="图片类型">
          <Select v-model="form.imgtype">
            <Option value="0">未分派</Option>
            <Option value="1">头图</Option>
            <Option value="2">明细图</Option>
          </Select>
        </FormItem>
        <FormItem prop="cardmainid" label="选择卡券">
          <Select v-model="form.cardmainid">
            <Option v-for="item in couponData" :value="item.id" :key="item.id">{{ item.cardname }}</Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button    @click="addModal = false">取消</Button>
        <Button type="primary" :loading="modal_loading" @click="add">提交</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { uploadApiUrl } from '../../config'
import serverApi from '../../axios'
export default {
  name: 'CouponImg',
  data () {
    return {
      searchKey: '',
      tableData: [],
      addModal: false,
      editModal: false,
      modal_loading: false,
      uploadApiUrl: uploadApiUrl,
      form: {
        imgsrc: '',
        imgtype: '0',
        cardmainid: ''
      },
      rules: {
        imgsrc: [{ required: true, message: '不能为空', trigger: 'blur' }],
        imgtype: [{ required: true, message: '不能为空', trigger: 'blur' }]
      },
      count: 0,
      page: 1,
      pageSize: 10,
      columns: [
        {
          title: 'ID',
          key: 'id',
          width: 90
        },
        {
          title: '预览',
          key: 'imgsrc',
          width: 120,
          render: (h, params) => {
            return h('img', {
              attrs: {
                src: params.row.imgsrc
              },
              style: {
                width: '40px',
                height: '40px'
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
          title: '所属卡券',
          key: 'cardmainid',
          minWidth: 130
        },
        {
          title: '图片类型',
          key: 'imgtype',
          minWidth: 130,
          render: (h, params) => {
            let text = ''
            if (params.row.imgtype == '0') {
              text = '未分配'
            } else if (params.row.imgtype == '1') {
              text = '头图'
            } else {
              text = '明细图'
            }
            return h('span', {} , text)
          }
        },
        {
          title: '图片地址',
          key: 'imgsrc',
          minWidth: 300
        },
        {
          title: '操作',
          key: 'id',
          align: 'center',
          width: 130,
          fixed: 'right',
          render: (h, params) => {
            return h('div', [
                h('Button', {
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
                }, '删除')
            ])
          }
        }
      ],
      editData: {},
      couponData: []
    }
  },
  created () {
    this.getTableData()
    this.getCouponData()
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
        userid: sessionStorage.userid
      }
      this.$store.commit('pageLoading', true)
      serverApi('/card/img', d,
        response => {
          // console.log(response)
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
    getCouponData () {
      let d = {
        pagesize: 99999,
        page: 1,
        userid: sessionStorage.userid
      }
      serverApi('/card/coupon', d,
        response => {
          // console.log(response)
          if (response.data.code === 0){
            this.couponData = response.data.data.result
          }else{
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          console.log(error)
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
      this.$refs.form.resetFields()
      this.addModal = true
    },
    add () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.modal_loading = true
          serverApi('/card/imgadd', this.form,
            response => {
              this.modal_loading = false
              if (response.data.code === 0) {
                this.addModal = false
                this.getTableData()
              }
              this.$Message.info(response.data.msg)
            },
            error => {
              console.log(error)
              this.modal_loading = false
              this.$Message.error('连接失败！')
            }
          )
        }
      })
    },
    remove (row) {
      this.$Modal.confirm({
        title: '提示',
        content: '<p>确认删除此条信息？</p>',
        onOk: () => {
          serverApi('/card/imgdel', {id: row.id},
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
    uploadImgSucc (response, file) {
      this.form.imgsrc = response.data.url
      this.$Message.success('上传成功！')
    },
    uploadImgErr (response, file, fileList) {
      this.$Message.warning('上传失败！')
      console.log('err'+response,file,fileList)
    }
  }
}
</script>
<style lang="less" scoped>
</style>
