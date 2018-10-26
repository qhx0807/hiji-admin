<template>
  <div class="box">
    <Card :bordered="false" class="mb10">
      <div class="shop-img">
        <img src="http://cdn.cqyyy.cn/cutdown.png" alt="">
      </div>
      <div class="tips">
        <h4><span style="font-size:14px;font-weight:500">新增砍价活动</span></h4>
        <p>
          编辑砍价活动信息
          <router-link :to="{name: 'CutDownPrice'}">返回【活动列表】</router-link>
        </p>
      </div>
      <div class="clear-fix"></div>
    </Card>
    <Card :bordered="false" class="mb10">
      <Form :model="addData" ref="form" :rules="ruleValidate" :label-width="80">
        <Row>
          <Col span="6">
            <FormItem label="选择商品" prop="starttime">
              <Input v-model="addData.starttime" placeholder="Enter your name"></Input>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="选择商品" prop="starttime">
              <Input v-model="addData.starttime" placeholder="Enter your name"></Input>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="选择商品" prop="starttime">
              <Input v-model="addData.starttime" placeholder="Enter your name"></Input>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="选择商品" prop="starttime">
              <Input v-model="addData.starttime" placeholder="Enter your name"></Input>
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
  name: 'CutDownPriceAdd',
  data () {
    return {
      addData: {
        type: 1,
        starttime: '',
        endtime: '',
        bargintime: '',
        peoplenum: '',
        residue: '',
        topprice: '',
        lowerprice: 0,
        goodsid: '',
        goodstypeid: '',
        goodsprice: '',
        msgcontent: '',
        lastmsg: '',
        ison: 0,
        rule: '',
        shareimg: '',
        title: '',
        desc: '',
        cutrules: ''
      },
      ruleValidate: {
        starttime: [
          { required: true, message: '请选择开始时间', trigger: 'blur' }
        ],
        endtime: [
          { required: true, message: '请选择结束时间', trigger: 'blur' }
        ],
      }
    }
  },
  created () {
    let cutrules = [
      {rank: '10', maxprice: '20'},
      {rank: '20', maxprice: '10'},
    ]
  },
  methods: {}
}
</script>
<style lang="less" scoped>
.shop-img{
  width: 60px;
  height: 60px;
  float: left;
  img{
    height: 100%;
    width: 100%;
  }
}
.tips{
  padding-left: 70px;
  h4{
    margin-top: 10px;
  }
  p{
    margin-top: 5px;
  }
}
</style>
