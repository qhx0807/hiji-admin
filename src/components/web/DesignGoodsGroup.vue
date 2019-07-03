<template>
  <div class="box">
    <Card :bordered="false" class="mb10">
      <Input placeholder="搜索..." style="width: 242px" v-model="serkeys"></Input>
      <Button type="primary" icon="md-search" style="margin-left: 10px" @click="getTemplate">搜索</Button>
      <Button type="primary" icon="md-add" style="margin-left: 10px" @click="addModal = true">新增</Button>
    </Card>
    <div class="wrap">
      <div class="left">
        <ul>
          <li @click.stop.prevent="onClickTemp(item)" v-for="(item, index) in filteredtemplate" :key="index" :class="{'active' : activeTemp.id == item.id}">
            <h4>{{item.name}}</h4>
            <Tag :color="rendertypeText(item.type, 'type')">{{rendertypeText(item.type, 'name')}}</Tag>
            <!-- <Badge status="processing" :text="rendertypeText(item.type)"/> -->
            <Icon class="del" @click.native.prevent.stop="delTemplate(item.id)" type="ios-trash" />
          </li>
        </ul>
      </div>
      <div class="right">
        <Spin size="large" fix v-if="spinShow"></Spin>
        <div class="header" v-show="activeTemp.id">
          <Input placeholder="商品ID" v-model="inputIds" type="textarea" :rows="1" style="width: 400px"></Input>
          <Button type="primary" style="margin-left:10px" :loading="submitLoading" @click="queryStuffs">查询</Button>
        </div>
        <div class="content">
          <ul>
            <li v-for="(item, index) in tempGoods" :key="index">
              <img :src="item.img" alt="">
              <div class="info">
                <p class="name">{{item.name}}</p>
                <p class="price">
                  <span class="tag">￥</span>
                  <span class="disprice">{{item.disprice}}</span>
                  <span class="orprice">￥{{item.orprice}}</span>
                </p>
              </div>
              <div class="mask">
                <button @click="onClickRemoveItem(item)">移除商品</button>
                <button @click="onClickOrderItem(item)">更改排序</button>
                <p>商品ID：{{item.id}} &nbsp;&nbsp;排序：{{item.sort}}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <Modal v-model="addModal"  width="450">
      <p slot="header" style="text-align:center">
        <span>添加模板</span>
      </p>
        <div>
          <Form :model="addData" :label-width="60">
            <FormItem label="模板名称">
              <Input v-model="addData.name" placeholder="请输入" />
            </FormItem>
            <FormItem label="类型">
              <Select v-model="addData.type">
                <Option value="goods">邮购商品</Option>
                <Option value="cutdown">砍价商品</Option>
                <Option value="groupbuy">拼团商品</Option>
                <Option value="timelimit-discount">限时抢购商品</Option>
                <Option value="o2-timelimit-discount">限时抢购卡券</Option>
                <Option value="o2">团购卡券</Option>
              </Select>
            </FormItem>
            </Form>
        </div>
      <div slot="footer">
        <Button @click="addModal = false">关闭</Button>
        <Button @click="addTemplate" type="primary" :loading="submitLoading">保存</Button>
      </div>
    </Modal>

    <Modal v-model="listModal"  width="550">
      <p slot="header" style="text-align:center">
        <span>添加物料</span>
      </p>
        <div class="list-preview">
          <ul>
            <li v-for="(item, index) in listData" :key="index">
              <img :src="item.img" alt="">
              <p>{{item.name}}</p>
            </li>
          </ul>
        </div>
      <div slot="footer">
        <Button @click="listModal = false">关闭</Button>
        <Button type="primary" :loading="submitLoading" @click="addtoTempl">添加到模板</Button>
      </div>
    </Modal>

  </div>
