<template>
  <div class="box">
    <Card :bordered="false">
      <div class="head">
        <Input v-model="searchKey" placeholder="搜索关键字..." style="width: 200px"></Input>
        <Button type="primary" style="margin-left:8px" icon="ios-search" @click="onClickSearch">搜索</Button>
        <Button type="warning" style="margin-left:8px" icon="arrow-up-a" @click="onClickGive">发放卡券</Button>
      </div>
      <div class="body">
        <Table :columns="columns" :data="fileterData"></Table>
      </div>
    </Card>

    <!-- win -->
    <Modal v-model="winModal" width="500" :closable="false">
      <p slot="header" style="text-align:center">
        <span>录入比赛结果</span>
      </p>
      <h3 style="text-align:center">(主){{winData.zhuchang}} vs {{winData.kechang}}(客)</h3>
      <p style="text-align:center;margin:10px">{{winData.matchdate}}</p>
      <Form :model="editData"  :rules="rules" :label-width="100">
        <FormItem label="选择比赛结果">
          <Select v-model="selectOption" style="width:300px">
            <Option v-for="item in optionList" :value="item.value" :key="item.value">{{ item.name }}</Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button    @click="coloseModal">取消</Button>
        <Button type="primary" :loading="modal_loading" @click="saveWin">保存</Button>
      </div>
    </Modal>

    <!-- Last Game -->
    <Modal v-model="lastModal" width="500" :closable="false">
      <p slot="header" style="text-align:center">
        <span>录入比赛结果</span>
      </p>
      <h3 style="text-align:center">(主){{winData.zhuchang}} vs {{winData.kechang}}(客)</h3>
      <p style="text-align:center;margin:10px">{{winData.matchdate}}</p>
      <Row>
        <Col span="12" style="text-align:right;padding-right:10px">
          <InputNumber :max="99" :min="0" v-model="homeVal"></InputNumber>
        </Col>
          <Col span="12" style="padding-right:10px">
          <InputNumber :max="99" :min="0" v-model="awayVal"></InputNumber>
        </Col>
      </Row>
      <div slot="footer">
        <Button    @click="lastModal = false">取消</Button>
        <Button type="primary" :loading="modal_loading" @click="saveLastGame">保存</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  name: 'WorldCup',
  data () {
    return {
      searchKey: '',
      addModal: false,
      editModal: false,
      modal_loading: false,
      winModal: false,
      lastModal: false,
      winData: {},
      form: {
        matchid: '',
        guessdate: '',
        matchdate: '',
        zhuchang: '',
        kechang: '',
        isgroup: ''
      },
      rules: {
        matchdate: [{ required: true, message: '不能为空', trigger: 'blur' }],
        isgroup: [{ required: true, message: '不能为空', trigger: 'blur' }],
        kechang: [{ required: true, message: '不能为空', trigger: 'blur' }],
        rolecode: [{ required: true, message: '不能为空', trigger: 'blur' }],
        rolecode: [{ required: true, message: '不能为空', trigger: 'blur' }],
        rolecode: [{ required: true, message: '不能为空', trigger: 'blur' }],
        rolecode: [{ required: true, message: '不能为空', trigger: 'blur' }],
      },
      editData: {},
      columns: [
        {
          title: '序号',
          type: 'index',
          width: 80
        },
        {
          title: '比赛日期',
          key: 'matchdate',
          width: 220
        },
        {
          title: '赛事',
          key: 'zhuchang',
          render: (h, params) => {
            return h('div', '(主)'+params.row.zhuchang + '  vs  ' + params.row.kechang+'(客)')
          }
        },
        {
          title: '比赛类型',
          key: 'isgroup',
          width: 220,
          render: (h, params) => {
            const is = h('span', '小组赛')
            const not = h('span', '淘汰赛')
            if (params.row.isgroup == 1) {
              return is
            } else {
              return not
            }
          }
        },
        {
          title: '赛事结果',
          key: 'win',
          render: (h, params) => {
            const noresult = h('div',[
              h('Tag', {props: {color: 'yellow'}}, '暂无结果'),
              h('Button',{on: {click: ()=>{this.updateWin(params.row)}}},'点击录入')
            ])
            if (params.row.matchid == '27') {
              if (params.row.homescore && params.row.kescore) {
                return h('div', {
                  style: {
                    color: 'green',
                    fontSize: '18px',
                    fontWeight: '600'
                  }
                }, params.row.homescore+' : '+params.row.kescore)
              } else{
                return noresult
              }
            }
            // const noresult = h('Tag', {props: {color: 'yellow'}}, '暂无结果')

            const home = h('Tag', {props: {color: 'green'}}, params.row.zhuchang+'胜')
            const away = h('Tag', {props: {color: 'red'}}, params.row.kechang+'胜')
            const same = h('Tag', {props: {color: 'blue'}}, '平分秋色')
            if(params.row.win == 1) {
              return home
            }else if (params.row.win == 2) {
              return away
            }else if (params.row.win == 3) {
              return same
            }else {
              return noresult
            }
          }
        },
        {
          title: '发放奖励',
          key: 'isde',
          render: (h, params) => {
            const dispatch = h('Button', {props: {type: 'primary', size: 'default'}, on: {click: ()=>{this.giveReward(params.row)}}},'发放奖励')
            const argive = h('Tag', {props: {color: 'green'}}, '已发放')
            const wait = h('Tag', '等待结果')
            const notRe = h('Tag', {props: {color: 'yellow'}}, '未发放')
            if (params.row.matchid == '27' && params.row.homescore && params.row.kescore) {
              if (params.row.isde == 0) {
                return notRe
              } else {
                return argive
              }
            }
            if (params.row.win != 0 && params.row.isde == 1) {
              return argive
            } else if (params.row.win != 0 && params.row.isde == 0) {
              return notRe
            } else {
              return wait
            }
          }
        }
      ],
      tableData: [],
      hfServer: 'http://abcd.zlzmm.com:6789/index.php/',
      // hfServer: 'http://192.168.1.115/index.php/',
      optionList: [],
      selectOption: '',
      winNum: ['暂无结果','主队胜','客队胜','平'],
      homeVal: null,
      awayVal: null,
    }
  },
  created () {
    this.getTableData()
  },
  computed: {
    fileterData () {
      return this.tableData.filter(v => Object.values(v).some(v => new RegExp(this.searchKey + '').test(v)))
    }
  },
  methods: {
    getTableData () {
      this.$store.commit('pageLoading', true)
      axios.post(this.hfServer + 'word/showmatch')
        .then(response => {
          if (response.data.code === 0) {
            this.tableData = response.data.result
          }else {
            this.$Message.warning(response.data.msg)
          }
          this.$store.commit('pageLoading', false)
        })
        .catch(error => {
          console.log(error)
          this.$store.commit('pageLoading', false)
        })
    },
    onClickAdd () {
      this.$refs.form.resetFields()
      this.addModal = true
    },
    onClickEdit (row) {
      this.editData = Object.assign({}, row)
      this.editModal = true
      // console.log(row)
    },
    edit () {
      delete this.editData._index
      delete this.editData._rowKey
      this.modal_loading = true
    },
    remove (id) {
      this.$Modal.confirm({
        title: '提示',
        content: '<p>确认删除此条信息？</p>',
        onOk: () => {
          // alert(1)
        }
      })
    },
    add () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.modal_loading = true
        }
      })
    },
    onClickSearch () {
    },
    updateWin (row) {
      if (row.matchid == 27) {
        this.winData = row
        this.lastModal = true
      } else {
        this.optionList = []
        this.winData = row
        console.log(this.optionList)
        this.optionList.push({name: '(主)'+row.zhuchang+'胜', value: '1'})
        this.optionList.push({name: '(客)'+row.kechang+'胜', value: '2'})
        this.optionList.push({name: '平分秋色', value: '3'})
        this.selectOption = ''
        this.winModal = true
      }

    },
    coloseModal () {
      this.selectOption = ''
      this.winModal = false
      window.location.reload()
    },
    saveWin () {
      if (!this.selectOption) {
        this.$Message.info("请选择比赛结果！")
        return false
      }
      this.modal_loading = true
      axios({
        method: 'post',
        url: this.hfServer + 'word/editwin',
        data: {
          id: this.winData.id,
          matchid: this.winData.matchid,
          win: this.selectOption,
        },
        transformRequest: [function (data) {
          let ret = ''
          for (let it in data) {
            ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
          }
          return ret
        }]
      })
      .then((response) => {
        this.modal_loading = false
        if (response.data.code === 0) {
          this.$Message.success('提交成功')
          this.getTableData()
          this.winModal = false
        }else {
          this.$Message.warning(response.data.msg)
        }
      })
      .catch(error => {
        this.modal_loading = false
      })

    },
    giveReward (row) {
      const match = '(主)'+row.zhuchang + 'VS' + row.kechang+'(客)'
      const win = this.winNum[Number(row.win)]
      this.$Modal.confirm({
        title: '提示',
        content: `<h4>确认 ${row.matchdate} ${match}</h4>
                  <h4>比赛结果为：${win}</h4>
                  <h4>将发送奖励到竞猜正确的用户！</h4>
                  `,
        onOk: () => {
          alert(1)
        }
      })
    },
    onClickGive () {
      this.$Modal.confirm({
        title: '提示',
        content: '<p>给所有竞猜正确的用户发放奖励？</p>',
        onOk: () => {
          axios.post(this.hfServer + 'word/guesscard')
            .then(response => {
              if (response.data.code === 0) {
                this.$Message.success('发放成功')
                this.getTableData()
              }else {
                this.$Message.warning(response.data.msg)
              }
            })
            .catch(error => {
              console.log(error)
            })
        }
      })
    },
    saveLastGame() {
      if (!this.homeVal || !this.awayVal) {
        this.$Message.warning('请输入比分！')
        return false
      }
      this.modal_loading = true
      axios({
        method: 'post',
        url: this.hfServer + 'word/editwin',
        data: {
          id: this.winData.id,
          matchid: this.winData.matchid,
          homescore: this.homeVal,
          kescore: this.awayVal
        },
        transformRequest: [function (data) {
          let ret = ''
          for (let it in data) {
            ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
          }
          return ret
        }]
      })
      .then((response) => {
        this.modal_loading = false
        if (response.data.code === 0) {
          this.$Message.success('提交成功')
          this.getTableData()
          this.lastModal = false
        }else {
          this.$Message.warning(response.data.msg)
        }
      })
      .catch(error => {
        this.modal_loading = false
      })
    }
  }
}
</script>
<style lang="less" scoped>
.head{
  padding-bottom: 12px;
}
.postWin{
  color: blue;
  cursor: pointer;
}
</style>


