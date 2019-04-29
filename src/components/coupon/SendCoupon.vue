<template>
  <div class="">
    <Card :bordered="false" class="mb10">
      <div class="shop-img">
        <img src="../../images/order.png" alt="">
      </div>
      <div class="tips">
        <h4><span style="font-size:14px;font-weight:500">发送卡卷</span></h4>
        <p>
          选择卡卷。选择用户，发送卡卷。
          <!-- <router-link :to="{name: 'ShopGoodsCx'}">返回【限购商品列表】</router-link> -->
        </p>
      </div>
      <div class="clear-fix"></div>
    </Card>
    <Card :bordered="false">
      <Form :model="addData" :label-width="120" ref="from" :rules="rules">
        <Row type="flex" justify="center" class="code-row-bg">
          <Col span="13">
            <FormItem>
              <Button type="primary" style="margin-left:8px" icon="md-download" :loading="loading1" @click="onClickDownLoad">下载模板</Button>
              <Button type="primary" style="margin-left:8px" icon="ios-cloud-upload" @click="onClickUpLoad">上传用户数据表</Button>
            </FormItem>
          </Col>
        </Row>
        <Row type="flex" justify="center" class="code-row-bg">
          <Col span="12">
            <FormItem  label="选择用户">
              <Input  v-model="name" search @on-search="onSubmit" placeholder="输入用户手机号"></Input>
            </FormItem>
          </Col>
          <Col span="1">
              <Button type="primary" class="btn" @click="onSearch">搜索</Button>
          </Col>
          <Col span="13">
            <FormItem style="margin-bottom:12px" v-show="selectedGoods.user_id">
              <div class="goods-info">
                <Row>
                  <Col span="24"><span class="label">用户名称：</span><span class="value">{{selectedGoods.username}}</span></Col>
                  <Col span="8">
                    <p><span class="label">电话：</span> <span class="value">{{selectedGoods.phone}}</span></p>
                    <p><span class="label">ID</span> <span class="value">{{selectedGoods.user_id}}</span></p>
                  </Col>
                  <Col span="4">
                    <img v-imgview :src="selectedGoods.goodsimg" style="height:60px" alt="">
                  </Col>
                </Row>
              </div>
            </FormItem>
          </Col>
          <Col span="13">

            <FormItem label="选择卡卷">
              <Select
                filterable
                remote
                clearable
                :loading="submitLoading"
                v-model="cardid"
                :remote-method="onSearchCards"
                placeholder="选择卡卷">
                <Option v-for="(item, index) in tableData" :disabled="item.ispromote == 1" :key="item.id" :value="item.id">{{item.cardname}}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row type="flex" justify="center" class="code-row-bg">
          <FormItem>
            <Button type="primary" @click="onClickSubmit" :loading="submitLoading">提交</Button>
          </FormItem>
        </Row>
      </Form>
        <Modal v-model="uploadModal" width="550">
        <p slot="header" style="text-align:center">
          <span>上传用户数据表</span>
        </p>
        <div>
          <Upload
            type="drag"
            ref="upload"
            accept=".xlsx,.xls,.csv"
            :max-size="5120"
            :format="['xlsx','xls','csv']"
            :on-success="onUploadTableSuccess"
            :on-error="onUploadTableErr"
            :action="uploadCardUserUrl">
            <div style="padding: 20px 0">
              <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
              <p>点击或拖拽到此处上传，限 .xlsx,.xls,.csv 文件，大小5M以下</p>
            </div>
          </Upload>
          <Alert v-show="!loading2" type="info">结果：成功 {{successCount}}条， 失败 {{errCount}}条。以下为导入失败的数据。</Alert>
          <Table v-show="errOrderData.length>0" height="210" ref="errTable" :row-class-name="rowClassName" :columns="errColumns" size="small" :data="errOrderData"></Table>
        </div>
        <div slot="footer">
          <Button @click="uploadModal = false">关闭</Button>
          <!-- <Button v-show="errOrderData.length>0" type="primary" @click="downErrData">下载失败数据</Button> -->
        </div>
    </Modal>
    </Card>
  </div>