</template>
<script>
import serverApi from '../../axios'
export default {
  name: 'DesignGoodsGroup',
  data () {
    return {
      submitLoading: false,
      spinShow: false,
      addModal: false,
      listModal: false,
      sortModal: false,
      addData: {
        name: '',
        type: 'goods'
      },
      tempList: [],
      activeTemp: {},
      typeArr: {
        'goods': {
          name: '邮购商品',
          type: 'warning'
        },
        'cutdown': {
          name: '砍价商品',
          type: 'magenta'
        },
        'groupbuy': {
          name: '拼团商品',
          type: 'red'
        },
        'timelimit-discount': {
          name: '限时抢购商品',
          type: 'orange'
        },
        'o2-timelimit-discount': {
          name: '限时抢购卡券',
          type: 'green'
        },
        'o2': {
          name: '团购卡券',
          type: 'blue'
        },
      },
      inputIds: '',
      listData: [],
      tempGoods: [],
      serkeys: ''
    }
  },
  created () {
    this.getTemplate()
  },
  computed: {
    filteredtemplate () {
      if (!this.serkeys) {
        return this.tempList
      }
      return this.tempList.filter(temp => {
        return temp.name.indexOf(this.serkeys) > -1
      })
    }
  },
  methods: {
    onClickAdd () {
      this.addModal.name = ''
      this.addModal.type = 'goods'
      this.addModal = true
    },
    getTemplate () {
      serverApi('/homepage/templatelist', null,
        response => {
          this.submitLoading = false
          if (response.data.code === 0) {
            this.tempList = response.data.data
          } else {
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          this.submitLoading = false
          this.$Message.error(error.toString())
        }
      )
    },
    addTemplate () {
      this.submitLoading = true
      serverApi('/homepage/temlateedit', this.addData,
        response => {
          this.submitLoading = false
          if (response.data.code === 0) {
            this.$Message.success(response.data.msg)
            this.getTemplate()
            this.addModal = false
          } else {
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          this.submitLoading = false
          this.$Message.error(error.toString())
        }
      )
    },
    onClickTemp (item) {
      this.activeTemp = item
      this.$Message.loading({
        duration: 0,
        content: '查询中...'
      })
      this.spinShow = true
      serverApi('/homepage/templatewarelists',  {id: item.id},
        response => {
          this.$Message.destroy()
          this.spinShow = false
          if (response.data.code === 0) {
            this.tempGoods = response.data.data
          } else {
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          this.spinShow = false
          this.$Message.destroy()
          this.$Message.error(error.toString())
        }
      )
    },
    getTemplList (id) {
      serverApi('/homepage/templatewarelists',  {id: id},
        response => {
          this.spinShow = false
          if (response.data.code === 0) {
            this.tempGoods = response.data.data
          } else {
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          this.spinShow = false
          this.$Message.destroy()
          this.$Message.error(error.toString())
        }
      )
    },
    delTemplate (id) {
      this.$Modal.confirm({
        title: '提示',
        content: '是否删除此模板？',
        onOk: () => {
          this.$Message.loading({
            duration: 0,
            content: '查询中...'
          })
          serverApi('/homepage/temlatedel', { id: id },
            response => {
              this.$Message.destroy()
              if (response.data.code === 0) {
                this.$Message.success(response.data.msg)
                this.getTemplate()
              } else {
                this.$Message.warning(response.data.msg)
              }
            },
            error => {
              this.$Message.destroy()
              this.$Message.error(error.toString())
            }
          )
        }
      })
    },
    rendertypeText (type, e) {
      return this.typeArr[type][e]
    },
    queryStuffs () {
      if (!this.inputIds) {
        this.$Message.warning('请输入商品ID')
        return false
      }
      this.submitLoading = true
      let d = {
        ids: this.inputIds,
        type: this.activeTemp.type
      }
      serverApi('/Homepage/waresearch', d,
        response => {
          if (response.data.data.length > 0) {
            this.listData = response.data.data
            this.listModal = true
          } else {
            this.$Message.warning('未查询到数据')
          }
          this.submitLoading = false
        },
        error => {
          this.$Message.error(error.toString())
          this.submitLoading = false
        }
      )
    },
    addtoTempl () {
      let arr = []
      this.listData.forEach(item => {
        arr.push(item.id)
      })
      this.submitLoading = true
      let d = {
        id: this.activeTemp.id,
        waresid: arr.join(',')
      }
      serverApi('/homepage/templatewareadd', d,
        response => {
          if (response.data.code === 0) {
            this.getTemplList(this.activeTemp.id)
            this.listModal = false
          } else {
            this.$Message.warning('未查询到数据')
          }
          this.submitLoading = false
        },
        error => {
          console.log(error)
          this.submitLoading = false
          this.$Message.error(error.toString())
        }
      )
    },
    onClickRemoveItem (item) {
      this.$Modal.confirm({
        title: '提示',
        content: '是否将此商品从模板中删除？',
        onOk: () => {
          this.$Message.loading({
            duration: 0,
            content: '加载中...'
          })
          let d = {
            id: item.templatecid
          }
          serverApi('/homepage/templatewaredel', d,
            response => {
              this.$Message.destroy()
              if (response.data.code === 0) {
                this.$Message.success(response.data.msg)
                this.getTemplList(this.activeTemp.id)
              } else {
                this.$Message.warning(response.data.msg)
              }
            },
            error => {
              this.$Message.destroy()
              this.$Message.error(error.toString())
            }
          )
        }
      })
    },
    onClickOrderItem (item) {
      let editOrer = item.sort
      this.$Modal.confirm({
        render: (h) => {
          let title = h('h4', {
            style: {
              textAlign: 'center',
              marginBottom: '20px'
            }
          }, '更改排序')
          let tip = h('Alert', {
            props: {
              showIcon: true
            }
          }, '请输入推荐商品排序，范围：1-255')
          let inputNum = h('InputNumber', {
            props: {
              max: 255,
              min: 1,
              value: editOrer
            },
            style: {
              width: '100%'
            },
            on: {
              input: (val) => {
                editOrer = val
              }
            }
          })
          return h('div', {}, [title, tip, inputNum])
        },
        loading: true,
        onOk: () => {
          let d = {
            id: item.templatecid,
            sort: editOrer
          }
          serverApi('/homepage/templatewareedit', d,
            response => {
              this.$Modal.remove()
              if (response.data.code === 0) {
                this.$Message.success(response.data.msg)
                this.getTemplList(this.activeTemp.id)
              } else {
                this.$Message.warning(response.data.msg)
              }
            },
            error => {
              this.$Modal.remove()
              this.$Message.error(error.toString())
            }
          )
        }
      })
    },
  }
}
</script>
<style lang="less" scoped>
.wrap{
  height: calc(100vh - 160px);
  background-color: #fff;
  display: flex;
  padding: 10px;
  .left{
    width: 250px;
    height: 100%;
    border-right: 1px solid #e5e5e5;
    overflow: auto;
    ul{
      list-style: none;
      padding: 0;
      li{
        cursor: pointer;
        padding: 14px 24px;
        color: #515a6e;
        position: relative;
        .del{
          font-size: 14px;
          position: absolute;
          right: 10px;
          display: none;
          bottom: 12px;
        }
        h4{
          font-weight: normal;
          font-size: 14px;
          line-height: 20px;
          word-break: break-all;
        }
        &:hover{
          color: #2d8cf0;
          .del{
            display: block;
          }
        }
        &.active{
          color: #2d8cf0;
          background-color: #f0faff;
          &::after{
            content: "";
            display: block;
            width: 2px;
            position: absolute;
            top: 0;
            bottom: 0;
            right: 0;
            background: #2d8cf0;
          }
        }
      }
    }
  }
  .right{
    flex: 1;
    padding: 20px 10px;
    position: relative;
    .header{
      border-bottom: 1px solid #e6e6e6;
      padding-bottom: 10px;
      position: absolute;
      top: 0;
      left: 10px;
      right: 0;
      z-index: 1;
      background-color: #fff;
    }
    .content{
      overflow: auto;
      padding: 42px 0 0px 0;
      height: 100%;
      box-sizing: border-box;
      background-color: #f5f5f5;
      ul{
        list-style: none;
        overflow: hidden;
        li{
          height: 200px;
          width: 145px;
          float: left;
          margin: 10px 5px 0 5px;
          background-color: #fff;
          position: relative;
          img{
            max-width: 100%;
            height: 135px;
          }
          .info{
            padding: 0 6px;
            .name{
              font-size: 12px;
              line-height: 18px;
              height: 35px;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
            }
            .price{
              .tag{
                font-size: 10px;
                color: #f44;
              }
              .disprice{
                margin-left: -2px;
                font-size: 14px;
                color: #f44;
              }
              .orprice{
                text-decoration: line-through;
              }
            }
          }
          &:hover{
            .mask{
              display: block;
            }
          }
          .mask{
            background-color: rgba(255, 255, 255, .9);
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            z-index: 9;
            display: none;
            transition: all ease .2s;
            text-align: center;
            button{
              height: 30px;
              background-color: #fff;
              border: 1px solid #F55D54;
              color: #F55D54;
              outline: none;
              width: 130px;
              text-align: center;
              cursor: pointer;
              transition: all ease .2s;
              &:first-child{
                margin-top: 60px;
                margin-bottom: 16px;
              }
              &:hover{
                background-color: #F55D54;
                color: #fff;
              }
            }
            p{
              margin-top: 30px;
            }
          }
        }
      }
    }
    .footer{
      border-top: 1px solid #e6e6e6;
      padding-top: 10px;
      position: absolute;
      bottom: 0;
      left: 10px;
      right: 0;
      z-index: 1;
      background-color: #fff;
      text-align: center;
    }
  }
}
.list-preview{
  max-height: 400px;
  overflow-y: auto;
  ul{
    list-style: none;
    padding: 0;
    li{
      height: 32px;
      line-height: 32px;
      display: flex;
      flex-direction: row;
      height: 60px;
      border-bottom: 1px solid #f5f5f5;
      padding: 6px;
      box-sizing: border-box;
      align-items: center;
      overflow: hidden;
      &:last-child{
        border: none;
      }
      img{
        max-height: 40px;
      }
      p{
        padding-left: 8px;
        line-height: 20px;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>
