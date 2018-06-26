<template>
  <div class="box">
    <Card :bordered="false">
      <div class="tips">
        <h4 v-show="action == 'apply'">申请提现</h4>
        <h4 v-show="action == 'records'">我的提现申请记录</h4>
        <p v-show="action == 'apply'">填写正确的申请信息，将会在通过审核后打款至商户支付宝账户. <a @click="seeMyRecords('records')" href="javascript: void(0)">查看提现申请记录</a></p>
        <p v-show="action == 'records'">此商户的申请提现记录，详情请咨询【<a>宏帆Hi集</a>】  <a @click="seeMyRecords('apply')" href="javascript: void(0)">去申请提现</a></p>
      </div>
    </Card>
    <Card :bordered="false" style="margin-top:10px" v-show="action == 'apply'">
      <Row>
        <Col span="24">
          <Steps :current="stepNum" style="max-width:880px; margin:20px auto 0 auto">
            <Step title="填写信息" content="这里是该步骤的描述信息"></Step>
            <Step title="确认信息" content="这里是该步骤的描述信息"></Step>
            <Step title="完成" content="这里是该步骤的描述信息"></Step>
          </Steps>
        </Col>
        <Col span="24">
          <div style="max-width: 600px;margin:0 auto; padding-top: 40px;">
            <div v-show="stepNum == 0">
              <Form ref="formValidate" :model="formItem" :label-width="100" :rules="ruleValidate" >
                <FormItem label="提现金额：" prop="price">
                  <InputNumber
                    :max="maxApplyNum"
                    :min="0"
                    v-model="formItem.price"
                    style="width: 400px"
                    placeholder="输入提现金额"
                    ></InputNumber>
                  <p><a @click="toggleSeeFee">点击查看可提现金额</a> <span v-if="seeFee" class="applyable-fee">可提现金额：<span>￥{{seeInfoData.balance}}</span></span></p>
                </FormItem>
                <FormItem label="收款账户：">
                  {{seeInfoData.aliphone}}
                  <!-- <Input v-model="" disabled style="width: 400px" placeholder="输入收款账户"></Input> -->
                </FormItem>
                <FormItem label="收款人姓名：">
                  {{seeInfoData.realname}}
                  <!-- <Input v-model="seeInfoData.realname" disabled style="width: 400px" placeholder="输入收款人姓名"></Input> -->
                </FormItem>
                <FormItem>
                  <Button type="primary" @click="nextStepApply('formValidate')">下一步</Button>
                  <!-- <Button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button> -->
                </FormItem>
              </Form>
            </div>
            <div style="max-width: 450px;" v-show="stepNum == 1">
              <Row class="infoitem">
                <Col span="24">
                  <Alert show-icon closable>确认申请审核后，资金将直接打入此账户，无法退回。</Alert>
                </Col>
              </Row>
              <Row class="infoitem">
                <Col span="8" style="text-align:right">收款账户：</Col>
                <Col span="16"><p class="infovalue">{{seeInfoData.aliphone}}</p></Col>
              </Row>
              <Row class="infoitem">
                <Col span="8" style="text-align:right">收款人：</Col>
                <Col span="16"><p class="infovalue">{{seeInfoData.realname}}</p></Col>
              </Row>
              <Row class="infoitem">
                <Col span="8" style="text-align:right">提现金额：</Col>
                <Col span="16"><b class="infovalue money">￥{{formItem.price}}</b></Col>
              </Row>
              <Row class="infoitem">
                <Col span="13" style="text-align:right">
                  <Button type="primary" @click="confirmApply" :loading="submitLoading">确认</Button>
                  <Button type="ghost" @click="stepNum = 0" style="margin-left:8px">上一步</Button>
                </Col>
              </Row>
            </div>
            <div style="max-width: 450px;" v-show="stepNum == 2">
              <div class="apply-succ">
                <Icon :size="75" color="#52c41a" type="ios-checkmark"></Icon>
                <h4 >操作成功</h4>
                <p>审核通过后预计两小时到账</p>
              </div>
              <Row class="infoitem">
                <Col span="12" style="text-align:right">收款账户：</Col>
                <Col span="12"><p class="infovalue">{{seeInfoData.aliphone}}</p></Col>
              </Row>
              <Row class="infoitem">
                <Col span="12" style="text-align:right">收款人：</Col>
                <Col span="12"><p class="infovalue">{{seeInfoData.realname}}</p></Col>
              </Row>
              <Row class="infoitem" style="margin-bottom:35px;">
                <Col span="12" style="text-align:right">提现金额：</Col>
                <Col span="12"><b class="infovalue money">￥{{formItem.price}}</b></Col>
              </Row>
              <Row class="infoitem" >
                <Col span="24" style="text-align:center">
                  <Button type="primary" @click="seeMyRecordsFinaly">查看申请记录</Button>
                </Col>
              </Row>
            </div>
          </div>
        </Col>
      </Row>
    </Card>
    <Card :bordered="false" style="margin-top: 10px" v-show="action == 'records'">
      <Row>
        <Col span="24">
          <Table :columns="columns" :loading="tableLoading" :border="false" :data="tableData"></Table>
        </Col>
        <Col span="24">
          <div style="padding-top:12px;text-align:right">
            <Page :total="count" show-total :current="page" @on-change="changePage" show-sizer @on-page-size-change="onChangeSize"></Page>
          </div>
        </Col>
      </Row>
    </Card>
  </div>
