<template>
  <div class="box">
    <Card :bordered="false" class="mb10">
      <div class="tips">
        <p style="font-size:14px;">
          <img src="http://cdn.cqyyy.cn/PREVIEW.svg" alt="">
          Banner 轮播图配置。图片，跳转action.&nbsp;&nbsp;&nbsp;
          <router-link :to="{name: 'BannerAdd'}"><Icon size="14" type="md-add" />新建Banner图</router-link>
        </p>
      </div>
    </Card>
    <Card :bordered="false">
      <div class="table-box">
        <Table size="small" :loading="tableLoading" :columns="columns" :data="tableData"></Table>
      </div>
    </Card>
    <div class="phonepreview">
      <!-- <img src="http://cdn.cqyyy.cn/PREVIEW.svg" alt=""> -->
      <Carousel loop autoplay radius-dot>
        <CarouselItem v-for="(item, index) in tableData" :key="index">
            <div class="demo-carousel">
              <img :src="item.imgurl" alt="">
            </div>
        </CarouselItem>
      </Carousel>
      <p>预览</p>
    </div>
    <Modal v-model="editModal" width="550">
      <p slot="header" style="text-align:center">
        <span>修改信息</span>
      </p>
      <Form :model="editData" ref="form" :label-width="80">
        <FormItem label="选择城市" required>
          <Select v-model="editData.city">
            <Option :value="0">通用</Option>
            <Option v-for="(item, index) in cityList" :key="index" :value="item.id">{{item.areaname}}</Option>
          </Select>
        </FormItem>
        <FormItem label="图片地址" required>
          <Upload
            :action="uploadApiUrl"
            :on-error="uploadImgErr"
            :on-success="uploadImgSucc"
            :show-upload-list="false"
            accept="image/*"
            >
            <div slot="tip" style="margin-top:10px;">
              <Input v-model="editData.imgurl" placeholder="或者直接输入图片连接地址" />
            </div>
            <Button icon="ios-cloud-upload-outline">Upload files</Button>
          </Upload>
        </FormItem>
        <!-- <FormItem label="图片地址" required>
          <Input v-model="editData.imgurl" placeholder="图片连接地址" />
        </FormItem> -->
        <FormItem label="跳转类型" required>
          <Select v-model="editData.urltype">
            <Option v-for="(item, index) in actionTypeArr" :key="index" :value="item.value">{{item.label}}</Option>
          </Select>
        </FormItem>
        <FormItem label="跳转地址">
            <Input v-model="editData.url" placeholder="请输入" />
          </FormItem>
          <FormItem label="排序">
            <InputNumber :max="99999999" :min="1" v-model="editData.sort"></InputNumber>
          </FormItem>
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
import { uploadApiUrl } from '../../config/'
export default {
  name: 'BannerConfig',
  data () {
    return {
      tableLoading: false,
      modal_loading: false,
      uploadApiUrl: uploadApiUrl,
      tableData: [],
      cityList: [],
      columns: [
        {
          title: '#',
          key: 'swiperid',
          width: 60
        },
        {
          title: '城市',
          key: 'cityname',
          width: 80
        },
        {
          title: '图片',
          key: 'imgurl',
          align: 'center',
          width: 170,
          render: (h, params) => {
            return h('img', {
              attrs: {
                src: params.row.imgurl
              },
              style: {
                maxWidth: '150px',
                maxHeight: '70px',
                margin: '4px 0'
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
          title: '跳转地址',
          key: 'url',
        },
        {
          title: '跳转类型',
          key: 'urltype',
          render: (h, params) => {
            let obj = this.actionTypeArr.find((item) => {
              return item.value == params.row.urltype
            })
            return ('div', {}, obj.label)
          }
        },
        {
          title: '排序',
          key: 'sort',
          width: 80
        },
        {
          title: '状态',
          key: 'sort',
        },
        {
          title: '操作',
          key: 'swiperid',
          align: 'center',
          width: 120,
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
                  this.remove(params.row.swiperid)
                }
              }
            }, '删除')

            return h('div', [edit, del])
          }
        }
      ],
      editData: {},
      editModal: false,
    }
  },
  created () {
    this.getTableData()
  },
  computed: {
    actionTypeArr () {
      return this.$store.state.actionTypeArr
    }
  },
  mounted () {
    this.getCityData()
  },
  methods: {
    getTableData () {
      this.tableLoading = true
      let d = {
        page: 1,
        pagesize: 99999,
        type: '1'
      }
      serverApi('/web/index', d,
        response => {
          console.log(response)
          this.tableLoading = false
          if (response.data.code === 0) {
            this.tableData = response.data.data.result
          } else {
            this.$Message.warning(response.data.msg)
          }
          console.log(response)
        },
        error => {
          this.tableLoading = false
          console.log(error)
          this.$Message.error(error.toString())
        }
      )
    },
    getCityData () {
      serverApi('/area/index', {},
        response => {
          if (response.data.code === 0){
            this.cityList = response.data.data
          }else{
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          console.log(error)
        }
      )
    },
    uploadImgErr (response, file, fileList) {
      this.$Message.warning('上传失败！')
      console.log('err'+response,file,fileList)
    },
    uploadImgSucc (response, file) {
      console.log(response)
      if (response.code == 0) {
        this.$Notice.success({
          title: '上传成功',
          desc: '图片上传成功！'
        })
        let url = response.data.url
        this.editData.imgurl = url
      }
    },
    onClickEdit (row) {
      console.log(row)
      this.editData = Object.assign({}, row)
      this.editModal = true
    },
    onSaveEdit () {
      if (!this.editData.imgurl) {
        this.$Message.warning('图片连接不能为空')
        return false
      }
      if (!this.editData.urltype) {
        this.$Message.warning('请选择链接类型')
        return false
      }
      this.modal_loading = true
      serverApi('/web/webedit', this.editData,
        response => {
          console.log(response)
          this.modal_loading = false
          if (response.data.code === 0){
            this.$Message.success(response.data.msg)
            this.getTableData()
            this.editModal = false
          }else{
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          console.log(error)
          this.modal_loading = false
          this.$Message.error(error.toString())
        }
      )
    },
    remove (id) {
      this.$Modal.confirm({
        title: '提示',
        content: '<p>将此商品从促销商品中移除？</p>',
        onOk: () => {
          serverApi('/web/webdel', {swiperid: id},
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
.box{
  .phonepreview{
    position: fixed;
    z-index: 99;
    right: 10px;
    top: 170px;
    width: 370px;
    height: 220px;
    border-radius: 3px;
    background-color: #fff;
    box-shadow: 0 2px 2px 0 rgba(0,0,0,0.16), 0 0 0 1px rgba(0,0,0,0.08);
    .demo-carousel{
      height: 200px;
      img{
        height: 100%;
        width: 100%;
      }
    }
    p{
      text-align: center;
    }
  }
  .tips{
    p{
      img{
        vertical-align: bottom;
      }
    }
  }
  .table-box{
    padding-right: 370px;
  }
}
</style>
