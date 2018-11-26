<template>
  <div class="box">
    <Card :bordered="false">
      <div class="head">
        <img v-imgview class="head-img" src="http://cdn.cqyyy.cn/huache_address.png" alt="">
        <div class="car-name">
          <Dropdown @on-click="onSelect">
            <a href="javascript:void(0)" style="font-size:18px">
                {{currname.name}}
              <Icon type="ios-arrow-down"></Icon>
            </a>
            <DropdownMenu slot="list">
              <DropdownItem v-for="(item, index) in goodsList" :key="index" :name="item.id">{{item.name}}</DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <p style="margin-top:10px">{{currname.desc}}</p>
        </div>
      </div>
      <Table :loading="loading" size="small" :columns="columns" :data="tableData"></Table>
    </Card>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  name: 'AcuLog',
  data () {
    return {
      currname: {name: '1号花车', id: '1', desc: '玩具或手工艺品（如：儿童玩具、项链手环等工艺品）'},
      tableData: [],
      goodsList: [
        {name: '1号花车', id: '1', desc: '玩具或手工艺品（如：儿童玩具、项链手环等工艺品）'},
        {name: '2号花车', id: '2', desc: '成品小吃、预包装食品（如：冰糖葫芦、矿泉水、棉花糖等）'},
        {name: '3号花车', id: '3', desc: '热饮小吃（如：奶茶、酸奶粉、麻辣串串等）'},
        {name: '4号花车', id: '4', desc: '热饮小吃（如：奶茶、酸奶粉、麻辣串串等）'},
        {name: '5号花车', id: '5', desc: '冷饮小吃（如：凉粉、凉面、冰粉、凉虾等）'}
      ],
      columns: [
        {
          title: '姓名',
          key: 'contacts'
        },
        {
          title: '加价',
          key: 'contacts',
          render: (h, params) => {
            return h('span', {
              style: {
                color: '#F90',
                fontSize: '16px'
              }
            }, '+50')
          }
        },
        {
          title: '电话',
          key: 'tel'
        },
        {
          title: '身份证号',
          key: 'idnum'
        },
        {
          title: '出价',
          key: 'price',
          render: (h, params) => {
            return h('span', {
              style: {
                color: '#F90',
                fontSize: '18px'
              }
            }, params.row.price)
          }
        },
        {
           title: '竞价时间',
          key: 'createtime'
        }
      ],
      loading: false,
    }
  },
  created () {
    this.getToken()
  },
  watch: {
    currname (n, o) {
      console.log(n);
      this.getTableData()
    }
  },
  methods: {
    getTableData () {
      this.loading = true
      axios({
        method: 'post',
        url: 'http://server.cqyyy.cn/index.php/activity/auction/loglist',
        data: {goodsid: this.currname.id},
        headers: {token: this.token}
      }).then(response => {
          console.log(response)
          if(response.data.code == 0) {
              this.tableData = response.data.data
          } else {

          }
          this.loading = false
      }).catch(error => {
        this.loading = false
        console.log(error)
      })
    },
    getToken () {
      axios({
        method: 'post',
        url: 'http://server.cqyyy.cn/index.php/activity/login',
        data: {username: 'test', password: '123456'},
      })
      .then(response => {
        if (response.data.code === 0) {
          this.token = response.data.data.token
          this.getTableData()
        } else {
          this.$Message.warning(response.data.msg)
        }
      })
      .catch(error => {
        console.log(error)
      })
    },
    onSelect (e) {
      let obj = this.goodsList.find(item => {
        return item.id == e
      })
      this.currname = obj
    }
  },
}
</script>
<style lang="less" scoped>
.box{
  position: relative;
  .head-img{
    height: 200px;
  }
  .car-name{
    position: absolute;
    left: 440px;
    top: 80px;
  }
}
</style>
