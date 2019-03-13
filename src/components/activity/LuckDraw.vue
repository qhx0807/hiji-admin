<template>
  <div class="box">
    <Card :bordered="false" class="mb10">
      <Input style="width:200px" placeholder="搜索..." suffix="ios-search"></Input>
      <Button type="primary" style="margin-left:12px;" :loading="loading" @click="getTableData">搜索</Button>
      <Button type="primary" style="margin-left:12px;" @click="onClickAdd">新增</Button>
    </Card>
    <Card :bordered="false">
      <Table size="small" :columns="columns" :data="tableData"></Table>
      <div style="float: right; padding-top:12px">
        <Page :total="count" show-total :current="page" @on-change="changePage"></Page>
      </div>
      <div style="clear:both"></div>
    </Card>

    <Modal v-model="addModal" width="550">
      <p slot="header" style="text-align:center">
        <span>新增活动</span>
      </p>
      <Form :model="addData" ref="form" :rules="rules" :label-width="100">
        <FormItem label="活动标题" prop="gamename">
          <Input v-model="addData.gamename" placeholder="请输入"></Input>
        </FormItem>
        <FormItem label="开始时间" prop="starttime">
          <DatePicker type="datetime" style="width:100%" placeholder="选择时间" @on-change="onSelectStartDate"></DatePicker>
        </FormItem>
        <FormItem label="结束时间" prop="endtime">
          <DatePicker type="datetime" style="width:100%" placeholder="选择时间" @on-change="onSelectEndDate"></DatePicker>
        </FormItem>
        <FormItem label="单人总抽奖机会">
          <InputNumber :min="0" style="width:100%" v-model="addData.singlenum" placeholder="输入数量"></InputNumber>
        </FormItem>
        <FormItem label="每人每日抽奖机会">
          <InputNumber :min="0" style="width:100%" v-model="addData.daynum" placeholder="输入数量"></InputNumber>
        </FormItem>
        <FormItem label="单人最多中奖次数">
          <InputNumber :min="0" style="width:100%" v-model="addData.singledraw" placeholder="输入数量"></InputNumber>
        </FormItem>
        <FormItem label="好友助力">
          <RadioGroup v-model="addData.help">
            <Radio label="0">关闭</Radio>
            <Radio label="1">开启好友助力</Radio>
          </RadioGroup>
          <Tooltip content="助力成功后增加一次抽奖机会">
            <Icon type="md-alert" size="22"/>
          </Tooltip>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="addModal = false">取消</Button>
        <Button type="primary" :loading="modalLoading" @click="onSaveAdd">保存</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import serverApi from '../../axios'
export default {
  name: 'LuckDraw',
  data () {
    return {
      loading: false,
      addModal: false,
      editModal: false,
      modalLoading: false,
      addData: {
        type: 1,
        gamename: '',
        starttime: '',
        endtime: '',
        singlenum: 0,
        daynum: 0,
        singledraw: 0,
        help: '0',
        gamerule: '活动规则',
        gamelist: '[]',
        bgcolor: 'rgba(255,255,255,1)',
        bgimg: '',
        sharemsg: '',
        sharetitle: '',
        shareimg: '',
        shareurl: '',
        winningimg: '',
        loseimg: ''
      },
      rules: {
        gamename: [
          { required: true, message: '请输入', trigger: 'blur' },
        ],
        starttime: [
          { required: true, message: '请选择开始时间', trigger: 'blur' },
        ],
        endtime: [
          { required: true, message: '请选择结束时间', trigger: 'blur' },
        ],
      },
      tableData: [],
      count: 0,
      page: 1,
      pageSize: 10,
      columns: [
        {
          title: '#',
          key: 'id',
          width: 60
        },
        {
          title: '活动标题',
          key: 'gamename',
        },
        {
          title: '开始时间',
          key: 'starttime',
        },
        {
          title: '结束时间',
          key: 'endtime',
        },
        {
          title: '好友助力',
          key: 'help',
          render: (h, params) => {
            const text = params.row.help == 1 ? '开启' : '关闭'
            const color = params.row.help == 1 ? 'success' : 'warning'
            return h('Tag', {
              props: {
                color: color,
                type: 'dot'
              }
            }, text)
          }
        },
        {
          title: '单人总抽奖机会',
          key: 'singlenum',
        },
        {
          title: '每日抽奖机会',
          key: 'daynum',
        },
        {
          title: '总中奖机会',
          key: 'singledraw',
        },
        {
          title: '操作',
          key: 'id',
          width: 130,
          render: (h, params) => {
            let link = h('a', {
              style: {
                color: '#f90',
                marginRight: '10px'
              },
              on: {
                click: () => {
                  this.onClickLink(params.row)
                }
              }
            }, '复制链接')
            let edit = h('a', {
              style: {
                marginRight: '10px'
              },
              on: {
                click: () => {
                  this.onClickEdit(params.row)
                }
              }
            }, '编辑')
            return h('div', [link, edit])
          }
        },
      ],
    }
  },
  created () {
    this.getTableData()
  },
  methods: {
    onClickAdd () {
      this.addModal = true
    },
    getTableData () {
      this.loading = true
      let d = {
        pagesize: this.pageSize,
        page: this.page,
      }
      serverApi('/activity/gameall', d,
        response => {
          console.log(response)
          if (response.data.code === 0) {
            this.tableData = response.data.data.result
          } else {
            this.$Message.warning(response.data.msg)
          }
          this.loading = false
        },
        error => {
          this.loading = false
          this.$Message.error(error.toString())
        }
      )
    },
    changePage (e) {
      this.page = e
      this.getTableData()
    },
    onSelectStartDate (e) {
      this.addData.starttime = e
    },
    onSelectEndDate (e) {
      this.addData.endtime = e
    },
    onSaveAdd () {
      this.$refs.form.validate(val => {
        if (val) {
          this.modalLoading = true
          serverApi('/activity/game', this.addData,
            response => {
              this.modalLoading = false
              if (response.data.code === 0) {
                console.log(response)
              } else {
                this.$Message.warning(response.data.msg)
              }
              this.addModal = false
            },
            error => {
              console.log(error)
              this.modalLoading = false
              this.$Message.error(error.toString())
            }
          )
        }
      })
    },
    onClickLink (row) {
      let text = 'http://m.cqyyy.cn/activity/h5game/index.html?id='+row.id
      this.$copyText(text).then((e) => {
        this.$Message.success('活动链接已复制到剪切板')
      })
    },
    onClickEdit (row) {
      this.$router.push({name: 'LuckDrawEdit', params: {id: row.id}})
    }
  }
}
</script>
<style lang="less" scoped>

</style>
