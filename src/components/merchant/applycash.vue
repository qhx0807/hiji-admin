<template>
  <div class="box">
    <Card>
      <div class="tips">
        <h4 v-show="action == 'apply'">申请提现</h4>
        <h4 v-show="action == 'records'">我的提现申请记录</h4>
        <p v-show="action == 'apply'">填写正确的申请信息，将会在通过审核后打款至商户支付宝账户. <a @click="seeMyRecords('records')" href="javascript: void(0)">查看提现申请记录</a></p>
        <p v-show="action == 'records'">此商户的申请提现记录，详情请咨询【<a>宏帆Hi集</a>】  <a @click="seeMyRecords('apply')" href="javascript: void(0)">去申请提现</a></p>
      </div>
    </Card>
    <Card style="margin-top:10px" v-show="action == 'apply'">
      <Row>
        <Col span="24">
          <Steps :current="stepNum" style="max-width:880px; margin:20px auto 0 auto">
            <Step title="填写信息" content="这里是该步骤的描述信息"></Step>
            <Step title="确认信息" content="这里是该步骤的描述信息"></Step>
            <Step title="完成" content="这里是该步骤的描述信息"></Step>
          </Steps>
        </Col>
        <Col span="24">
          <div style="max-width: 650px;margin:0 auto; padding-top: 40px;">
            <div v-show="stepNum == 0">
              <Form ref="formValidate" :model="formItem" :label-width="80" :rules="ruleValidate" >
                <FormItem label="提现金额" prop="price">
                  <InputNumber
                    :max="9999999999999999"
                    :min="0"
                    v-model="formItem.price"
                    style="width: 400px"
                    placeholder="输入提现金额"
                    :formatter="value => `￥ ${value}`.replace(/B(?=(d{3})+(?!d))/g, ',')"
                    :parser="value => value.replace(/$s?|(,*)/g, '')"
                    ></InputNumber>
                  <p><a>点击查看可提现金额</a></p>
                </FormItem>
                <FormItem label="收款账户">
                  <Input v-model="formItem.sh" style="width: 400px" placeholder="输入收款账户"></Input>
                </FormItem>
                <FormItem label="收款人姓名">
                  <Input v-model="formItem.sh" style="width: 400px" placeholder="输入收款人姓名"></Input>
                </FormItem>
                <FormItem>
                  <Button type="primary" @click="nextStepApply('formValidate')">下一步</Button>
                  <Button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
                </FormItem>
              </Form>
            </div>
            <div style="max-width: 450px;" v-show="stepNum == 1">
              <Row class="infoitem">
                <Col span="24">
                  <Alert show-icon closable>确认申请后，资金将直接打入此账户，无法退回。</Alert>
                </Col>
              </Row>
              <Row class="infoitem">
                <Col span="8" style="text-align:right">收款账户：</Col>
                <Col span="16"><p class="infovalue">18716742604</p></Col>
              </Row>
              <Row class="infoitem">
                <Col span="8" style="text-align:right">收款人：</Col>
                <Col span="16"><p class="infovalue">测试账户</p></Col>
              </Row>
              <Row class="infoitem">
                <Col span="8" style="text-align:right">提现金额：</Col>
                <Col span="16"><b class="infovalue money">￥500.00</b></Col>
              </Row>
              <Row class="infoitem">
                <Col span="13" style="text-align:right">
                  <Button type="primary">确认</Button>
                  <Button type="ghost" style="margin-left:8px">上一步</Button>
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
                <Col span="12"><p class="infovalue">18716742604</p></Col>
              </Row>
              <Row class="infoitem">
                <Col span="12" style="text-align:right">收款人：</Col>
                <Col span="12"><p class="infovalue">测试账户</p></Col>
              </Row>
              <Row class="infoitem" style="margin-bottom:35px;">
                <Col span="12" style="text-align:right">提现金额：</Col>
                <Col span="12"><b class="infovalue money">￥500.00</b></Col>
              </Row>
              <Row class="infoitem" >
                <Col span="24" style="text-align:center">
                  <Button type="primary">查看申请记录</Button>
                </Col>
              </Row>
            </div>
          </div>
        </Col>
      </Row>
    </Card>
    <Card style="margin-top: 10px" v-show="action == 'records'">
      12
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
      action: 'apply',
      formItem: {
        price: null,
        sh:''
      },
      ruleValidate: {
        price: [
          { required: true, type: 'number', message: '提现金额不能为空', trigger: 'blur' }
        ],
      }
    }
  },
  created () {
    // this.getTableData()
  },
  methods: {
    onClickSearch () {

    },
    getTableData () {
      serverApi('/api/find', '',
        response => {
          console.log(response)
          this.text = JSON.stringify(response)
        },
        error => {
          console.log(error)
        }
      )
    },
    seeMyRecords (str) {
      this.action = str
    },
    nextStepApply (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$Message.success('Success!')
        } else {
          this.$Message.error('Fail!')
        }
      })
    },
    handleReset (name) {
      this.$refs[name].resetFields()
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
</style>