</template>
<script>
import serverApi from '../../axios'
import { downloadFile } from '../../utlis/tools.js'
import { uploadCardUserUrl } from '../../config'
export default {
  name: 'SendCoupon',
  data () {
    return {
      uploadCardUserUrl: uploadCardUserUrl,
      submitLoading: false,
      uploadModal: false,
      loading2: false,
      tableData: [],
      errOrderData: [],
      selectedGoods: {},
      addData: {},
      pagesize: 20,
      page: 1,
      searchKey: '',
      status: '',
      name: '',
      userid: '',
      cardid: ''
    }
  },
  created () {
    this.getTableData('')
    // this.getCardsData(10, '')
  },
  methods: {
    getTableData (like) {
      let d = {
        pagesize: this.pagesize,
        page: this.page,
        like: like,
        status: this.status
      }
      serverApi('/card/coupon', d,
        response => {
          console.log(response)
          if (response.data.code === 0){
            this.tableData = response.data.data.result
            this.count = response.data.data.counts
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
    onClickSubmit () {
      let d = {
        cardid: this.cardid,
        userid: this.userid
      }
      if (!this.userid) {
        this.$Message.error('请选择用户')
        this.submitLoading = false
        return false
      }
      this.submitLoading = true
      serverApi('/card/adminsendcard', d,
        response => {
          console.log(response)
          this.submitLoading = false
          if (response.data.code === 0){
            this.$Notice.success({
              title: response.data.msg,
              desc: '发送卡卷成功！'
            })
            // this.$router.push({name: 'ShopGoodsCx'})
          }else{
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          this.submitLoading = false
          console.log(error)
          this.$Message.error('连接失败！')
        }
      )
    },
    onSubmit (e) {
      let tel = Number(e)
      console.log(tel)
      serverApi('/member/userinfo', {like: tel},
        response => {
          console.log(response)
          this.submitLoading = false
          if (response.data.code === 0){
            if (response.data.data.length === 0 ) {
              this.$Message.warning('该用户不存在')
              this.selectedGoods.user_id = false
            } else {
              this.selectedGoods = response.data.data[0]
              this.userid = response.data.data[0].user_id
            }
            console.log(this.userid)
          }else{
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          console.log(error)
        }
      )
    },
    onSearch () {
      console.log(this.name)
      let num = Number(this.name)
      this.onSubmit(num)
    },
    onSearchCards (e) {
      this.getTableData(e)
    },
    onClickUpLoad () {
      this.$refs.upload.clearFiles()
      this.errOrderData = []
      this.loading2 = true
      this.uploadModal = true
    },
    onUploadTableSuccess (response) {
      console.log(response)
      if (response.code === 0) {
        this.errOrderData = response.data.orderdefault
        this.successCount = response.data.countsuccess
        this.errCount = response.data.countdefault
        this.$Notice.success({
          title: '上传成功',
          desc: response.msg
        })
        this.loading2 = false
      } else if (response.code === 2) {
         this.$Notice.warning({
          title: '发送用户订单失败',
          duration:15,
          desc: response.msg
        })
      } else {
        this.$Notice.warning({
          title: '发送用户订单失败',
          desc: response.msg
        })
      }
    },
    onUploadTableErr (error) {
      console.log(error)
      this.$Message.warning('上传失败！')
    },
    onClickDownLoad () {
      this.loading1 = true
      serverApi('/card/sendcardtomoreuserout', null,
        response => {
          if (response.data.code === 0){
            downloadFile(response.data.data)
          }else{
            this.$Message.warning(response.data.msg)
          }
          this.loading1 = false
        },
        error => {
          console.log(error)
          this.$Message.warning('连接失败！')
          this.loading1 = false
        }
      )
    },
    rowClassName () {
      return 'err-tr-bg'
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
.goods-info{
  border: 1px solid #ddd;
  padding-left: 8px;
  border-radius: 4px;
}
.btn {
  height: 32px;
  line-height: 16px;
  margin-left: 10px;
}
</style>
