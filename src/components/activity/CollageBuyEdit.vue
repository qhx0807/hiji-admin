<template>
  <div class="box">
    <Card :bordered="false" class="mb10">
      <div class="shop-img">
        <img src="http://cdn.cqyyy.cn/collage.png" alt="">
      </div>
      <div class="tips">
        <h4><span style="font-size:14px;font-weight:500">编辑商品拼团活动</span></h4>
        <p>编辑商品拼团活动 <router-link :to="{name: 'CollageBuy'}">返回【拼团列表】</router-link></p>
      </div>
      <div class="clear-fix"></div>
    </Card>
    <Card :bordered="false">
      <Form :model="editData" ref="form" :rules="ruleValidate" :label-width="80">
        <Row>
          <Col span="6">
            <FormItem label="选择商品" prop="goodsname">
              <Input v-model="editData.goodsname" disabled></Input>
            </FormItem>
            <FormItem label="开始时间" required>
              <Input v-model="editData.starttime" ></Input>
              <!-- <DatePicker type="datetimerange" @on-change="onSelectDateTime" style="width:100%" placeholder="选择起始日期"></DatePicker> -->
            </FormItem>
            <FormItem label="拼团类型" prop="type">
              <Select v-model="editData.type">
                <Option :value="1">普通拼团</Option>
                <Option :value="2">新客专享拼团</Option>
              </Select>
            </FormItem>
            <FormItem label="分享图片">
              <Input v-model="editData.shareimg"></Input>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="商品属性" prop="goodstypeid">
              <Input v-model="editData.goodstypeid" disabled></Input>
            </FormItem>
            <FormItem label="结束时间" required>
              <Input v-model="editData.endtime" ></Input>
            </FormItem>
            <FormItem label="分享标题"  prop="sharetitle">
              <Input v-model="editData.sharetitle"></Input>
            </FormItem>
            <FormItem>
              <UploadFile @uploadSucc="onUploadSucc"></UploadFile>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="商品价格"  prop="goodsprice">
              <Input v-model="editData.goodsprice" ></Input>
            </FormItem>
            <FormItem label="有效时间" required>
              <Poptip trigger="focus" word-wrap width="220"  content="提示：活动有效时间以小时(h)为单位">
                <InputNumber :max="999999999" style="width:100%" :min="0" v-model="bargintime"></InputNumber>
              </Poptip>
              <Tooltip placement="top" max-width="240" content="用户发起拼团后的有效时间，以小时(h)为单位。 如：30分钟=0.5小时">
                <Icon type="ios-alert" size="20"/>
              </Tooltip>
            </FormItem>
             <FormItem label="分享内容"  prop="sharedesc">
              <Input v-model="editData.sharedesc"></Input>
            </FormItem>
            <FormItem label="已拼人数"  prop="countnum">
              <InputNumber v-model="editData.countnum" :min="0" ></InputNumber>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="活动状态" prop="ison">
              <Select v-model="editData.ison">
                <Option :value="1">发布</Option>
                <Option :value="0">停止</Option>
              </Select>
            </FormItem>
            <FormItem label="团购价格"  prop="groupprice">
              <InputNumber :max="999999999" style="width:100%" :min="0" v-model="editData.groupprice"></InputNumber>
            </FormItem>
            <FormItem label="成团人数"  prop="peoplenum">
              <InputNumber :max="999999999" style="width:100%" :min="1" v-model="editData.peoplenum"></InputNumber>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="24">
            <FormItem label="拼团规则">
              <Input v-model="editData.rule"></Input>
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem>
              <Button :loading="submitLoading" @click="onClickSubmit" type="primary">提交保存</Button>
              <Button style="margin-left:10px" @click="$router.back()">返回</Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Card>
  </div>
</template>
<script>
import serverApi from '../../axios'
import UploadFile from '../common/UploadFile'
export default {
  name: 'CollageBuyEdit',
  components: {
    UploadFile
  },
  data () {
    return {
      bargintime: 0,
      editData: {},
      ruleValidate: {
        starttime: [
          { required: true, message: '请选择开始时间', trigger: 'blur' }
        ],
        endtime: [
          { required: true, message: '请选择结束时间', trigger: 'blur' }
        ],
        goodsid: [
          { required: true, message: '请选择商品', type: 'number', trigger: 'blur' }
        ],
        goodsprice: [
          { required: true, message: '请选择商品', trigger: 'blur' }
        ],
        peoplenum: [
          { required: true, message: '请输入', type: 'number', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请输入', type: 'number', trigger: 'blur' }
        ],
        sharetitle: [
          { required: true, message: '请输入分享标题', trigger: 'blur' }
        ],
        sharedesc: [
          { required: true, message: '请输入分享描述', trigger: 'blur' }
        ],
        shareimg: [
          { required: true, message: '分享图片', trigger: 'blur' }
        ],
      },
      goodsList: [],
      goodsTypeData: [],
      selectLoading: false,
      submitLoading: false,
    }
  },
  created () {
    this.getCollageData()
  },
  methods: {
    getCollageData () {
      let d = {
        id: this.$route.params.id
      }
      this.$store.commit('pageLoading', true)
      serverApi('/activity/collageinfo', d,
        response => {
          if (response.data.code === 0) {
            console.log(response)
            this.bargintime = response.data.data.bargintime / 3600
            this.editData = response.data.data
          } else {
            this.$Message.warning(response.data.msg)
          }
          this.$store.commit('pageLoading', false)
        },
        error => {
          this.$store.commit('pageLoading', false)
        }
      )
    },
    onUploadSucc (path) {
      this.editData.shareimg = path
    },
    onClickSubmit () {
      this.editData.bargintime = this.bargintime * 3600
      this.$refs.form.validate(valid => {
        if (valid) {
          this.submitLoading = true
          serverApi('/activity/collageedit', this.editData,
            response => {
              if (response.data.code === 0) {
                this.$Message.success('保存成功！')
                this.$router.push({name: 'CollageBuy'})
              } else {
                this.$Message.warning(response.data.msg)
              }
               this.submitLoading = false
            },
            error => {
              this.submitLoading = false
              console.log(error);
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
</style>
