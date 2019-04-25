<template>
  <div class="box">
    <Card :bordered="false" class="mb10">
      <div class="tips">
        <p style="font-size:14px;">
          <img src="http://cdn.cqyyy.cn/PREVIEW.svg" alt="">
          菜单下按钮维护，新增修改删除。
        </p>
      </div>
    </Card>
    <Card :bordered="false" >
      <div class="editbox">
        <div class="left">
          <Tree :data="treeData" children-key="child" @on-select-change="onSelectMenu"></Tree>
        </div>
        <div class="right">
          <Spin fix v-show="spinShow">
            <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
            <div>Loading</div>
          </Spin>
          <div class="btns-box">
            <Button style="margin-right:12px"
              v-for="(item, index) in btnsData"
              :key="index"
              @click="onClcickEditBtn(item)"
              >
              {{item.button}}
              ({{item.explain}})
            </Button>
          </div>
          <Divider />
          <div class="add-box" v-show="selectMenu.name">
            <Button class="addbtn" @click="onClcickAddBtn" icon="ios-add" type="dashed"></Button>
          </div>
        </div>
      </div>
    </Card>
    <!-- add -->
    <Modal v-model="addModal" width="380">
      <p slot="header" style="text-align:center">
        <span>新增</span>
      </p>
      <Form ref="form" :label-width="60">
        <FormItem label="按钮名称">
          <Input v-model="addData.button" placeholder="请输入"></Input>
        </FormItem>
        <FormItem label="按钮编码">
          <Input v-model="addData.explain" placeholder="请输入"></Input>
        </FormItem>
        <FormItem label="所属菜单">
          <i>{{selectMenu.name}}</i>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="addModal = false">取消</Button>
        <Button type="primary" :loading="modal_loading" @click="add">提交</Button>
      </div>
    </Modal>

    <!-- edit -->
    <Modal v-model="editModal" width="380">
      <p slot="header" style="text-align:center">
        <span>修改</span>
      </p>
      <Form ref="form" :label-width="60">
        <FormItem label="按钮名称">
          <Input v-model="editData.button" placeholder="请输入"></Input>
        </FormItem>
        <FormItem label="按钮编码">
          <Input v-model="editData.explain" placeholder="请输入"></Input>
        </FormItem>
        <FormItem label="所属菜单">
          <i>{{selectMenu.name}}</i>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="editModal = false">取消</Button>
        <Poptip
          confirm
          title="确定删除此按钮？"
          @on-ok="del">
          <Button type="error" :loading="modal_loading" style="margin-left:8px">删除</Button>
        </Poptip>
        <Button type="primary" style="margin-left:8px" :loading="modal_loading" @click="edit">保存</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import serverApi from '../../axios'
import { getPinYinFirstCharacter } from '../../utlis/pinyin.js'
export default {
  name: 'Buttons',
  data () {
    return {
      treeData: [],
      selectMenu: {},
      btnsData: [],
      spinShow: false,
      addData: {
        menuid: '',
        button: '',
        explain: ''
      },
      editData: {},
      addModal: false,
      editModal: false,
      modal_loading: false
    }
  },
  created () {
    this.getMenuData()
  },
  watch: {
    'addData.button': function (n, o) {
      let result
      if (this.selectMenu.name) {
        result = getPinYinFirstCharacter(this.selectMenu.name) + this.selectMenu.id + '_'
      }
      if (n) {
        result += getPinYinFirstCharacter(n)
      }
      this.addData.explain = result
    }
  },
  methods: {
    getMenuData () {
      this.$store.commit('pageLoading', true)
      serverApi('/menu/index', '',
        response => {
          // console.log(response)
          if (response.data.code === 0){
            let getCas = function (arr) {
              arr.forEach(item => {
                item.expand = true
                item.title = item.name
                if (item.child.length > 0) {
                  getCas(item.child)
                }
              })
            }
            getCas(response.data.data)
            this.treeData = response.data.data
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
    onSelectMenu (e) {
      if (e[0].child.length > 0) {
        return false
      }
      this.selectMenu = e[0]
      this.addData.menuid = this.selectMenu.id
      console.log(this.addData)
      this.getBtnsOfMenu()
    },
    getBtnsOfMenu () {
      this.spinShow = true
      serverApi('/rolebutton/index', {menuid: this.selectMenu.id},
        response => {
          if (response.data.code === 0) {
            this.btnsData = response.data.data
          } else {
            this.$Message.warning(response.data.msg)
          }
          this.spinShow = false
        },
        error => {
          console.log(error)
          this.$Message.error(error.toString())
          this.spinShow = false
        }
      )
    },
    onClcickAddBtn () {
      this.addData.button = ''
      this.addData.explain = getPinYinFirstCharacter(this.selectMenu.name) + this.selectMenu.id + '_'
      this.addModal = true
    },
    onClcickEditBtn (e) {
      this.editData = Object.assign({}, e)
      this.editModal = true
    },
    add () {
      if (!this.addData.button || !this.addData.explain) {
        this.$Message.warning('请输入信息！')
        return false
      }
      this.modal_loading = true
      serverApi('/rolebutton/edit', this.addData,
        response => {
          if (response.data.code === 0){
            this.getBtnsOfMenu()
            this.addModal = false
          }else{
            this.$Message.warning(response.data.msg)
          }
          this.modal_loading = false
        },
        error => {
          this.$Message.error(error.toString())
          this.modal_loading = false
        }
      )
    },
    edit () {
      if (!this.editData.button || !this.editData.explain) {
        this.$Message.warning('请输入信息！')
        return false
      }
      this.modal_loading = true
      serverApi('/rolebutton/edit', this.editData,
        response => {
          if (response.data.code === 0){
            this.getBtnsOfMenu()
            this.editModal = false
          }else{
            this.$Message.warning(response.data.msg)
          }
          this.modal_loading = false
        },
        error => {
          this.$Message.error(error.toString())
          this.modal_loading = false
        }
      )
    },
    del () {
      this.modal_loading = true
      serverApi('/rolebutton/del', {buttonid: this.editData.buttonid},
        response => {
          if (response.data.code === 0){
            this.getBtnsOfMenu()
            this.editModal = false
          }else{
            this.$Message.warning(response.data.msg)
          }
          this.modal_loading = false
        },
        error => {
          this.$Message.error(error.toString())
          this.modal_loading = false
        }
      )
    },
  }
}
</script>
<style lang="less" scoped>
.tips{
  p{
    img{
      vertical-align: bottom;
    }
  }
}
.editbox{
  display: flex;
  padding-left: 20px;
  .left{
    width: 200px;
    height: 500px;
    overflow: auto;
    border-right: 1px solid #eee;
  }
  .right{
    padding: 20px;
    flex: 1;
    position: relative;
  }
}
.demo-spin-icon-load {
  animation: ani-demo-spin 1s linear infinite;
}
@keyframes ani-demo-spin {
  0% {
    -webkit-transform: rotate(0);
    transform: rotate(0);
  }
  50% {
      -webkit-transform: rotate(180deg);
      transform: rotate(180deg);
  }
  100% {
      -webkit-transform: rotate(1turn);
      transform: rotate(1turn);
  }
}
.btns-box{
  min-height: 200px;
}
.add-box{
  text-align: center;
  .addbtn{
    height: 80px;
    width: 90px;
    font-size: 40px!important;
  }
}
</style>
