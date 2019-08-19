<template>
  <div class="box">
    <Card :bordered="false" class="mb10">
      <p>修改邮费模板</p>
    </Card>
    <Card :bordered="false">
       <Form :model="addData" :label-width="80">
        <Row>
          <Col span="6">
            <FormItem label="模板名称">
              <Input v-model="addData.title"></Input>
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem label="计价方式：">
              <RadioGroup v-model="addData.typeid">
                <Radio :label="1">固定邮费</Radio>
                <Radio :label="2">按重量</Radio>
                <Radio :label="3">按件数</Radio>
                <Radio :label="4">按体积</Radio>
              </RadioGroup>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="选择商户" >
              <Select v-model="addData.merchantcode" filterable clearable disabled>
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
        <Row>
          <Col span="24" v-show="addData.typeid === 2">
            <FormItem label="运费设置：">
              <div style="width: 1000px;height: 50px;">
                <span style="float: left;line-height:50px;margin: 0 5px;">默认运费</span> <Input v-model="addData.snum" style="float: left;width: 80px;line-height:50px;"></Input>
                <span style="float: left;line-height:50px;margin: 0 5px;">克内</span><Input v-model="addData.sprice" style="float: left;width: 80px;line-height:50px;"></Input><span style="float: left;line-height:50px;margin: 0 5px;">元，</span>
              </div>
              <div style="width: 1000px;height: 50px;">
                <span style="float: left;line-height:50px;margin: 0 5px;">超过<span>{{this.addData.snum}}克</span>基础运费</span><Input v-model="addData.jcprice" style="float: left;width: 80px;line-height:50px;"></Input><span style="float: left;line-height:50px;margin: 0 5px;">元，</span>
                <span style="float: left;line-height:50px;margin: 0 5px;">每增加</span><Input v-model="addData.xnum" style="float: left;width: 80px;line-height:50px;"></Input><span style="float: left;line-height:50px;margin: 0 5px;">克，</span>
                <span style="float: left;line-height:50px;margin: 0 5px;">增加运费</span><Input v-model="addData.xprice" style="float: left;width: 80px;line-height:50px;"></Input><span style="float: left;line-height:50px;margin: 0 5px;">元，</span>
              </div>
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem label="特殊包邮条件：" v-show="addData.typeid === 2">
              <span style="float: left;line-height:50px;margin: 0 5px;">满/克</span><Input v-model="addData.mnum" style="float: left;width: 80px;line-height:50px;"></Input><span style="float: left;line-height:50px;margin: 0 5px;">包邮</span>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="24" v-show="addData.typeid === 3">
            <FormItem label="运费设置：">
              <div style="width: 1000px;height: 50px;">
                <span style="float: left;line-height:50px;margin: 0 5px;">默认运费</span> <Input v-model="addData.snum" style="float: left;width: 80px;line-height:50px;"></Input>
                <span style="float: left;line-height:50px;margin: 0 5px;">件内</span><Input v-model="addData.sprice" style="float: left;width: 80px;line-height:50px;"></Input><span style="float: left;line-height:50px;margin: 0 5px;">元，</span>
              </div>
              <div style="width: 1000px;height: 50px;">
                <span style="float: left;line-height:50px;margin: 0 5px;">超过<span>{{this.addData.snum}}件</span>基础运费</span><Input v-model="addData.jcprice" style="float: left;width: 80px;line-height:50px;"></Input><span style="float: left;line-height:50px;margin: 0 5px;">元，</span>
                <span style="float: left;line-height:50px;margin: 0 5px;">每增加</span><Input v-model="addData.xnum" style="float: left;width: 80px;line-height:50px;"></Input><span style="float: left;line-height:50px;margin: 0 5px;">件，</span>
                <span style="float: left;line-height:50px;margin: 0 5px;">增加运费</span><Input v-model="addData.xprice" style="float: left;width: 80px;line-height:50px;"></Input><span style="float: left;line-height:50px;margin: 0 5px;">元，</span>
              </div>
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem label="特殊包邮条件：" v-show="addData.typeid === 3">
              <span style="float: left;line-height:50px;margin: 0 5px;">满/件</span><Input v-model="addData.mnum" style="float: left;width: 80px;line-height:50px;"></Input><span style="float: left;line-height:50px;margin: 0 5px;">包邮</span>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="24" v-show="addData.typeid === 4">
            <FormItem label="运费设置：">
              <div style="width: 1000px;height: 50px;">
                <span style="float: left;line-height:50px;margin: 0 5px;">默认运费</span> <Input v-model="addData.snum" style="float: left;width: 80px;line-height:50px;"></Input>
                <span style="float: left;line-height:50px;margin: 0 5px;">m<sup>3</sup>内</span><Input v-model="addData.sprice" style="float: left;width: 80px;line-height:50px;"></Input><span style="float: left;line-height:50px;margin: 0 5px;">元，</span>
              </div>
              <div style="width: 1000px;height: 50px;">
                <span style="float: left;line-height:50px;margin: 0 5px;">超过<span>{{this.addData.snum}}m<sup>3</sup></span>基础运费</span><Input v-model="addData.jcprice" style="float: left;width: 80px;line-height:50px;"></Input><span style="float: left;line-height:50px;margin: 0 5px;">元，</span>
                <span style="float: left;line-height:50px;margin: 0 5px;">每增加</span><Input v-model="addData.xnum" style="float: left;width: 80px;line-height:50px;"></Input><span style="float: left;line-height:50px;margin: 0 5px;">m<sup>3</sup>，</span>
                <span style="float: left;line-height:50px;margin: 0 5px;">增加运费</span><Input v-model="addData.xprice" style="float: left;width: 80px;line-height:50px;"></Input><span style="float: left;line-height:50px;margin: 0 5px;">元，</span>
              </div>
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem label="特殊包邮条件：" v-show="addData.typeid === 4">
              <span style="float: left;line-height:50px;margin: 0 5px;">满/m<sup>3</sup></span><Input v-model="addData.mnum" style="float: left;width: 80px;line-height:50px;"></Input><span style="float: left;line-height:50px;margin: 0 5px;">包邮</span>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="6">
            <FormItem label="固定邮费价" v-show="addData.typeid === 1">
              <Input v-model="addData.price"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="6">
            <FormItem >
              <div>
                <p style="font-sizi: 16px">单位说明：按重量/克，按体积/立方米</p>
              </div>
            </FormItem>
          </Col>
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
  name: 'PostageTempEdit',
  data () {
    return {
      addAreaShow: false,
      loading: false,
      addData: {
        typeid: '',
        title: '',
        merchantcode: '',
        provincecode: '',
        snum: 0,
        jcprice: 0,
        provincename: '',
        sprice: 0,
        xnum: 0,
        xprice: 0,
        price: 0,
        mnum: ''
      },
      merchantData: [],
      previenceData: [],
      selectedArr: [],
      allLabel: false
    }
  },
  created () {
    this.getTempData()
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
    getTempData () {
      serverApi('/transport/transportGetById', {id: this.$route.params.id},
        response => {
          console.log(response)
          if (response.data.code === 0) {
            this.addData = response.data.data
            this.selectedArr = response.data.data.provincecode.split(',') || []
          } else {
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          this.$Message.error(error.toString())
        }
      )
    },
    getMerchantData (e) {
      let d = {
        page: 1,
        pagesize: 999999,
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
      let provincenameArr = []
      let arr = this.previenceData.filter(item => this.selectedArr.includes(item.value))
      arr.forEach(item => {
        provincenameArr.push(item.label)
      })
      let provincename = provincenameArr.join(',')

      if (!this.addData.title || !this.addData.typeid) {
        this.$Message.warning('请输入信息')
        return false
      }
      let d = {}
      this.loading = true
      this.addData.provincecode = this.selectedArr.join(',')
      if(this.addData.typeid === 1){
          d  = {
          id: this.$route.params.id,
          typeid: this.addData.typeid,
          title: this.addData.title,
          merchantcode: this.addData.merchantcode,
          provincecode: this.addData.provincecode,
          price: this.addData.price,
          provincename: provincename
        }
      } else {
          d  = {
          id: this.$route.params.id,
          typeid: this.addData.typeid,
          title: this.addData.title,
          merchantcode: this.addData.merchantcode,
          provincecode: this.addData.provincecode,
          snum: this.addData.snum,
          sprice: this.addData.sprice,
          jcprice: this.addData.jcprice,
          xnum: this.addData.xnum,
          xprice: this.addData.xprice,
          mnum: this.addData.mnum,
          provincename: provincename
        }
      }
      serverApi('/transport/transportAdd', d,
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
