<template>
  <div class="box">
    <Card :bordered="false" class="mb10">
      <div class="shop-img">
        <img src="http://cdn.cqyyy.cn/PREVIEW.svg" alt="">
      </div>
      <div class="tips">
        <h4><span style="font-size:14px;font-weight:500">板块名称</span></h4>
        <p>编辑首页板块
          <router-link :to="{name: 'Modules'}">返回【首页板块列表】</router-link>
        </p>
      </div>
      <div class="clear-fix"></div>
    </Card>
    <Card :bordered="false" dis-hover>
      <div class="preview-box">
        <div class="add-box">
          <Button type="dashed" @click="onClickAddBlock" long icon="md-add">添加</Button>
        </div>
      </div>
    </Card>
  </div>
</template>
<script>
import serverApi from '../../axios'
import { uploadApiUrl } from '../../config/'
export default {
  name: 'ModulesAdd',
  data () {
    return {
      uploadApiUrl: uploadApiUrl,
      submitLoading: false,
      addData: {
        city: '',
        urltype: '',
        url: '',
        sort: '',
        type: '1',
        imgurl: ''
      },
      cityList: [],
      InfoData: []
    }
  },
  created () {
    let id = this.$route.params.id
    this.getModulesInfo(id)
    this.getCityData()
  },
  methods: {
    getCityData () {
      this.$store.commit('pageLoading', true)
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
    getModulesInfo (id) {
      let d = {
        id: id,
        index: 1
      }
      serverApi('/web/webareaindex', d,
        response => {
          console.log(response)
          if (response.data.code === 0) {
            this.InfoData = response.data.data
          } else {
            this.$Message.warning(response.data.msg)
          }
          console.log(response)
        },
        error => {
          console.log(error)
          this.$Message.error(error.toString())
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
        this.addData.imgurl = url
      }
    },
    onClickSubmit () {
      if (!this.addData.imgurl) {
        this.$Message.warning('请上传图片')
        return false
      }
      if (!this.addData.urltype) {
        this.$Message.warning('请选择链接类型')
        return false
      }
      if (!this.addData.url) {
        this.$Message.warning('请输入连接地址')
        return false
      }
      this.submitLoading = true
      // serverApi('/web/webadd', this.addData,
      //   response => {
      //     console.log(response)
      //   },
      //   error => {
      //     console.log(error)
      //     this.$Message.error(error.toString())
      //   }
      // )
    },
    onClickAddBlock () {
      alert(1)
    }
  }
}
</script>
<style lang="less" scoped>
.shop-img{
  width: 60px;
  height: 60px;
  float: left;
  img{
    height: 100%;
    width: 100%;
  }
}
.tips{
  padding-left: 70px;
  h4{
    margin-top: 10px;
  }
  p{
    margin-top: 5px;
  }
}
.preview-box{
  width: 320px;
  height: 450px;
  background-color: #fafafa;
  border: 1px solid #ddd;
  .add-box{
    margin-top: 20px;
    text-align: center;
    padding: 0 50px;
  }
}
</style>
