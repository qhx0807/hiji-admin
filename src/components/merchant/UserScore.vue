<template>
  <div class="box">
    <Card :bordered="false">
      <Form ref="formInline" :label-width="90">
      <Row>
        <Col span="24">
          <FormItem label="会员查询">
            <Input type="text" size="large" style="width: 350px" v-model="phone" placeholder="手机号码..."></Input>
            <Button type="primary" style="margin-left:12px" :loading="serLoading" @click="onClickQuery">查询</Button>
          </FormItem>

        </Col>
      </Row>
      <Row>
        <Col span="24">
          <FormItem label="会员信息">
            <div class="user-box">
              <CellGroup v-show="userData.user_id">
                <Cell>
                  <Avatar size="large" :src="userData.avatar" />
                </Cell>
                <Cell title="手机号" :extra="userData.phone" >手机号</Cell>
                <Cell title="会员ID" :extra="userData.user_id" >会员ID</Cell>
                <Cell title="拥有积分" :extra="userData.intergral" >拥有积分</Cell>
                <Cell title="昵称" :extra="userData.nickname" >昵称</Cell>
                <Cell title="注册时间" :extra="userData.create_time" >注册时间</Cell>
              </CellGroup>
            </div>
            <div class="int-tips">
              <Alert type="warning" show-icon>
                业态兑换代码
                <span slot="desc">
                  01，兑换比例1元积1分，<br>
                  02，兑换比例20元积1分，<br>
                  03，兑换比例50元积1分。20和50的比例，金额不满整数，去零积整。
                </span>
              </Alert>
            </div>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="24">
          <FormItem label="业态代码">
            <RadioGroup v-model="busno" type="button" size="large">
              <Radio v-for="(item, index) in busArr" :key="index" :label="item.name"></Radio>
            </RadioGroup>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="24">
          <FormItem label="消费金额">
            <InputNumber
            size="large"
            :max="99999999"
            :min="0"
            v-model="money"
            style="width: 200px"
            ></InputNumber>
            (单位：元)
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="24">
          <FormItem >
            <Button type="primary" :loading="submitLoading" style="width: 100px" @click="onClickConfirm">确定</Button>
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
  name: 'UserScore',
  data () {
    return {
      serLoading: false,
      submitLoading: false,
      phone: '',
      busno: '01',
      money: 0,
      busArr: [
        {
          name: '01',
          value: '01'
        },
        {
          name: '02',
          value: '02'
        },
        {
          name: '03',
          value: '03'
        },
        {
          name: '04',
          value: '04'
        },
        {
          name: '05',
          value: '05'
        },
        {
          name: '06',
          value: '06'
        },
        {
          name: '07',
          value: '07'
        },
      ],
      userData: {}
    }
  },
  created () {},
  methods: {
    onClickQuery () {
      if (!this.phone || this.phone.length != 11) {
        this.$Message.warning('请输入正确的手机号！')
        return false
      }
      this.serLoading = true
      serverApi('/member/userinfodesk', {phone: this.phone},
        response => {
          if (response.data.code == 0) {
            console.log(response);
            this.userData = response.data.data
          } else {
            this.$Message.warning(response.data.msg)
          }
          this.serLoading = false
        },
        error => {
          this.serLoading = false
          console.log(error)
          this.$Message.error(error.toString())
        }
      )
    },
    onClickConfirm () {
      if (!this.userData.phone) {
        this.$Message.warning('请输入会员手机号！')
        return false
      }
      if (!this.money || this.money == 0) {
        this.$Message.warning('请输入消费金额！')
        return false
      }
      let d = {
        userids: this.userData.user_id,
        busno: this.busno,
        money: this.money,
        phone: this.userData.phone
      }
      this.submitLoading = true
      serverApi('/cxchange/integralindex', d,
        res => {
          this.submitLoading = false
          if (res.data.code === 0) {
            this.$Modal.confirm({
              title: '提示',
              loading: true,
              content: `请确认本次添加积分<b>${res.data.data}</b> 到 ${this.userData.phone} 用户账号里。工作人员务必核对好顾客小票上的信息和手机号后再点击确认。`,
              onOk: () => {
                serverApi('/cxchange/deskintegral', d,
                  response => {
                    if (response.data.code === 0) {
                      this.$Notice.success({
                        title: response.data.msg
                      })
                      this.phone = ''
                      this.busno = '01'
                      this.userData = {}
                      this.money = 0
                    } else {
                      this.$Notice.warning({
                        title: response.data.msg
                      })
                    }
                    this.submitLoading = false
                    this.$Modal.remove()
                  },
                  error => {
                    this.$Modal.remove()
                    this.submitLoading = false
                    console.log(error)
                    this.$Message.error(error.toString())
                  }
                )
              }
            })
          } else {
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          this.submitLoading = false
          console.log(error)
          this.$Message.error(error.toString())
        }
      )
    }
  }
}
</script>
<style lang="less" scoped>
.user-box{
  width: 250px;
  min-height: 140px;
  background-color: #f8f8f8;
}
.int-tips{
  position: absolute;
  left: 300px;
  top: 12px;
}
</style>
