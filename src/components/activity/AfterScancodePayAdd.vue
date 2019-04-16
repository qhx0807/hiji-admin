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
              <DatePicker type="date" placeholder="选择时间" @on-change="e => addData.starttime = e" style="width:100%"></DatePicker>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="结束时间" prop="endtime">
              <DatePicker type="date" placeholder="选择时间" @on-change="e => addData.endtime = e" style="width:100%"></DatePicker>
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
              <Select v-model="addData.codepaytype" placeholder="请选择" @on-change="onChangeType">
                <Option value="1" v-if="addData.isentry == 3 || addData.isentry == 4">立减活动</Option>
                <Option value="2">发送卡券</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <Divider orientation="left">详细规则</Divider>
      <Form :label-width="100">
        <Row v-show="addData.codepaytype == 1">
          <Col span="24" v-for="(item, index) in rulesArr" :key="index">
            <Col span="4">
              <FormItem label="支付金额最大值">
                <InputNumber :max="9999999" :min="0" v-model="item.maxtotal"></InputNumber>
              </FormItem>
            </Col>
            <Col span="4">
              <FormItem label="支付金额最小值">
                <InputNumber :max="9999999" :min="0" v-model="item.mintotal"></InputNumber>
              </FormItem>
            </Col>
            <Col span="4">
              <FormItem label="立减金额最大值">
                <InputNumber :max="9999999" :min="0" v-model="item.max"></InputNumber>
              </FormItem>
            </Col>
            <Col span="4">
              <FormItem label="立减金额最小值">
                <InputNumber :max="9999999" :min="0" v-model="item.min"></InputNumber>
              </FormItem>
            </Col>
            <Col span="8">
              <Button type="dashed" @click="onClickDel(index)">删除规则</Button>
              <Button style="margin-left:12px" type="dashed" @click="onClickAddRule">添加规则</Button>
            </Col>
          </Col>
        </Row>
        <Row v-show="addData.codepaytype == 2">
          <Col span="24" v-for="(item, index) in rulesArr" :key="index">
            <Col span="5">
              <FormItem label="选择卡券">
                <Select
                  filterable
                  remote
                  clearable
                  label-in-value
                  :loading="submitLoading"
                  v-model="item.cardid"
                  @on-change="e => onSelectCard(e, index)"
                  :remote-method="onSearchCards"
                  placeholder="选择卡卷">
                  <Option v-for="(item, cardindex) in cardList" :disabled="item.ispromote == 1" :key="item.id" :value="item.id">{{item.cardname}}</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="5">
              <FormItem label="卡券名称">
                <Input v-model="item.cardname"></Input>
              </FormItem>
            </Col>
            <Col span="5">
              <FormItem label="赠送数量">
                <InputNumber :max="9999999" :min="0" v-model="item.goodsnum"></InputNumber>
              </FormItem>
            </Col>
            <Col span="9">
              <Button type="dashed" @click="onClickDel(index)">删除规则</Button>
              <Button style="margin-left:12px" type="dashed" @click="onClickAddRule">添加规则</Button>
            </Col>
          </Col>
        </Row>
      </Form>
      <Divider></Divider>
      <Row>
        <Col span="24">
          <Form :label-width="100">
            <FormItem>
              <Button type="primary" :loading="isloading" @click="onClickSubmit">提交</Button>
              <Button style="margin-left:12px" :to="{name: 'AfterScancodePay'}">返回</Button>
            </FormItem>
          </Form>
        </Col>
      </Row>
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
        codepaytype: '',
      },
      rules: [],
      areaData: [],
      cityid: [],
      isloading: false,
      submitLoading: false,
      cardList: [],
      rulesArr: [
        {
          mintotal: 0,
          maxtotal: 0,
          max: 0,
          min: 0,
          cardid: '',
          goodsnum: 1,
          cardname: ''
        }
      ]
    }
  },
  created () {
    this.getAreaData()
    this.getCardList('')
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
    onClickAddRule () {
      let obj = {
        mintotal: 0,
        maxtotal: 0,
        max: 0,
        min: 0,
        cardid: '',
        goodsnum: 1,
        cardname: ''
      }
      this.rulesArr.push(obj)
    },
    onClickDel (index) {
      if (index === 0) return false
      this.rulesArr.splice(index, 1)
    },
    onChangeType () {
      this.rulesArr = [
        {
          mintotal: 0,
          maxtotal: 0,
          max: 0,
          min: 0,
          cardid: '',
          goodsnum: 1,
          cardname: ''
        }
      ]
    },
    onSearchCards (e) {
      this.getCardList(e)
    },
    getCardList (like) {
      this.submitLoading = true
      let d = {
        pagesize: 20,
        page: 1,
        like: like
      }
      serverApi('/card/coupon', d,
        response => {
          if (response.data.code === 0){
            this.cardList = response.data.data.result
          }else{
            this.$Message.warning(response.data.msg)
          }
          this.submitLoading = false
        },
        error => {
          this.submitLoading = false
          console.log(error)
          this.$Message.error('连接失败！')
        }
      )
    },
    onSelectCard (e, index) {
      this.rulesArr[index].cardname = e.label
      this.rulesArr[index].cardid = e.value
    },
    onClickSubmit () {
      console.log(this.rulesArr)
      if (this.cityid.length === 0) {
        this.$Message.warning('请选择城市！')
        return false
      }
      this.isloading = true
      this.addData.city = this.cityid.join(',')
      this.rulesArr.map(item => {
        item.mintotal = 100 * item.mintotal
        item.maxtotal = 100 * item.maxtotal
        item.max = 100 * item.max
        item.min = 100 * item.min
      })
      this.addData.content = JSON.stringify(this.rulesArr)
      serverApi('/paymentactive/activityedit', this.addData,
        response => {
          this.isloading = false
          if (response.data.code === 0) {
            this.$Message.success(response.data.msg)
            this.$router.push({name: 'AfterScancodePay'})
          } else {
            this.$Message.warning(response.data.msg)
            this.rulesArr.map(item => {
              item.mintotal = item.mintotal / 100
              item.maxtotal = item.maxtotal / 100
              item.max = item.max / 100
              item.min = item.min / 100
            })
          }
        },
        error => {
          this.isloading = false
          console.log(error)
          this.$Message.error(error.toString())
        }
      )
    },
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
