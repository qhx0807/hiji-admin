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
          <Col span="8">
            <FormItem label="选择卡券类型">
              <Select v-model="editData.cardtypeid">
                <Option v-for="item in typeData" :value="item.id" :key="item.id">{{ item.typename }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="扩展信息编码" prop="merchantcode">
              <Input v-model="editData.extrainfocode"></Input>
            </FormItem>

          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="扩展信息值" prop="merchantcode">
              <Input v-model="editData.extrainfovalue"></Input>
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem label="" prop="merchantcode">
            </FormItem>
          </Col>
        </Row>
      </Form>
      <Row>
        <Col span="24" style="text-align:center; padding-top:30px">
          <Button :loading="modal_loading" style="width:200px" @click="onClickEdit" type="primary">保存</Button>
        </Col>
      </Row>
    </Card>
  </div>
</template>
<script>
import serverApi from '../../axios'
export default {
  name: 'CouponExtraEdit',
  data () {
    return {
      editData: {},
      id: null,
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
    if (this.$route.params.id) {
      this.id = this.$route.params.id
      this.getOneById(this.$route.params.id)
    }
  },
  computed: { },
  methods: {
    getOneById (id) {
      this.$store.commit('pageLoading', true)
      serverApi('/card/getbyid', {id: id},
        response => {
          console.log(response)
          this.$store.commit('pageLoading', false)
          if (response.data.code == 0) {
            this.editData = response.data.data
          } else {
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          console.log(error)
          this.$store.commit('pageLoading', false)
          this.$Message.error('连接失败！')
        })
    },
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
    onClickEdit () {
      this.modal_loading = true
      serverApi('/card/cardexpansionedit', this.editData,
        response => {
          this.modal_loading = false
          if (response.data.code === 0) {
            // this.$router.push({name: 'CouponExtra'})
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
