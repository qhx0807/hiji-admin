<style lang="less">
@import './auctionG.less';
</style>

<template>
<div class="auctionG">
  <div class="title">
    <h2>拍卖品管理</h2>
  </div>
 <div class="head">
      <Button type="primary" @click="onClickAdd">新增</Button>
 </div>
    <Row>
      <Col span="24">
        <zk-table class="tableBox"
            :data="tableData"
            show-index
            :tree-type="false"
            :selection-type="false"
            :expand-type="false"
            :columns="columns">
            <template slot="doing" slot-scope="scope">
              <div>
                <Button  icon="md-create" size="small" type="text"  @click="edit(scope.row)">修改</Button>
                <Button  icon="ios-trash" size="small" type="text" @click="del(scope.row.id)">删除</Button>
              </div>
            </template>
            <template>
              <img :src="scope.pic" alt="">
            </template>
          </zk-table>
      </Col>
    </Row>

    <!-- add -->
    <Modal v-model="addModal" width="460">
      <p slot="header" style="text-align:center">
        <span>新增拍卖品</span>
      </p>
      <template>
    <div class="demo-upload-list" v-for="item in uploadList">
        <template v-if="item.status === 'finished'">
            <img :src="item.url">
            <div class="demo-upload-list-cover">
                <Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon>
                <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
            </div>
        </template>
        <template v-else>
            <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
        </template>
    </div>
    <Upload
        ref="upload"
        :show-upload-list="false"
        :default-file-list="defaultList"
        :on-success="handleSuccess"
        :format="['jpg','jpeg','png']"
        :max-size="2048"
        :on-format-error="handleFormatError"
        :on-exceeded-size="handleMaxSize"
        :before-upload="handleBeforeUpload"
        multiple
        type="drag"
        action="//jsonplaceholder.typicode.com/posts/"
        style="display: inline-block;width:58px;">
        <div style="width: 58px;height:58px;line-height: 58px;">
            <Icon type="camera" size="20"></Icon>
        </div>
    </Upload>
    <Modal title="View Image" v-model="visible">
        <img :src="'https://o5wwk8baw.qnssl.com/' + imgName + '/large'" v-if="visible" style="width: 100%">
    </Modal>
    </template>
      <Form ref="form" :model="form" :rules="rules" :label-width="80">
        <FormItem prop="goodsname" label="商品名称">
          <Input v-model="form.goodsname" placeholder="请输入商品名称"></Input>
        </FormItem>
        <FormItem prop="discribe" label="商品描述">
          <Input v-model="form.discribe" placeholder="请输入商品描述"></Input>
        </FormItem>
        <FormItem prop="initialprice" label="底价">
          <Input v-model="form.initialprice" placeholder="请输入底价"></Input>
        </FormItem>
        <FormItem prop="increaseprice" label="加价">
          <Input v-model="form.increaseprice" placeholder="请输入加价"></Input>
        </FormItem>
        <FormItem prop="price" label="现价">
          <Input v-model="form.price" placeholder="请输入现价"></Input>
        </FormItem>
        <FormItem prop="starttime" label="活动开始时间">
          <Input v-model="form.starttime" placeholder="请输入活动开始时间"></Input>
        </FormItem>
        <FormItem prop="endtime" label="活动结束时间">
          <Input v-model="form.endtime" placeholder="请输入活动结束时间"></Input>
        </FormItem>
        <FormItem prop="delayed" label="延时时间">
          <Input v-model="form.delayed" placeholder="请输入延时时间"></Input>
        </FormItem>

      </Form>
      <div slot="footer">
        <Button    @click="addModal = false">取消</Button>
        <Button type="primary" :loading="modal_loading" @click="add">提交</Button>
      </div>
    </Modal>

    <!-- edit -->
   <Modal v-model="editModal" width="460">
      <p slot="header" style="text-align:center">
        <span>编辑拍卖品</span>
      </p>
      <Form :model="editData" :rules="rules" :label-width="80">
        <FormItem prop="name" label="用户名">
          <Input v-model="editData.name" placeholder="请输入用户名" disabled></Input>
        </FormItem>

      </Form>
      <div slot="footer">
        <Button    @click="addModal = false">取消</Button>
        <Button type="primary" :loading="modal_loading" @click="save">提交</Button>
      </div>
    </Modal>
