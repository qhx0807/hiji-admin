<template>
  <div class="box">
    <Card :bordered="false" class="mb10">
      <Input placeholder="搜索..." v-model="like" style="width: 240px"></Input>
      <Button type="primary" style="margin-left:10px" @click="onClickSearch">搜索</Button>
      <Button type="primary" style="margin-left:10px" :to="{name: 'PostageTempAdd'}">新增</Button>
    </Card>
    <Card :bordered="false">
      <Table :columns="columns" size="small" :data="tableData" :loading="loading"></Table>
      <div style="text-align: right; padding-top:12px">
        <Page :total="count" show-elevator show-total :current="page" @on-change="changePage" show-sizer @on-page-size-change="onChangeSize"></Page>
      </div>
    </Card>
  </div>
</template>
<script>
import serverApi from '../../axios'
export default {
  name: 'PostageTemp',
  data () {
    return {
      count: 0,
      page: 1,
      pagesize: 10,
      like: '',
      loading: false,
      columns: [
        {
          title: '#',
          key: 'id',
          width: 80
        },
        {
          title: '模板名称',
          key: 'title',
          minWidth: 160
        },
        {
          title: '商家设备号',
          key: 'merchantcode'
        },
        {
          title: '邮费属性',
          key: 'transport_type_name'
        },
        {
          title: '省级地址',
          key: 'provincename'
        },
        {
          title: '首件数量/重量/体积',
          key: 'snum'
        },
        {
          title: '首件价格',
          key: 'sprice'
        },
        {
          title: '续件数量/重量/体积',
          key: 'xnum'
        },
        {
          title: '续件价格',
          key: 'xprice'
        },
        {
          title: '满件包邮数量/重量/体积',
          key: 'mnum'
        },
        {
          title: '固定邮费',
          key: 'price'
        },
        {
          title: '操作',
          key: 'id',
          align: 'center',
          width: 150,
          fixed: 'right',
          render: (h, params) => {
            let del = h('Button', {
              props: {
                type: 'text',
                size: 'small',
              },
              style: {
                color: '#ed3f14'
              },
              on: {
                click: () => {
                  this.remove(params.row.id)
                }
              }
            }, '删除')
            let edit = h('Button', {
                props: {
                  type: 'text',
                  size: 'small',
                },
                style: {
                  marginRight: '5px',
                  color: '#2d8cf0'
                },
                on: {
                  click: () => {
                    this.onClickEdit(params.row.id)
                  }
                }
            }, '编辑')
            return h('div', [edit, del])
          }
        }
      ],
      tableData: [],
    }
  },
  created () {
    this.getTableData()
  },
  methods: {
    getTableData () {
      this.loading = true
      let d = {
        page: this.page,
        pagesize: this.pagesize,
        like: this.like,
      }
      serverApi('/transport/transportList', d,
        response => {
          console.log(response)
          if (response.data.code === 0) {
            this.tableData = response.data.data.result
            this.count = response.data.data.counts
          } else {
            this.$Message.warning(response.data.msg)
          }
          this.loading = false
        },
        error => {
          console.log(error)
          this.loading = false
          this.$Message.error(error.toString())
        }
      )
    },
    onClickSearch () {
      this.page = 1
      this.getTableData()
    },
    changePage (e) {
      this.page = e
    },
    onChangeSize (e) {
      this.pagesize = e
    },
    onClickEdit (id) {
      this.$router.push({name: 'PostageTempEdit', params: {id: id}})
    },
    remove (id) {
      this.$Modal.confirm({
        title: '提示',
        content: '<p>确认删除此条数据？</p>',
        onOk: () => {
          serverApi('/transport/transportDelete', {id: id},
            response => {
              this.$Message.info(response.data.msg)
              this.getTableData()
            },
            error => {
              console.log(error)
              this.$Message.error('链接失败！')
            }
          )
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>

</style>
