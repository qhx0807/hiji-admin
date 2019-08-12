<template>
  <div class="box">
    <Card :bordered="false" class="mb10">
      <p>新增邮费模板</p>
    </Card>
    <Card :bordered="false">
       <Form :model="addData" :label-width="80">
        <Row>
          <Col span="6">
            <FormItem label="模板名称">
              <Input placeholder="请输入" v-model="addData.title"></Input>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="模板类型">
              <Select v-model="addData.typeid">
                <Option v-for="item in typeArr" :key="item.value" :value="item.value">{{item.name}}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="选择商户">
              <Select v-model="addData.merchantcode" filterable remote clearable :remote-method="getMerchantData">
                <Option v-for="item in merchantData" :value="item.merchantcode" :key="item.id">{{ item.name }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="地区">
              <a @click="addAreaShow = true"><Icon type='ios-add'/> 选择省级地区</a>
            </FormItem>
          </Col>
        </Row>
        <Row v-show="addData.typeid !== 1">
          <Col span="6">
            <FormItem label="首件数量" >
              <Input v-model="addData.snum"></Input>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="首件价格">
              <Input v-model="addData.sprice"></Input>
            </FormItem>

          </Col>
          <Col span="6">
            <FormItem label="续件数量">
              <Input v-model="addData.xnum"></Input>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="续件价格">
              <Input v-model="addData.xprice"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="6">
            <FormItem label="固定邮费价" v-show="addData.typeid === 1">
              <Input v-model="addData.price"></Input>
            </FormItem>
            <FormItem label="满件数量" v-show="addData.typeid !== 1">
              <Input v-model="addData.mnum"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="6">
            <FormItem >
              <Button type="primary" @click="onSubmit" :loading="loading">保 存</Button>
            </FormItem>
          </Col>
        </Row>
       </Form>
    </Card>

    <Modal width="460" v-model="addAreaShow">
      <p slot="header">添加区域</p>
      <div>
        <CheckboxGroup v-model="selectedArr">
          <Row>
            <Col span="8" style="padding-bottom: 8px" v-for="item in previenceData" :key="item.id" >
              <Checkbox :label="item.value">{{item.label}}</Checkbox>
            </Col>
          </Row>
        </CheckboxGroup>
        <Divider></Divider>
        <Checkbox v-model="allLabel" @on-change="onClickSelectAll">全选</Checkbox>
      </div>
    </Modal>
  </div>
</template>
<script>
import serverApi from '../../axios'
export default {
  name: 'PostageTempAdd',
  data () {
    return {
      addAreaShow: false,
      loading: false,
      addData: {
        typeid: 1,
        title: '',
        merchantcode: '',
        provincecode: '',
        snum: 0,
        provincename: '',
        sprice: 0,
        xnum: 0,
        xprice: 0,
        price: 0,
        mnum: ''
      },
      typeArr: [
        {
          name: '固定邮费',
          value: 1
        },
        {
          name: '按重量',
          value: 2
        },
        {
          name: '按件数',
          value: 3
        },
        {
          name: '按体积',
          value: 4
        },
      ],
      merchantData: [],
      previenceData: [],
      selectedArr: [],
      allLabel: false
    }
  },
  created () {
    this.getPrevienceData()
    this.getMerchantData('')
  },
  computed: {
    allArr () {
      let arr = []
      this.previenceData.forEach(item => {
        arr.push(item.value)
      })
      return arr
    }
  },
  watch: {
    selectedArr (n, o) {
      if (n.length !== this.allArr.length) {
        this.allLabel = false
      }
    }
  },
  methods: {
    getMerchantData (e) {
      let d = {
        page: 1,
        pagesize: 20,
        like: e
      }
      serverApi('/Merchant/index', d,
        response => {
          if (response.data.code === 0) {
            this.merchantData = response.data.data.result
          } else {
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          console.log(error)
        }
      )
    },
    getPrevienceData () {
      serverApi('/area/addressnew', null,
        response => {
          if (response.data.code === 0) {
            this.previenceData = response.data.data
          } else {
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          console.log(error)
        }
      )
    },
    onClickSelectAll (e) {
      if (e) {
        this.selectedArr = [].concat(this.allArr)
      } else {
        this.selectedArr = []
      }
    },
    onSubmit () {
      if (!this.addData.title || !this.addData.typeid) {
        this.$Message.warning('请输入信息')
        return false
      }
      this.loading = true
      this.addData.provincecode = this.selectedArr.join(',')
      serverApi('/transport/transportAdd', this.addData,
        response => {
          this.loading = false
          if (response.data.code === 0) {
            this.$Message.success(response.data.msg)
            this.$router.push({name: 'PostageTemp'})
          } else {
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          this.loading = false
          console.log(error)
          this.$Message.error(error.toString())
        }
      )
    }
  }
}
</script>
<style lang="less" scoped>

</style>
