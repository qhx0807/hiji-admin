<template>
  <div class="box">
    <Card :bordered="false">
      <div class="shop-img">
        <img :src="shopImg" alt="">
      </div>
      <div class="tips">
        <h4>{{merchantData.name}} <span style="font-size:14px;font-weight:500">商户详情</span></h4>
        <p>维护商户的详细信息，图文编辑。
          <router-link :to="{name: 'Merchant'}">返回【商户列表】</router-link>
        </p>
      </div>
      <div class="clear-fix"></div>
    </Card>
    <Card style="margin-top:10px" :bordered="false">
      <Form :model="merchantData" :label-width="80">
        <Row>
          <Col span="6">
            <FormItem label="商户名称">
              <Input v-model="merchantData.name"></Input>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="商户编码">
              <Input v-model="merchantData.merchantcode"></Input>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="联系人">
              <Input v-model="merchantData.contact"></Input>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="联系电话">
              <Input v-model="merchantData.mobile"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="6">
            <FormItem label="联系地址">
              <Input v-model="merchantData.addres"></Input>
            </FormItem>
            <FormItem label="营业时间">
              <Input v-model="merchantData.businesstime"></Input>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem style="margin-bottom: 0" label="商户缩略图">
              <Input v-model="merchantData.merchantimg"></Input>
              <Upload :show-upload-list="false" :action="uploadApiUrl" @on-success="uploadImgSucc" @on-error="uploadImgErr">
                <a>上传图片</a>
              </Upload>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="商户简介">
              <Input type="textarea" :autosize="{minRows: 1, maxRows: 3}" v-model="merchantData.info"></Input>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <Row>
        <Col span="24">
          <TextEditor :config="config"></TextEditor>
        </Col>
        <Col span="24" style="text-align:center; padding-top:30px">
          <Button :loading="modal_loading" style="width:200px" @click="onEditMerchant" type="primary">保存</Button>
        </Col>
      </Row>
    </Card>
  </div>
</template>
<script>
import { uploadApiUrl } from '../../config'
import serverApi from '../../axios'
import TextEditor from '../common/text-editor'
export default {
  name: 'MerchantDetail',
  data () {
    return {
      merchantID: null,
      merchantData: {},
      uploadApiUrl: uploadApiUrl,
      modal_loading: false,
      richTextData: '',
      config: {
        initialFrameWidth: null,
        initialFrameHeight: 350
      },
    }
  },
  components: {
    TextEditor
  },
  created () {
    if (this.$route.params.id) {
      this.merchantID = this.$route.params.id
      this.getMerchangById(this.$route.params.id)
    }
  },
  mounted () {
    let height = document.body.offsetHeight - 380
  },
  computed: {
    shopImg () {
      return this.merchantData.merchantimg || '../../../static/no-img.png'
    }
  },
  methods: {
    getMerchangById (id) {
      serverApi('/Merchant/getbyid', {id: id},
        response => {
          // console.log(response)
          if (response.data.code == 0) {
            this.merchantData = response.data.data[0]
          } else {
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          console.log(error)
          this.$Message.error('连接失败！')
        })
    },
    uploadImgSucc (response, file, fileList) {
      console.log(response,file,fileList)
    },
    uploadImgErr (response, file, fileList) {
      console.log('err'+response,file,fileList)
    },
    onEditMerchant () {
      this.modal_loading = true
      serverApi('/Merchant/edit', this.merchantData,
        response => {
          this.modal_loading = false
          if (response.data.code === 0) {
            this.$Message.info(response.data.msg)
          } else {
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          console.log(error)
          this.modal_loading = false
        }
      )
    }
  }
}
</script>
<style lang="less" scoped>
.shop-img{
  width: 80px;
  height: 80px;
  float: left;
  img{
    height: 100%;
    width: 100%;
  }
}
.tips{
  padding-left: 100px;
  h4{
    margin-top: 17px;
  }
}
.clear-fix{
  clear: both;
}
</style>
