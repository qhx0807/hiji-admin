<template>
  <div class="box">
    <Spin fix v-if="loading"></Spin>
    <Card :bordered="false" class="mb10">满减活动规则设置
    <Button class="remove" type="error" @click="remove">删除活动</Button>
    </Card>
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
              <Select v-model="editData.enjoytype">
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
            <FormItem label="商户选择">
              <Button type="dashed" @click="optional">自选</Button>
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
    <Modal v-model="optionalModal" width="800">
      <p slot="header" style="text-align:center">
        <span>商户名称</span>
      </p>
      <Form :model="optionalData" ref="optionalform" :rules="rules" :label-width="80">
        <Row>
          <Col span="24">
            <FormItem label="搜索商户">
              <Input v-model="searchKey" placeholder="搜索关键字..." style="width: 200px"></Input>
              <Button type="primary" style="margin-left:8px" icon="ios-search" @click="searchUser">搜索</Button>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="24">
            <FormItem label="商户名称" >
              <!-- <div v-for="(item,index) in ceshiList" :key="index">
                <input  type="checkbox" name="userCeshi" v-model="userCeshi" :id="item.id" :value="item.departmentname">
                <label for="mike">{{item.departmentname}}</label>
              </div> -->

              <CheckboxGroup class="Checkbox" v-model="userCeshi">
                <Checkbox class="CheckboxChild" v-for="item in ceshiList" :label="item.id" :key="item.id">{{item.departmentname}}</Checkbox>
              </CheckboxGroup>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button @click="optionalModal = false">取消</Button>
        <Button type="primary" :loading="modal_loading" @click="optionalSave">保存</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import serverApi from '../../axios'
export default {
  name: 'PayDiscount',
  data () {
    return {
      editData: {
        equipment:[]
      },
      userEquipment: [],
      userCeshi: [],
      optionalData: {},
      ceshiList: [],
      loading: false,
      submitLoading: false,
      optionalModal: false,
      ceshilModal: false,
      searchKey: '',
      pageSize: 999,
      page: 1,
      rules: [],
      id: '',
      ruleValidate: {
        starttime: [
          { required: true, message: '请选择开始时间', trigger: 'blur', type: 'date' }
        ],
        endtime: [
          { required: true, message: '请选择结束时间', trigger: 'blur', type: 'date' }
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
            this.id = response.data.data.result[0].id
            if (response.data.data.result[0].equipment === 'all') {
              this.userCeshi = []
            } else {
              this.userCeshi = response.data.data.result[0].equipment
            }
            console.log(this.userEquipment)
            console.log(response.data.data.result[0].equipment)
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
      console.log(this.userCeshi)
      this.$refs.form.validate(valid => {
        if (valid) {
          this.submitLoading = true
          // this.editData.equipment = this.userEquipment.join(',')
          this.editData.equipment = JSON.stringify(this.userCeshi)
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
    },
    optional () {
      this.optionalModal = true
      let d = {
        pagesize: this.pageSize,
        page: this.page,
        like: this.searchKey
      }
      serverApi('/equipment/index', d,
        response => {
          if (response.data.code === 0) {
            console.log(response)
            this.ceshiList = response.data.data.result
            console.log(this.ceshiList)
          } else {
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          this.loading = false
          this.$Message.error(error.toString())
        }
      )
    },
    optionalSave () {
      this.optionalModal = false
      console.log(this.optionalData)
      console.log(this.userCeshi)
    },
    searchUser () {
      this.page = 1
      this.optional()
    },
     remove () {
      this.$Modal.confirm({
        title: '提示',
        content: '确定删除此活动？',
        loading: true,
        onOk: () => {
          console.log(this.id)
          serverApi('/paymentactive/paymentdel', { id: this.id },
            response => {
              if (response.data.code === 0) {
                this.$Message.success(response.data.msg)
                this.getTableData()
              } else {
                this.$Message.warning(response.data.msg)
              }
              this.$Modal.remove()
            },
            error => {
              this.$Modal.remove()
              this.$Message.error(error.toString())
            }
          )
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
.CheckboxChild {
  margin-right: 30px;
}
.remove {
  float: right;
  margin-top: -5px;
}
</style>
