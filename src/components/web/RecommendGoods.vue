<template>
  <div class="box">
    <Card :bordered="false" class="mb10">
      <Row>
        <Col span="6">
          <div class="tips">
            <p style="font-size:14px;">
              <img src="http://cdn.cqyyy.cn/redcmmond.png" alt="">
              首页推荐商品瀑布流。
              <a @click="onClickAdd"><Icon size="14" type="md-add" />添加商品</a>
            </p>
          </div>
        </Col>
        <Col span="18">
          <Row>
            <Col span="12">
              <Input v-model="goodsids" :placeholder="placeholder">
                <Select v-model="selectType" slot="prepend" style="width: 80px">
                  <Option value="1">商品ID</Option>
                  <Option value="2">分类ID</Option>
                </Select>
              </Input>
            </Col>
            <Col span="6" style="padding-left:8px;">
              <Select v-model="selectCity"  style="width: 80px">
                <Option value="0">通用</Option>
                <Option v-for="(item, index) in cityList" :key="index" :value="item.id">{{item.areaname}}</Option>
              </Select>
              <Button style="margin-left:12px">添加到推荐</Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
    <Card :bordered="false">
      <Row>
        <Col span="4">
          <Input prefix="ios-search" v-model="searchKeys" placeholder="搜索..."></Input>
        </Col>
      </Row>
    </Card>
    <Row>
      <Col span="24" class="hot-content">
      123
      </Col>
    </Row>

    <Modal v-model="addModal" width="750">
      <p slot="header" style="text-align:center">
        <span>添加推荐商品</span>
      </p>
      <Form :label-width="80">
        <FormItem label="商品ID" required>
          <Input type="textarea" v-model="goodsids" placeholder="请输入" />
          <Alert show-icon style="margin-top:10px">输入商品id, 多个以逗号分隔</Alert>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="addModal = false">取消</Button>
        <Button type="primary" :loading="modal_loading" @click="onClickSaveAdd">保存</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import serverApi from '../../axios'
export default {
  name: 'RecommendGoods',
  data () {
    return {
      searchKeys: '',
      addModal: false,
      modal_loading: false,
      cityList: [],
      hotGoods: [],
      goodsids: '',
      selectType: '1',
      selectCity: '0'
    }
  },
  created () {
    this.getCityList()
    // this.getHotGoodsList()
  },
  computed: {
    placeholder () {
      return this.selectType == '1' ? '输入商品ID,以逗号分隔' : '商品分类ID'
    }
  },
  methods: {
    getCityList () {
      serverApi('/area/index', {},
        response => {
          if (response.data.code === 0){
            // console.log(response)
            this.cityList = response.data.data
          }else{
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          console.log(error)
        }
      )
    },
    getHotGoodsList () {
      this.$store.commit('pageLoading', true)
      serverApi('/web/hotgoodslist', null,
        response => {
          console.log(response)
          if (response.data.code === 0) {
            this.hotGoods = response.data.data
          } else {
            this.$Message.warning(response.data.msg)
          }
          this.$store.commit('pageLoading', false)
        },
        error => {
          console.log(error)
          this.$store.commit('pageLoading', false)
        }
      )
    },
    onClickAdd () {
      this.addModal = true
    },
    onClickSaveAdd () {

    },
  }
}
</script>
<style lang="less" scoped>
.tips{
  p{
    margin: 0;
    img{
      vertical-align: bottom;
      height: 30px;
    }
  }
}
.hot-content{
  padding: 16px;
  border: 1px solid #dedede;
  height: 570px;
  overflow: auto;
  background-color: #f8f8f8;
}
</style>
