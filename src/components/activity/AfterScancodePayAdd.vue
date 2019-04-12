<template>
  <div class="box">
    <Card :bordered="false" class="mb10">
      <div class="shop-img">
        <img src="http://cdn.cqyyy.cn/pic/20190311180501.png" alt="">
      </div>
      <div class="tips">
        <h4><span style="font-size:14px;font-weight:500">新增规则</span></h4>
        <p>
          扫码支付后奖励活动规则
          <router-link :to="{name: 'AfterScancodePay'}">返回【扫码支付奖励活动列表】</router-link>
        </p>
      </div>
      <div class="clear-fix"></div>
    </Card>
    <Card :bordered="false">
      <Form :model="addData" ref="form" :label-width="80" :rules="rules">
        <Row>
          <Col span="6">
            <FormItem label="活动名称" prop="cityid">
              <Input v-model="addData.codepayname"></Input>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="选择城市" prop="cityid">
              <Select v-model="cityid" multiple placeholder="请选择">
                <Option v-for="(item, index) in areaData" :key="index" :value="item.id">{{item.areaname}}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="开始时间" prop="starttime">
              <DatePicker type="datetime" placeholder="选择时间" @on-change="e => addData.starttime = e" style="width:100%"></DatePicker>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="结束时间" prop="endtime">
              <DatePicker type="datetime" placeholder="选择时间" @on-change="e => addData.endtime = e" style="width:100%"></DatePicker>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="享受方式" prop="ison">
              <Select v-model="addData.isentry" placeholder="请选择">
                <Option value="0">全部享受</Option>
                <Option value="1">注册享受</Option>
                <Option value="2">登录享受</Option>
                <Option value="3">扫码支付</Option>
                <Option value="4">停车缴费</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="奖励类型" prop="ison">
              <Select v-model="addData.codepaytype" placeholder="请选择">
                <Option value="1">立减活动</Option>
                <Option value="2">发送卡券</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="最低费用">
              <InputNumber style="width:100%" v-model="addData.minfee"></InputNumber>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="最高费用">
              <InputNumber style="width:100%" v-model="addData.maxfee"></InputNumber>
            </FormItem>
          </Col>
        </Row>
        <Divider orientation="left">详细规则</Divider>
        <Row>
          <Col span="6">
            content
          </Col>
        </Row>
        <Divider orientation="left">-</Divider>
        <Row>
          <Col span="24">
            <FormItem>
              <Button type="primary" :loading="isloading" @click="onClickSubmit">提交</Button>
              <Button>返回</Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Card>
  </div>
</template>
<script>
import serverApi from '../../axios'
export default {
  name: 'AfterScancodePayAdd',
  data () {
    return {
      addData: {
        starttime: '',
        endtime: '',
        isentry: '0',
        city: '',
        content: '',
        codepayname: '',
        maxfee: 9999,
        minfee: 0,
        codepaytype: '1',
      },
      rules: [],
      areaData: [],
      cityid: [],
      isloading: false
    }
  },
  created () {
    this.getAreaData()
  },
  methods: {
    getAreaData () {
      this.$store.commit('pageLoading', true)
      serverApi('/area/index', '',
        response => {
          if (response.data.code === 0) {
            this.areaData = response.data.data
          }else{
            this.$Message.warning(response.data.msg)
          }
          this.$store.commit('pageLoading', false)
        },
        error => {
          this.$store.commit('pageLoading', false)
          console.log(error)
        }
      )
    },
    onClickSubmit () {
      if (this.cityid.length === 0) {
        this.$Message.warning('请选择城市！')
        return false
      }
      this.isloading = true
      this.addData.city = this.cityid.join(',')
      serverApi('/paymentactive/activityedit', this.addData,
        response => {
          this.isloading = false
          if (response.data.code === 0) {
            this.$Message.success(response.data.msg)
          } else {
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          this.isloading = false
          console.log(error)
          this.$Message.error(error.toString())
        }
      )
    }
  }
}
</script>
<style lang="less" scoped>
.box{
  position: relative;
}
.shop-img{
  width: 40px;
  height: 40px;
  float: left;
  img{
    height: 100%;
    width: 100%;
  }
}
.tips{
  padding-left: 50px;
  h4{
    margin-top: 2px;
  }
  p{
    margin-top: 3px;
  }
}
.share-img{
  height: 40px;
}
</style>
