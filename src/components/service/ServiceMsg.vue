<template>
  <div class="box">
    <Card :bordered="false" style="margin-top:10px">
      <div class="wrap">
        <div class="left-box">
          <ul>
            <li v-for="(item, index) in tableData" @click="onClickMsgItem(index, item)" :class="{'active': index==acli}" :key="index">
              <Badge :text="item.status == '0' ? 'new' : ''">
                <Avatar icon="ios-person" shape="circle" :src="item.avatar" size="large" />
              </Badge>
              <span>{{item.phone}}</span>
            </li>
          </ul>
        </div>
        <div class="right-box">
          <div class="msg-content">
            <Spin size="large" fix v-if="spinShow"></Spin>
            <ul>
              <li :class="[item.userid > 0 ? 'left' : 'right']" v-for="(item, index) in msgList"  :key="index">
                <Avatar icon="ios-person" shape="circle" :src="userAvatar" v-if="item.userid>0" size="large" />
                <Avatar class="avatar" icon="ios-person" shape="circle" v-if="item.userid==-1" src="http://cdn.cqyyy.cn/hiji.jpg" size="large" />
                <span class="msg">{{item.content}}</span>
                <span class="date">{{item.createtime.replace('2019-', '')}}</span>
              </li>
              <!-- <li class="right" v-for="(item, index) in msgList" v-if="item.userid == -1" :key="index">
                <Avatar class="avatar" icon="ios-person" shape="circle" src="http://cdn.cqyyy.cn/hiji.jpg" size="large" />
                <span class="msg">{{item.content}}</span>
              </li> -->
            </ul>
          </div>
          <div class="input-box">
            <Input type="textarea" v-model="msgcontent" :readonly="acli == -1" :rows="5" placeholder="请输入..."/>
            <Button class="btn" @click="onClickSend" :loading="loading" :disabled="acli == -1" type="primary" size="">发送</Button>
          </div>
        </div>
      </div>
    </Card>
  </div>
</template>
<script>
import serverApi from '../../axios'
export default {
  name: 'ServiceMsg',
  data () {
    return {
      searchKey: '',
      pageSize: 9999999,
      page: 1,
      count: 0,
      addModal: false,
      modal_loading: false,
      editModal: false,
      tableData: [],
      addData: {
        sevicemsg: ''
      },
      editData: {},
      acli: -1,
      msgList: [],
      userAvatar: '',
      msgcontent: '',
      hhobj: {},
      spinShow: false,
      loading: false
    }
  },
  created () {
    this.getTableData()
  },
  methods: {
    getTableData () {
      let d = {
        pagesize: this.pageSize,
        page: this.page,
        like: this.searchKey,
        smid: '',
        status: ''
      }
      this.$store.commit('pageLoading', true)
      serverApi('/service/servicemsglist', d,
        response => {
          console.log(response)
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
    onClickMsgItem (index, row) {
      this.hhobj = row
      this.spinShow = true
      this.msgList = []
      this.acli = index
      let obj = {
        content: row.content,
        userid: row.userid,
        createtime: row.createtime
      }
      this.userAvatar = row.avatar ? row.avatar : 'http://cdn.cqyyy.cn/hiji.jpg'
      // setTimeout(() => {
      //   this.spinShow = false
      // }, 200)
      serverApi('/service/servicemsglistinfo', {id: row.id},
        response => {
          this.spinShow = false
          if (response.data.code === 0) {
            this.msgList = [obj, ...response.data.data]
          } else {
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          this.spinShow = false
          this.$Message.error(error.toString())
        }
      )
    },
    onClickSend () {
      if (!this.msgcontent) {
        this.$Message.warning('不能发送空白消息，请输入内容！')
        return false
      }
      this.loading = true
      let d = {
        content: this.msgcontent,
        id: this.hhobj.id,
        smid: this.hhobj.smid
      }
      serverApi('/service/servicetreate', d,
        response => {
          this.loading = false
          if (response.data.code === 0) {
            this.$Message.success(response.data.msg)
            let obj = {
              content: this.msgcontent,
              userid: -1,
            }
            this.msgList.push(obj)
            this.msgcontent = ''
          } else {
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          this.loading = false
          this.$Message.error(error.toString())
        }
      )
    }
  }
}
</script>
<style lang="less" scoped>
.box{
  .wrap{
    display: flex;
    height: 680px;
    padding: 10px;
    .left-box{
      border-right: 1px solid #eee;
      width: 240px;
      height: 100%;
      overflow-x: hidden;
      ul{
        list-style: none;
        li{
          padding: 10px;
          cursor: pointer;
          transition: all .2s;
          border-bottom: 1px solid #eee;
          &.active{
            background-color: #f0faff;
            color: #2d8cf0;
            border-right: 3px solid #2d8cf0;
            padding-left: 20px;
          }
        }
      }
    }
    .right-box{
      flex: 1;
      height: 100%;
      padding: 12px;
      max-width: 800px;
      .msg-content{
        position: relative;
        background-color: #f5f5f5;
        height: 510px;
        border-radius: 6px;
        padding: 12px;
        overflow: auto;
        ul{
          list-style: none;
          padding: 0;
          li{
            display: flex;
            align-items: flex-start;
            margin-bottom: 12px;
            .msg{
              display: inline-block;
              padding: 10px;
              background-color: #fff;
              border-radius: 6px;
              font-size: 14px;
              margin-left: 10px;
              max-width: 650px;
              white-space: normal;
              word-break: break-all;
              position: relative;
            }
            .date{
              font-size: 10px;
              color: #666;
              display: block;
              margin-top: 12px;
              margin-left: 8px;
            }
            &.right{
              justify-content: flex-end;
              .avatar{
                order: 3;
              }
              .msg{
                margin-right: 12px;
                background-color: aquamarine;
                order: 2;
              }
              .date{
                order: 1;
              }
            }
          }
        }
      }
      .input-box{
        padding-top: 15px;
        position: relative;
        .btn{
          position: absolute;
          bottom: 5px;
          right: 5px;
          width: 100px;
        }
      }
    }
  }
}
</style>
