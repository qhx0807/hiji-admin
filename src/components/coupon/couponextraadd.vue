<template>
  <div class="box">
    <Card :bordered="false">
      <div class="shop-img">
        <img src="http://cqcother.zlzmm.com/2.png" alt="">
      </div>
      <div class="tips">
        <h4><span style="font-size:14px;font-weight:500">新增卡券扩展信息</span></h4>
        <p>自定义卡券扩展信息属性
          <router-link :to="{name: 'CouponExtra'}">返回【扩展列表】</router-link>
        </p>
      </div>
      <div class="clear-fix"></div>
    </Card>
    <Card style="margin-top:10px" :bordered="false">
      <Form :model="merchantData" ref="form" :rules="rules" :label-width="90">
        <Row>
          <Col span="6">
            <FormItem label="选择卡券类型">
              <Select v-model="form.cardtypeid">
                <Option v-for="item in typeData" :value="item.id" :key="item.id">{{ item.typename }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="扩展信息值">
              <Input v-model="form.extrainfovalue"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="扩展信息编码">
              <Input v-model="form.extrainfocode"></Input>
              <!-- <div class="kz-info">{{form.extrainfocode}}</div> -->
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem label="">
            </FormItem>
          </Col>
        </Row>
      </Form>
      <Row>
        <Col span="24" style="text-align:center; padding-top:30px">
          <Button :loading="modal_loading" style="width:200px" @click="onClickAdd" type="primary">新增卡券扩展信息</Button>
        </Col>
      </Row>
    </Card>
  </div>
</template>
<script>
import serverApi from '../../axios'
export default {
  name: 'CouponExtraAdd',
  data () {
    return {
      form: {
        cardtypeid: null,
        extrainfocode: '',
        extrainfovalue: ''
      },
      rules: {
        extrainfocode: [{ required: true, message: '不能为空', trigger: 'blur' }],
        extrainfovalue: [{ required: true, message: '不能为空', trigger: 'blur' }]
      },
      modal_loading: false,
      couponData: [],
      typeData: []
    }
  },
  created () {
    this.getCardType()
  },
  computed: { },
  methods: {
    getCardType () {
      let d = {
        pagesize: 99999,
        page: 1
      }
      serverApi('/card/type', d,
        response => {
          console.log(response)
          if (response.data.code === 0){
            this.typeData = response.data.data.result
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
    getCouponData () {
      let d = {
        pagesize: 99999,
        page: 1,
        userid: sessionStorage.userid
      }
      serverApi('/card/coupon', d,
        response => {
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
    onClickAdd () {
      this.modal_loading = true
        serverApi('/card/cardexpansionadd', this.form,
          response => {
            this.modal_loading = false
            if (response.data.code === 0) {
              this.$router.push({name: 'CouponExtra'})
            }
            this.$Message.info(response.data.msg)
          },
          error => {
            console.log(error)
            this.modal_loading = false
            this.$Message.error("连接失败！")
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
</style>