</template>
<script>
import serverApi from '../../axios'
export default {
  name: 'ApplyCash',
  data () {
    return {
      searchKey: '',
      text: '',
      stepNum: 0,
      maxApplyNum: 0,
      action: 'apply',
      seeFee: false,
      submitLoading: false,
      formItem: {
        price: null,
        sh:''
      },
      tableLoading: false,
      ruleValidate: {
        price: [
          { required: true, type: 'number', message: '提现金额不能为空', trigger: 'blur' }
        ],
      },
      count: 0,
      page: 1,
      pageSize: 10,
      tableData: [],
      columns: [
        {
          title: '序号',
          type: 'index',
          width: 80
        },
        {
          title: '商户名称',
          key: 'name'
        },
        {
          title: '申请账户',
          key: 'username'
        },
        {
          title: '支付宝账户',
          key: 'aliphone'
        },
        {
          title: '账户姓名',
          key: 'realname'
        },
        {
          title: '提现金额',
          key: 'price'
        },
        {
          title: '申请时间',
          key: 'createtime'
        },
        {
          title: '状态',
          key: 'ispass',
          render: (h, params) => {
            const waitState = `等待审核`
            const succState = `审核通过`
            const errState = `审核拒绝`
            h('a', {}, '')
            if (params.row.ispass == 0) {
              return h('a', {
                style: {
                  color: '#f90'
                }
              }, waitState)
            } else if (params.row.ispass == 1) {
              return h('a', {}, succState)
            }else if (params.row.ispass == 2) {
              return h('a', {
                style: {
                  color: '#ed3f14'
                }
              }, errState)
            } else {
              return  h('a', {}, waitState)
            }
          }
        }
      ],
      seeInfoData: {}
    }
  },
  created () {
    this.getCashInfo()
    this.getTableData()
  },
  methods: {
    onClickSearch () {

    },
    getTableData () {
      let d = {
        userid: sessionStorage.userid,
        pagesize: this.pageSize,
        page: this.page
      }
      serverApi('/putforward/auditshow', d,
        response => {
          console.log(response)
          if (response.data.code == 0) {
            this.count = response.data.data.count
            this.tableData = response.data.data.result
          } else {
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          console.log(error)
        }
      )
    },
    seeMyRecords (str) {
      this.stepNum = 0
      this.formItem.price = null
      this.action = str
    },
    nextStepApply (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.stepNum = 1
        }
      })
    },
    handleReset (name) {
      this.$refs[name].resetFields()
    },
    changePage (e) {
      this.page = e
      this.getTableData()
    },
    onChangeSize (e) {
      this.pageSize = e
      this.getTableData()
    },
    getCashInfo () {
      // 获取可提现金额 商户的收款账号 姓名
      this.$store.commit('pageLoading', true)
      serverApi('/putforward/showmoney', {userid: sessionStorage.userid},
        response => {
          this.$store.commit('pageLoading', false)
          if (response.data.code == 0) {
            this.seeInfoData = response.data.data
            this.maxApplyNum = Number(this.seeInfoData.balance)>50000 ? 50000 : Number(this.seeInfoData.balance)
          } else {
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          this.$store.commit('pageLoading', false)
          console.log(error)
        }
      )
    },
    toggleSeeFee () {
      this.seeFee = !this.seeFee
    },
    confirmApply () {
      this.submitLoading = true
      let d = {
        userid: sessionStorage.userid,
        price: this.formItem.price
      }
      serverApi('/putforward/withdrawal', d,
        response => {
          if (response.data.code == 0) {
            this.stepNum = 2
            this.$Notice.success({
              title: '提现申请成功',
              desc: '您的申请已提交，等待后台审核通过后金额将在2小时内到账。'
            })
          } else {
            this.$Message.warning(response.data.msg)
          }
          this.submitLoading = false
        },
        error => {
          this.submitLoading = false
          this.$Message.error('网络错误！')
        }
      )
    },
    seeMyRecordsFinaly () {
      this.getTableData()
      this.action = 'records'
    }
  }
}
</script>
<style lang="less" scoped>
.head{
  padding-bottom: 16px;
}
.tips {
  h4{
    font-size: 14px;
  }
  p{
    font-size: 12px;
    margin-top: 10px;
  }
}
.infoitem{
  margin-bottom: 24px;
}
.infovalue{
  font-size: 14px;
  color: #999;
  vertical-align: baseline;
  &.money{
    font-size: 16px;
  }
}
.apply-succ{
  text-align: center;
  margin-bottom: 40px;
  h4{
    margin-top: 10px;
    font-size: 18px;
    color: #444;
  }
  p{
    color: #999;
    margin-top: 5px;
  }
}
.applyable-fee{
  margin-left: 14px;
  span{
    color: #f60;
    font-weight: 600;
    // font-size: 14px;
  }
}
</style>

