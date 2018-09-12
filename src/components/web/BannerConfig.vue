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
      <Form :model="editData" ref="form" :label-width="100">
        <FormItem label="选择城市" required>
          <Select v-model="editData.city">
            <Option :value="0">通用</Option>
            <Option v-for="(item, index) in cityList" :key="index" :value="item.id">{{item.areaname}}</Option>
          </Select>
        </FormItem>
        <FormItem label="图片地址" required>
          <Input v-model="editData.imgurl" placeholder="图片连接地址" />
        </FormItem>
        <FormItem label="跳转类型" required>
          <Select v-model="editData.urltype">
            <Option :value="1">商品详情</Option>
            <Option :value="2">卡券详情</Option>
            <Option :value="5">模板页</Option>
            <Option :value="4">外部链接</Option>
            <Option :value="3">内部路由</Option>
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
export default {
  name: 'BannerConfig',
  data () {
    return {
      tableLoading: false,
      modal_loading: false,
      tableData: [],
      cityList: [],
      columns: [
        {
          title: '#',
          key: 'id',
          width: 60
        },
        {
          title: '城市',
          key: 'city',
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
                  this.remove(params.row)
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
  mounted () {
    this.getCityData()
  },
  methods: {
    getTableData () {
      this.tableLoading = true
      let d = {
        page: 1,
        pagesize: 99999,
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
    onClickEdit (row) {
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
          serverApi('/web/webdel', id,
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