</div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'auctiong',
  data() {
    return {
      loading: false,
      addModal: false,
      editModal: false,
      modal_loading: false,
      tableData: [],
      editData: {},
      form: {
        name: '',
        pass: '',
        tel: '',
        contacts: '',
        company: ''
      },
      rules: {
        name: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
        pass: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
        tel: [{ required: true, message: '联系电话不能为空', trigger: 'blur' }],
        contacts: [
          { required: true, message: '联系人不能为空', trigger: 'blur' }
        ],
        company: [
          { required: true, message: '所在公司不能为空', trigger: 'blur' }
        ]
      },
      columns: [
        {
          label: 'id',
          prop: 'id'
        },
        {
          label: '商品名',
          prop: 'goodsname'
        },
        {
          label: '商品描述',
          prop: 'describe'
        },
        {
          label: '商品图片',
          prop: 'pic'
        },
        {
          label: '底价',
          prop: 'initialprice'
        },
        {
          label: '加价',
          prop: 'increaseprice'
        },
        {
          label: '现价',
          prop: 'price'
        },
        {
          label: '开始时间',
          prop: 'starttime'
        },
        {
          label: '结束时间',
          prop: 'endtime'
        },
        {
          label: '延时的固定时间',
          prop: 'delayed'
        },

        {
          label: '操作',
          prop: 'doing',
          type: 'template',
          template: 'id',
          width: '200px'
        }
      ],

      defaultList: [],
      imgName: '',
      visible: false,
      uploadList: []
    }
  },
  created() {
    // this.getData();
  },
  methods: {
    getData: function() {
      axios
        .post('http://server.cqyyy.cn/index.php/activity/manage/index', {url: '123'})
        .then(res => {
          console.log(res)
          if (res.data.code == 0) {
            console.log(res.data.data)
            this.tableData = res.data.data
          }
        })
        .catch(function(err) {
          console.log(err)
        })
    },
    onClickAdd() {
      this.addModal = true
    },
    edit(data) {
      this.editModal = true
      console.log(data)
      this.editData = Object.assign({}, data)
    },
    save() {
      this.modal_loading = true
      axios
        .post(
          'http://server.cqyyy.cn/index.php/activity/manage/edituser',
          this.editData
        )
        .then(res => {
          this.modal_loading = false
          if (res.data.code === 0) {
            this.editModal = false
            this.getData()
          }
          this.$Message.info(res.data.msg)
        })
        .catch(err => {
          console.log(err)
          this.modal_loading = false
        })
    },
    add() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.modal_loading = true
          console.log(this.form)
          axios
            .post(
              'http://server.cqyyy.cn/index.php/activity/manage/adduser',
              this.form
            )
            .then(res => {
              this.modal_loading = false
              if (res.data.code === 0) {
                this.addModal = false
                this.getData()
              }
              this.$Message.info(res.data.msg)
            })
            .catch(err => {
              console.log(err)
              this.modal_loading = false
            })
        }
      })
    },
    del(id) {
      if (id) {
        this.$Modal.confirm({
          title: '提示',
          content: '<p>确认删除此条信息？</p>',
          onOk: () => {
            axios
              .post('http://server.cqyyy.cn/index.php/activity/manage/deluser', {
                id: id
              })
              .then(res => {
                if (res.data.code === 0) {
                  this.getData()
                }
                this.$Message.info(res.data.msg)
              })
              .catch(err => {
                console.log(err)
                this.$Message.error('链接失败！')
              })
          }
        })
      }
    },
    handleView(name) {
      this.imgName = name
      this.visible = true
    },
    handleRemove(file) {
      const fileList = this.$refs.upload.fileList
      this.$refs.upload.fileList.splice(fileList.indexOf(file), 1)
    },
    handleSuccess(res, file) {
      file.url =
        'https://o5wwk8baw.qnssl.com/7eb99afb9d5f317c912f08b5212fd69a/avatar'
      file.name = '7eb99afb9d5f317c912f08b5212fd69a'
    },
    handleFormatError(file) {
      this.$Notice.warning({
        title: 'The file format is incorrect',
        desc:
          'File format of ' + file.name + ' is incorrect, please select jpg or png.'
      })
    },
    handleMaxSize(file) {
      this.$Notice.warning({
        title: 'Exceeding file size limit',
        desc: 'File  ' + file.name + ' is too large, no more than 2M.'
      })
    },
    handleBeforeUpload() {
      const check = this.uploadList.length < 5
      if (!check) {
        this.$Notice.warning({
          title: 'Up to five pictures can be uploaded.'
        })
      }
      return check
    }
  }
}
</script>
