<template>
  <div class="box">
    <Spin fix v-if="loading"></Spin>
    <Card :bordered="false" class="mb10">满减活动规则设置</Card>
    <Card :bordered="false">
      <Form :model="editData" ref="form" :rules="ruleValidate" :label-width="80">
        <Row>
          <Col span="6">
            <FormItem label="活动名称" prop="name">
              <Input v-model="editData.name" ></Input>
            </FormItem>
            <FormItem label="开始时间" >
              <Input v-model="editData.startime" ></Input>
              <!-- <DatePicker type="datetimerange" @on-change="onSelectDateTime" style="width:100%" placeholder="选择起始日期"></DatePicker> -->
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="限制条件" >
              <Select v-model="editData.isuse">
                <Option :value="1">每天</Option>
                <Option :value="2">每周</Option>
                <Option :value="3">工作日</Option>
                <Option :value="4">休息日</Option>
              </Select>
            </FormItem>
            <FormItem label="结束时间" >
              <Input v-model="editData.endtime" ></Input>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="享受次数"  prop="frequency">
              <Input v-model="editData.frequency" ></Input>
            </FormItem>
            <FormItem label="活动类型" prop="type">
              <Select v-model="editData.type">
                <Option :value="1">减钱</Option>
                <Option :value="2">折扣</Option>
                <Option :value="3">随机减</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="活动状态">
              <Select v-model="editData.isuse">
                <Option :value="1">发布</Option>
                <Option :value="0">停止</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row v-for="(item, index) in rules" :key="index">
          <Col span="5" >
            <FormItem label="规则">
              <Input v-model="item.discount" ></Input>
            </FormItem>
          </Col>
          <Col span="5" >
            <FormItem label="最大值" >
              <InputNumber size="small" :max="999999" style="width:150px" :min="0" v-model="item.max"></InputNumber>
            </FormItem>
          </Col>
          <Col span="5" >
            <FormItem label="最小值">
              <InputNumber  size="small" :max="999999" style="width:150px" :min="0" v-model="item.min"></InputNumber>
            </FormItem>
          </Col>
          <Col span="5" >
            <Button style="margin-left:10px" type="error" @click="deleteRules(index)">删除</Button>
          </Col>
        </Row>
        <Row>
         <Col span="24">
            <FormItem>
              <Button :loading="submitLoading"  type="primary" @click="onSubmitData">提交保存</Button>
              <Button style="margin-left:10px" @click="onClickBack">返回</Button>
              <Button style="margin-left:10px" type="success" @click="addRules">添加规则</Button>
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
  name: 'PayDiscount',
  data () {
    return {
      editData: {},
      loading: false,
      submitLoading: false,
      rules: [],
      ruleValidate: {
        starttime: [
          { required: true, message: '请选择开始时间', trigger: 'blur', type: 'date' }
        ],
        endtime: [
          { required: true, message: '请选择结束时间', trigger: 'blur', type: 'date' }
        ],
        isuse: [
          { required: true, message: '请选择条件', trigger: 'blur', type: 'number' }
        ],
        frequency: [
          { required: true, message: '请选择条件', type: 'number', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入分享描述', trigger: 'blur' }
        ],
        ison: [
          { required: true, message: '请选择活动状态', trigger: 'blur', type: 'number' }
        ],
        type: [
          { required: true, message: '请选择活动类型', trigger: 'blur', type: 'number' }
        ]
      },
    }
  },
  created () {
    this.inquire()
  },
  methods: {
    inquire () {
      this.loading = true
      serverApi('/paymentactive/paymentlist', null,
        response => {
          if (response.data.code === 0) {
            console.log(response)
            this.editData = response.data.data.result[0]
            this.rules = response.data.data.result[0].regular
          } else {
            this.$Message.warning(response.data.msg)
          }
          this.loading = false
        },
        error => {
          this.loading = false
          this.$Message.error(error.toString())
        }
      )
    },
    addRules () {
      this.rules.push({
        discount: 0,
        discountid: 1,
        max: 0,
        min: 0
      })
    },
    deleteRules (index) {
      this.rules.splice(index,1)
    },
    onClickBack () {
      this.$router.back()
    },
    onSubmitData () {
      console.log(this.editData)
      this.$refs.form.validate(valid => {
        if (valid) {
          this.submitLoading = true
          this.editData.regular = JSON.stringify(this.rules)
          serverApi('/paymentactive/paymentedit', this.editData,
            response => {
              if (response.data.code === 0) {
                console.log(response)
                this.$Message.success(response.data.msg)
              } else {
                this.$Message.warning(response.data.msg)
              }
              this.submitLoading = false
            },
            error => {
              this.submitLoading = false
              console.log(error)
              this.$Message.error(error.toString())
            }
          )
        } else {
          this.$Message.warning('验证失败')
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.box{
  position: relative;
}
</style>
