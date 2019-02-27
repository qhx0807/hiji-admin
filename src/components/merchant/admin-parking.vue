<template>
  <div class="box">
    <Card :bordered="false" class="mb10 card-box">
      <div class="tips">
        <h4>商户的停车券</h4>
        <p>设置商户所拥有的停车优惠券</p>
      </div>
      <div class="search-p">
        <Input v-model="searchKey" search style="width: 320px" :enter-button="true" @on-search="getTableData" placeholder="搜索..." />
        <!-- <Icon type="ios-search"></Icon>
        <input v-model="searchKey" placeholder="在列表中搜索..." type="text"> -->
      </div>
    </Card>
    <Card :bordered="false">
      <Table :columns="columns" :data="tableData"></Table>
      <div style="float: right; padding-top:12px">
        <Page :total="count" show-total :current="page" @on-change="changePage" show-sizer @on-page-size-change="onChangeSize"></Page>
      </div>
      <div style="clear:both"></div>
    </Card>
  </div>
</template>
<script>
import serverApi from '../../axios'
import { arrSearch } from '../../utlis/tools.js'
export default {
  name: 'AdminParking',
  data () {
    return {
      tableData: [],
      searchKey: '',
      count: 0,
      currentRow: -1,
      inputNum: 0,
      columns: [
        {
          title: '#',
          key: 'id',
          width: 80
        },
        {
          title: '账号',
          key: 'username'
        },
        {
          title: '用户名',
          key: 'name'
        },
        {
          title: '金额',
          key: 'parkingtickets',
          render: (h, params) => {
            if (this.currentRow == params.row.id) {
              return h('InputNumber',{
                props: {
                  step: 1,
                  max: 99999,
                  min: 0,
                  value: params.row.parkingtickets,
                  activeChange: true
                },
                style: {
                  width: '120px'
                },
                on: {
                  'on-change': (event) => {
                    this.onChangeNum(event, params.row)
                  }
                }
              })
            } else {
              return h('div', {
                style: {
                  color: '#f90',
                  fontSize: '16px'
                }
              }, params.row.parkingtickets)
            }
          }
        },
        {
          title: '修改',
          key: 'id',
          width: 140,
          align: 'center',
          render: (h, params) => {
            if (this.currentRow == params.row.id) {
              return h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.onClickSaveNum(params.row)
                  }
                }
              }, '保存')
            } else {
              return h('Button', {
                props: {
                  type: 'text',
                  icon: 'md-create'
                },
                on: {
                  click: () => {
                    this.onClickEditNum(params.row.id)
                  }
                }
              }, '编辑')
            }
          }
        }
      ],
      page: 1,
      pagesize: 10,
    }
  },
  created () {
    this.getTableData()
  },
  methods: {
    getTableData () {
      let d = {
        pagesize: this.pagesize,
        page: this.page,
        like: this.searchKey,
      }
      this.$store.commit('pageLoading', true)
      serverApi('/Merchant/parkingvoucher', d,
        response => {
          // console.log(response)
          if (response.data.code === 0){
            this.tableData = response.data.data.result
            this.count = response.data.data.counts
          }else{
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
    changePage (e) {
      this.page = e
      this.getTableData()
    },
    onChangeSize (e) {
      this.pagesize = e
      this.getTableData()
    },
    onClickEditNum (id) {
      this.currentRow = id
    },
    onClickSaveNum (row) {
      console.log(row)
      let d = {
        parkingtickets: this.inputNum,
        id: row.id
      }
      serverApi('/Merchant/editparkingvoucher', d,
        response => {
          // console.log(response)
          if (response.data.code == 0) {
            this.$Message.info('修改成功！')
            this.getTableData()
            this.currentRow = -1
          } else {
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          console.log(error)
        })
    },
    onChangeNum (e, row) {
      // row.parkingtickets = e
      this.inputNum = e
    }
  }
}
</script>
<style lang="less" scoped>
.card-box{
  position: relative;
}
.search-p{
  position: absolute;
  top: 30px;
  left: 200px;
}
</style>
