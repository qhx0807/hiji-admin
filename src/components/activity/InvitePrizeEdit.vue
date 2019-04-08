<template>
  <div class="box">
    <Card :bordered="false" class="mb10">
      <div class="shop-img">
        <img src="http://cdn.cqyyy.cn/cutdown.png" alt="">
      </div>
      <div class="tips">
        <h4><span style="font-size:14px;font-weight:500">修改规则</span></h4>
        <p>
          编辑邀请有礼活动规则
          <router-link :to="{name: 'InvitePrize'}">返回【邀请有礼活动列表】</router-link>
        </p>
      </div>
      <div class="clear-fix"></div>
    </Card>
    <Card :bordered="false">
      <Form :model="addData" ref="form" :label-width="80" :rules="rules">
        <Row>
          <Col span="6">
            <FormItem label="选择城市" prop="city">
              <Select v-model="addData.city" multiple placeholder="请选择">
                <Option v-for="(item, index) in areaData" :key="index" :value="item.id">{{item.areaname}}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="开始时间" prop="starttime">
              <DatePicker type="datetime" :value="addData.starttime" placeholder="选择时间" style="width:100%" @on-change="onSelectStartTime"></DatePicker>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="结束时间" prop="endtime">
              <DatePicker type="datetime" :value="addData.endtime" placeholder="选择时间" style="width:100%" @on-change="onSelectEndTime"></DatePicker>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="状态" prop="ison">
              <Select v-model="addData.ison" placeholder="请选择">
                <Option :value="1">启用</Option>
                <Option :value="0">关闭</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Divider orientation="left">邀请人</Divider>
        <Row>
          <Col span="24">
            <Tabs v-model="tabname" type="card" >
              <Button @click="handleTabsAdd" slot="extra">增加</Button>
              <TabPane :label="'规则'+(index+1)" v-for="(item, index) in rulesArr" :key="index">
                <Row>
                  <Col span="4">
                    <FormItem label="邀请人数" prop="invitenum">
                      <InputNumber :max="999999" :min="1" style="width:100%" v-model="item.invitenum"></InputNumber>
                    </FormItem>
                    <FormItem label="缩略图">
                      <Input v-model="item.goodsimg"></Input>
                      <FileUpload @uploadSucc="e => uploadimg(e, index)"></FileUpload>
                    </FormItem>
                    <FormItem>
                      <Button @click="onClickdelTab">删除此规则</Button>
                    </FormItem>
                  </Col>
                  <Col span="4">
                  <FormItem label="奖励名称" prop="goodsname">
                      <Input v-model="item.goodsname"></Input>
                    </FormItem>
                    <FormItem label="剩余数量" >
                      <Input v-model="item.remaincount"></Input>
                    </FormItem>
                  </Col>
                  <Col span="4">
                    <FormItem label="奖励数量" prop="num">
                      <InputNumber :max="999999" :min="1" style="width:100%" v-model="item.num"></InputNumber>
                    </FormItem>
                    <FormItem label="是否需邮费"  prop="isshipping">
                      <i-switch v-model="item.isshipping" :true-value="1" :false-value="0" size="large">
                          <span slot="open">是</span>
                          <span slot="close">否</span>
                        </i-switch>
                    </FormItem>

                  </Col>
                  <Col span="4">
                    <FormItem label="奖励类型" prop="invitetype">
                      <Select v-model="item.type" placeholder="请选择">
                        <Option v-for="(item, index) in inviteTypeArr" :key="index" :value="item.value">{{item.label}}</Option>
                      </Select>
                    </FormItem>
                    <FormItem label="邮费" prop="shippingamout">
                      <InputNumber :max="999999" :min="0" style="width:100%" v-model="item.shippingamout"></InputNumber>
                    </FormItem>
                  </Col>
                  <Col span="4">
                    <FormItem label="奖品ID" prop="prizeid">
                      <Input v-model="item.prizeid">
                        <Button v-show="item.type==2 || item.type==4 || item.type==1 || item.type==3" type="primary" @click="onClickSearchGoods(item, index, 'rulesArr')" slot="append" icon="ios-search"></Button>
                      </Input>
                    </FormItem>
                    <FormItem label="已发放数量" >
                      <Input v-model="item.invitetype" readonly></Input>
                    </FormItem>
                  </Col>
                  <Col span="4">
                    <FormItem label="属性id" prop="goodstypeid">
                      <Input v-model="item.goodstypeid"></Input>
                    </FormItem>
                    <!-- <Alert v-show="item.ingoods && item.ingoods.goodsname">
                      <div class="ingoodsbox">
                        <p>{{item.ingoods.goodsname}}</p>
                        <ul>
                          <li>
                            <span>售价：</span>
                            <span>{{item.ingoods.goodsprice}}</span>
                          </li>
                          <li>
                            <span>平台优惠：</span>
                            <span>{{item.ingoods.coupon}}</span>
                          </li>
                          <li>
                            <span>商户优惠：</span>
                            <span>{{item.ingoods.merchantcoupon}}</span>
                          </li>
                          <li>
                            <span>运费：</span>
                            <span>{{item.ingoods.freight}}</span>
                          </li>
                        </ul>
                      </div>
                    </Alert> -->
                  </Col>
                </Row>
              </TabPane>
            </Tabs>
          </Col>
        </Row>
        <Divider orientation="left">被邀请人</Divider>
        <Row>
          <Col span="24">
            <Tabs v-model="tabnamed" type="card" >
              <Button @click="handleTabsAddInva" slot="extra">增加</Button>
              <TabPane :label="'规则'+(index+1)" v-for="(item, index) in rulesArred" :key="index">
                <Row>
                  <Col span="4">
                    <!-- <FormItem label="邀请人数" prop="invitenum">
                      <InputNumber :max="999999" :min="1" style="width:100%" v-model="item.invitenum"></InputNumber>
                    </FormItem> -->
                    <FormItem label="缩略图">
                      <Input v-model="item.goodsimg"></Input>
                      <FileUpload @uploadSucc="e => uploadimgEd(e, index)"></FileUpload>
                    </FormItem>
                    <FormItem>
                      <Button @click="onClickdelTabEd">删除此规则</Button>
                    </FormItem>
                  </Col>
                  <Col span="4">
                  <FormItem label="奖励名称" prop="goodsname">
                      <Input v-model="item.goodsname"></Input>
                    </FormItem>
                    <FormItem label="剩余数量" >
                      <Input v-model="item.remaincount"></Input>
                    </FormItem>
                  </Col>
                  <Col span="4">
                    <FormItem label="奖励数量" prop="num">
                      <InputNumber :max="999999" :min="1" style="width:100%" v-model="item.num"></InputNumber>
                    </FormItem>
                    <FormItem label="是否需邮费"  prop="isshipping">
                      <i-switch v-model="item.isshipping" :true-value="1" :false-value="0" size="large">
                          <span slot="open">是</span>
                          <span slot="close">否</span>
                        </i-switch>
                    </FormItem>
                  </Col>
                  <Col span="4">
                    <FormItem label="奖励类型" prop="invitetype">
                      <Select v-model="item.type" placeholder="请选择">
                        <Option v-for="(item, index) in inviteTypeArr" :key="index" :value="item.value">{{item.label}}</Option>
                      </Select>
                    </FormItem>
                    <FormItem label="邮费" prop="shippingamout">
                      <InputNumber :max="999999" :min="0" style="width:100%" v-model="item.shippingamout"></InputNumber>
                    </FormItem>
                  </Col>
                  <Col span="4">
                    <FormItem label="奖品ID" prop="prizeid">
                      <Input v-model="item.prizeid">
                        <Button v-show="item.type==2 || item.type==4 || item.type==1 || item.type==3" type="primary" @click="onClickSearchGoods(item, index, 'rulesArred')" slot="append" icon="ios-search"></Button>
                      </Input>
                    </FormItem>
                    <FormItem label="已发放数量" >
                      <Input v-model="item.invitetype" readonly></Input>
                    </FormItem>
                  </Col>
                  <Col span="4">
                    <FormItem label="属性id" prop="goodstypeid">
                      <Input v-model="item.goodstypeid"></Input>
                    </FormItem>
                    <!-- <Alert v-show="item.ingoods.id">
                      <div class="ingoodsbox">
                        <p>{{item.ingoods.goodsname}}</p>
                        <ul>
                          <li>
                            <span>售价：</span>
                            <span>{{item.ingoods.goodsprice}}</span>
                          </li>
                          <li>
                            <span>平台优惠：</span>
                            <span>{{item.ingoods.coupon}}</span>
                          </li>
                          <li>
                            <span>商户优惠：</span>
                            <span>{{item.ingoods.merchantcoupon}}</span>
                          </li>
                          <li>
                            <span>运费：</span>
                            <span>{{item.ingoods.freight}}</span>
                          </li>
                        </ul>
                      </div>
                    </Alert> -->
                  </Col>
                </Row>
              </TabPane>
            </Tabs>
          </Col>
        </Row>
        <Divider orientation="left"></Divider>
        <Row>
          <Col span="24">
            <FormItem >
              <Button type="primary" :loading="loading" @click="onSubmit">提交</Button>
              <Button style="margin-left: 12px" @click="$router.back()">返回</Button>
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
  name: 'InvitePrizeEdit',
  data () {
    return {
      addData: {},
      areaData: [],
      rules: {
        starttime: { required: true, message: '不能为空', trigger: 'blur' },
        endtime: { required: true, message: '不能为空', trigger: 'blur' },
        ison: { required: true, type: 'number', message: '不能为空', trigger: 'blur' },
      },
      rulesArr: [
        {
          type: 2,
          num: 1,
          prizeid: '',
          goodstypeid: '',
          isshipping: 0,
          shippingamout: '0',
          invitenum: 1,
          invitetype: 1,
          goodsname: '',
          goodsimg: '',
          remaincount: 0,
          ingoods: {}
        }
      ],
      rulesArred: [
        {
          type: 2,
          num: 1,
          prizeid: '',
          goodstypeid: '',
          isshipping: 0,
          shippingamout: '0',
          invitenum: 1,
          invitetype: 1,
          goodsname: '',
          goodsimg: '',
          remaincount: 0,
          ingoods: {}
        }
      ]
    }
  },
  created () {
    this.getAreaData()
    this.getRowData()
  },
  computed: {
    inviteTypeArr () {
      return this.$store.state.inviteTypeArr
    }
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
    getRowData () {
      serverApi('/activity/inviteinfonew', {id: this.$route.params.id},
        response => {
          this.$Message.destroy()
          if (response.data.code === 0) {
            this.addData = response.data.data
            this.addData.city = response.data.data.cityid.split(',').map(e => Number(e))
            this.rulesArr = JSON.parse(response.data.data.invitemsg)
            this.rulesArred = JSON.parse(response.data.data.invitedmsg)
          } else {
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          this.$Message.destroy()
          this.$Message.error(error.toString())
          console.log(error)
        }
      )
    },
    onSelectStartTime (e) {
      this.addData.starttime = e
    },
    onSelectEndTime (e) {
      this.addData.endtime = e
    },
    uploadimg (e, index) {
      this.rulesArr[index].goodsimg = e
    },
    uploadimgEd (e, index) {
      this.rulesArred[index].goodsimg = e
    },
    onSubmit () {
      if (this.rulesArr.length < 1) {
        this.$Message.warning('请填写规则！')
        return false
      }
      this.$refs.form.validate(val => {
        if (!val) return false
        this.loading = true
        this.addData.cityid = this.addData.cityid.toString()
        let invitemsg = JSON.parse(JSON.stringify(this.rulesArr))
        invitemsg.forEach(item => {
          delete item.ingoods
        })
        let invitemsged = JSON.parse(JSON.stringify(this.rulesArred))
        invitemsged.forEach(item => {
          delete item.ingoods
        })
        this.addData.invitemsg = JSON.stringify(invitemsg)
        this.addData.invitedmsg = JSON.stringify(invitemsged)
        this.addData.cityid = this.addData.city.join(',')
        serverApi('/activity/inviteaddnew', this.addData,
          response => {
            if (response.data.code === 0) {
              this.$Message.success(response.data.msg)
              this.$router.push({name: 'InvitePrize'})
            } else {
              this.$Message.warning(response.data.msg)
            }
            this.loading = false
          },
          error => {
            this.loading = false
            this.$Message.error(error.toString())
            console.log(error)
          }
        )
      })
    },
    onClickSearchGoods (row, index, srcname) {
      if (!row.prizeid) {
        this.$Message.warning('请输入商品ID')
        return false
      }
      let d = {
        id: row.prizeid,
        type: row.type
      }
      serverApi('/activity/goodsinfo', d,
        response => {
          if (response.data.code === 0) {
            row.ingoods = response.data.data
            row.goodsimg = response.data.data.goodsimg
          } else {
            row.ingoods = {}
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          row.ingoods = {}
          this.$Message.error(error.toString())
          console.log(error)
        }
      )
    },
    handleTabsAdd () {
      let obj = {
        type: 2,
        num: 1,
        prizeid: '',
        goodstypeid: '',
        isshipping: 0,
        shippingamout: '0',
        invitenum: 1,
        invitetype: 1,
        goodsname: '',
        goodsimg: '',
        remaincount: 0,
        ingoods: {}
      }
      this.rulesArr.push(obj)
      this.tabname = this.rulesArr.length - 1
    },
    onClickdelTab (e) {
      this.rulesArr.splice(e, 1)
      this.tabname = 0
    },
    onClickdelTabEd (e) {
      this.rulesArred.splice(e, 1)
      this.tabnamed = 0
    },
    handleTabsAddInva () {
      let obj = {
        type: 2,
        num: 1,
        prizeid: '',
        goodstypeid: '',
        isshipping: 0,
        shippingamout: '0',
        invitenum: 1,
        invitetype: 1,
        goodsname: '',
        goodsimg: '',
        remaincount: 0,
        ingoods: {}
      }
      this.rulesArred.push(obj)
      this.tabnamed = this.rulesArred.length - 1
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
.btn-box{
  text-align: center;
  padding-bottom: 30px;
}
</style>
