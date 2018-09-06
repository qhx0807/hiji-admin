<template>
  <div class="">
    <Card :bordered="false" class="mb10">
      <div class="shop-img">
        <img src="../../images/order.png" alt="">
      </div>
      <div class="tips">
        <h4><span style="font-size:14px;font-weight:500">编辑限购商品</span></h4>
        <p>
          添加限购商品。限购时间，限购数量。
          <router-link :to="{name: 'ShopGoodsXg'}">返回【限购商品列表】</router-link>
        </p>
      </div>
      <div class="clear-fix"></div>
    </Card>
    <Card :bordered="false">
      <Form :model="addData" :label-width="120" ref="from" :rules="rules">
        <Row>
          <Col span="14" offset="4">
            <FormItem label="选择限购商品" prop="goodsid" >
              <Select
                filterable
                remote
                clearable
                @on-change="onSelectGoods"
                :loading="searchLoading"
                v-model="addData.goodsid"
                :remote-method="onSearchGoods"
                placeholder="选择商品">
                <Option v-for="(item, index) in goodsData" :disabled="item.isbuy == 1" :key="item.id" :value="item.id">{{item.goodsname}}</Option>
              </Select>
            </FormItem>
            <FormItem style="margin-bottom:12px" v-show="selectedGoods.id">
              <div class="goods-info">
                <Row>
                  <Col span="24"><span class="label">商品名称：</span><span class="value">{{selectedGoods.goodsname}}</span></Col>
                  <Col span="8">
                    <p><span class="label">价格：</span> <span class="value">{{selectedGoods.goodsprice}}</span></p>
                    <p><span class="label">商户：</span> <span class="value">{{selectedGoods.merchantname}}</span></p>
                  </Col>
                  <Col span="8">
                    <p><span class="label">库存：</span> <span class="value">{{selectedGoods.goodsstock}}</span></p>
                    <p><span class="label">分类：</span> <span class="value">{{selectedGoods.categoryname}}</span></p>
                  </Col>
                  <Col span="4">
                    <img v-imgview :src="selectedGoods.goodsimg" style="height:60px" alt="">
                  </Col>
                </Row>
              </div>
            </FormItem>
            <FormItem label="选择属性" v-if="selectedGoods.goodstype && selectedGoods.goodstype.length > 0">
              <RadioGroup v-model="addData.typeid">
                <Radio v-for="(item, index) in selectedGoods.goodstype" :key="index" :label="item.id">{{item.typename}}</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="限购开始时间" prop="starttime">
              <DatePicker type="datetime" style="width:200px" placeholder="选择时间" @on-change="onSelectStartDate"></DatePicker>
            </FormItem>
            <FormItem label="限购结束时间" prop="endtime">
              <DatePicker type="datetime" style="width:200px" placeholder="选择时间"  @on-change="onSelectEndDate"></DatePicker>
            </FormItem>
            <FormItem label="限购数量" prop="buynum">
              <InputNumber :min="0" style="width:200px" v-model="addData.buynum" placeholder="输入数量"></InputNumber>
            </FormItem>
            <FormItem>
              <Button type="primary" @click="onClickSubmit" :loading="submitLoading">提交</Button>
              <Button type="default" @click="onClickBack" style="margin-left: 10px">返回</Button>
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
  name: 'ShopGoodsXgAdd',
  data () {
    return {
      submitLoading: false,
      searchLoading: false,
      goodsData: [],
      addData: {
        goodsid: '',
        typeid: '',
        starttime: '',
        endtime: '',
        buynum: 0
      },
      selectedGoods: {},
      rules: {
        goodsid: [
          { required: true, type: 'number', message: '请选择商品', trigger: 'blur' }
        ],
        starttime: [
          { required: true, message: '请选择开始时间', trigger: 'blur' }
        ],
        endtime: [
          { required: true, message: '请选择结束时间', trigger: 'blur' }
        ],
        buynum: [
          { required: true, type: 'number', message: '请输入数量', trigger: 'blur' }
        ],
      },
      selectTypes: []
    }
  },
  created () {
    this.getGoodsData(10, '')
  },
  methods: {
    getGoodsData (size, key) {
      let d = {
        page: 1,
        pagesize: size,
        like: key
      }
      serverApi('/goods/index', d,
        response => {
          console.log(response)
          if (response.data.code === 0){
            this.goodsData = response.data.data.result
          }else{
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          console.log(error)
          this.$Message.error('连接失败！')
        }
      )
    },
    onClickSubmit () {
      this.$refs.from.validate((valid) => {
        if (valid) {
          if (new Date(this.addData.endtime) - new Date(this.addData.starttime) <= 0) {
            this.$Message.warning('促销时间不符合规范！请检查')
            return false
          }
          this.submitLoading = true
          serverApi('/goods/isbuyadd', this.addData,
            response => {
              console.log(response)
              this.submitLoading = false
              if (response.data.code === 0){
                this.$Notice.success({
                  title: response.data.msg,
                  desc: '添加限购商品成功！'
                })
                this.$refs.from.resetFields()
                this.getGoodsData(10, '')
              }else{
                this.$Message.warning(response.data.msg)
              }
            },
            error => {
              this.submitLoading = false
              console.log(error)
              this.$Message.error('连接失败！')
            }
          )
        }
      })
    },
    onClickBack () {
      this.$router.push({name: 'ShopGoodsCx'})
    },
    onSearchGoods (e) {
      this.getGoodsData(999999, e)
    },
    getGoodsById (id) {
      this.$Message.loading({
        content: '加载中...',
        duration: 0
      })
      serverApi('/goods/goodsinfo', {id: id},
        response => {
          // console.log(response)
          this.$Message.destroy()
          if (response.data.code === 0){
            this.selectedGoods = response.data.data
          }else{
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          this.$Message.destroy()
          console.log(error)
          this.$Message.error('连接失败！')
        }
      )
    },
    onSelectGoods (id) {
      if (id) {
        this.getGoodsById(id)
      } else {
        this.selectedGoods = {}
        this.selectTypes.length = 0
      }
    },
    onSelectStartDate (e) {
      this.addData.starttime = e
    },
    onSelectEndDate (e) {
      this.addData.endtime = e
    }
  }
}
</script>
<style lang="less" scoped>
.shop-img{
  width: 80px;
  height: 80px;
  float: left;
  img{
    height: 100%;
    width: 100%;
  }
}
.tips{
  padding-left: 100px;
  h4{
    margin-top: 17px;
  }
}
.goods-info{
  border: 1px solid #ddd;
  padding-left: 8px;
  border-radius: 4px;
}
</style>
