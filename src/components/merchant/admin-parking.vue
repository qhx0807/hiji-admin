<template>
  <div class="box">
    <Card :bordered="false" class="mb10">
      <div class="tips">
        <h4>商户的停车券</h4>
        <p>设置商户所拥有的停车优惠券</p>
      </div>
    </Card>
    <Card :bordered="false">
      <Table :columns="columns" :data="tableData"></Table>
    </Card>
  </div>
</template>
<script>
import serverApi from '../../axios'
export default {
  name: 'AdminParking',
  data () {
    return {
      tableData: [],
      count: 0,
      currentRow: -1,
      inputNum: 0,
      columns: [
        {
          title: '序号',
          type: 'index',
          width: 80
        },
        {
          title: '用户',
          key: 'username'
        },
        {
          title: '可用券数量',
          key: 'parkingtickets',
          render: (h, params) => {
            if (this.currentRow == params.row.id) {
              return h('InputNumber',{
                props: {
                  step: 100,
                  max: 99999,
                  min: 0,
                  value: params.row.parkingtickets
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
              return h('div', {}, params.row.parkingtickets)
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
                  icon: 'edit'
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
      ]
    }
  },
  created () {
    this.getTableData()
  },
  methods: {
    getTableData (page, size, key) {
      let d = {
        pagesize: size,
        page: page,
        like: key,
        userid: sessionStorage.userid
      }
      this.$store.commit('pageLoading', true)
      serverApi('/Merchant/parkingvoucher', d,
        response => {
          // console.log(response)
          if (response.data.code === 0){
            this.tableData = response.data.data
            // this.count = response.data.data.counts
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

</style>
