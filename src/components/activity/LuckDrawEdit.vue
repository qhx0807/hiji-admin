<template>
  <div class="box">
    <Card :bordered="false">
      <div class="content">
        <div class="phone">
          <div class="phone-box" :style="{backgroundColor: addData.bgcolor}">
            <div class="phone-title">
              <img src="http://cdn.cqyyy.cn/pic/20190311163115.png" alt="">
              <p>{{addData.gamename}}</p>
            </div>
            <div class="phone-content" :style="{backgroundImage: 'url('+ addData.bgimg +')'}"></div>
          </div>
        </div>
        <div class="editarea">
          <Form :model="addData" ref="form" :rules="rules" :label-width="90">
            <Row>
              <Col span="6">
                <FormItem label="活动标题" prop="gamename">
                  <Input v-model="addData.gamename" placeholder="请输入"></Input>
                </FormItem>
              </Col>
              <Col span="6">
                <FormItem label="背景图">
                  <Input v-model="addData.bgimg" >
                    <UploadFile @uploadSucc="onUploadbgimgImg" slot="append"></UploadFile>
                  </Input>
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem label="活动时间">
                  <DatePicker type="datetime" placeholder="选择时间" @on-change="onSelectStartDate" :value="addData.starttime"></DatePicker>
                  -
                  <DatePicker type="datetime" placeholder="选择时间" @on-change="onSelectEndDate" :value="addData.endtime"></DatePicker>
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem label="活动规则" prop="gamename">
                  <Input type="textarea" clearable autosize :rows="1" v-model="addData.gamerule" placeholder="请输入"></Input>
                </FormItem>
              </Col>
              <Col span="6">
                <FormItem label="抽中图片">
                  <Input v-model="addData.winningimg">
                    <UploadFile @uploadSucc="onUploadSinningImg" slot="append"></UploadFile>
                  </Input>
                </FormItem>
              </Col>
              <Col span="6">
                <FormItem label="未抽中图片">
                  <Input v-model="addData.loseimg">
                    <UploadFile @uploadSucc="onUploadLoseImg" slot="append"></UploadFile>
                  </Input>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="6">
                <FormItem label="单人总抽奖机会">
                  <InputNumber :min="0" style="width:100%" v-model="addData.singlenum" placeholder="输入数量"></InputNumber>
                </FormItem>
              </Col>
              <Col span="6">
                <FormItem label="每人每日抽奖机会">
                  <InputNumber :min="0" style="width:100%" v-model="addData.daynum" placeholder="输入数量"></InputNumber>
                </FormItem>
              </Col>
              <Col span="6">
                <FormItem label="单人最多中奖次数">
                  <InputNumber :min="0" style="width:100%" v-model="addData.singledraw" placeholder="输入数量"></InputNumber>
                </FormItem>
              </Col>
              <Col span="6">
                <FormItem label="好友助力">
                  <RadioGroup v-model="addData.help">
                    <Radio :label="0">关闭</Radio>
                    <Radio :label="1">开启好友助力</Radio>
                  </RadioGroup>
                  <Tooltip content="助力成功后增加一次抽奖机会">
                    <Icon type="md-alert" size="22"/>
                  </Tooltip>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="6">
                <FormItem label="分享标题">
                  <Input v-model="addData.sharetitle" placeholder="请输入"></Input>
                </FormItem>
              </Col>
              <Col span="6">
                <FormItem label="分享描述">
                  <Input v-model="addData.sharemsg" placeholder="请输入"></Input>
                </FormItem>
              </Col>
              <Col span="6">
                <FormItem label="分享链接">
                  <Input v-model="addData.shareurl" placeholder="请输入"></Input>
                </FormItem>
              </Col>
              <Col span="6">
                <FormItem label="分享图片">
                  <Input v-model="addData.shareimg">
                    <UploadFile @uploadSucc="onUploadShareImg" slot="append"></UploadFile>
                  </Input>
                </FormItem>
              </Col>
            </Row>
          </Form>
          <div class="game-type">
            <Row>
              <Col span="6">
                背景色：
                <ColorPicker v-model="addData.bgcolor" alpha recommend />
              </Col>
              <Col span="18">
                <div class="item-box">
                  <span class="type-item" @click="onSelectGameType(item.type)" :class="{'selected' : addData.type==item.type}" v-for="(item, index) in gameType" :key="index" :label="item.type">
                    <img  :src="item.url" alt="">
                  </span>
                </div>
              </Col>
            </Row>
          </div>
          <div class="game-list">
            <Tabs type="card" v-model="activeTab">
              <Button @click="handleTabsAdd" type="primary" slot="extra">增加</Button>
              <TabPane v-for="(tab, index) in tabs" :name="index" :key="index" :label="'奖品' + (index+1)">
                <div class="price-edit">
                  <Form :label-width="80">
                    <Row>
                      <Col span="6">
                        <FormItem label="奖品名称">
                          <Input v-model="tab.name" placeholder="请输入"></Input>
                        </FormItem>
                      </Col>
                      <Col span="6">
                        <FormItem label="奖品id">
                          <Input v-model="tab.cardid" placeholder="请输入"></Input>
                        </FormItem>
                      </Col>
                      <Col span="4">
                        <FormItem label="数量">
                          <InputNumber :min="0" style="width:100%" v-model="tab.num" placeholder="输入数量"></InputNumber>
                        </FormItem>
                      </Col>
                      <Col span="4">
                        <FormItem label="中奖概率">
                          <InputNumber :min="0" style="width:100%" v-model="tab.drawval" placeholder="请输入"></InputNumber>
                        </FormItem>
                      </Col>
                    </Row>
                    <Row>
                      <Col span="12">
                        <FormItem label="奖品图片">
                          <Input v-model="tab.imgurl" placeholder="请输入">
                            <UploadFile @uploadSucc="e => onUploadImg(e, index)" slot="append"></UploadFile>
                          </Input>
                          <!-- <UploadFile @uploadSucc="e => onUploadImg(e, index)"></UploadFile> -->
                        </FormItem>
                      </Col>
                    </Row>
                    <Row>
                      <Col span="12">
                        <FormItem label="描述信息">
                          <Input v-model="tab.msgdesc" placeholder="奖品描述信息"></Input>
                        </FormItem>
                      </Col>
                    </Row>
                    <Row>
                      <Col span="24">
                        <FormItem>
                          <Button @click="onClickPrice(index)">删除此奖品</Button>
                        </FormItem>
                      </Col>

                    </Row>
                  </Form>
                </div>
              </TabPane>
            </Tabs>
            <Row>
              <Col span="24">
                <Button type="primary" style="margin-left:80px;" :loading="submitLoading" @click="onClickSave">保存配置</Button>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </Card>
  </div>
</template>
<script>
import serverApi from '../../axios'
import UploadFile from '../common/UploadFile'
export default {
  name: 'LuckDrawEdit',
  components: {
    UploadFile
  },
  data () {
    return {
      activeTab: 0,
      isLoading: false,
      addData: {
        type: 1,
        gamename: '',
        starttime: '',
        endtime: '',
        singlenum: 0,
        daynum: 0,
        singledraw: 0,
        help: 0,
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
      selectType: 1,
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
      tabs: [
        {
          name: '',
          imgurl: '',
          img: '',
          cardid: '',
          num: 0,
          imgshare: '',
          drawval: '',
          msgdesc: ''
        }
      ],
      gameType: [
        {
          type: 1, //九宫格
          url: 'http://cdn.cqyyy.cn/pic/20190311180500.png'
        },
        {
          type: 2, // 大转盘
          url: 'http://cdn.cqyyy.cn/pic/20190311180502.png'
        },
        {
          type: 3, // 刮刮卡
          url: 'http://cdn.cqyyy.cn/pic/20190311180504.png'
        },
        {
          type: 4, // 砸金蛋
          url: 'http://cdn.cqyyy.cn/pic/20190311180501.png'
        },
        {
          type: 5, // 摇一摇
          url: 'http://cdn.cqyyy.cn/pic/20190311180503.png'
        },
      ],
      submitLoading: false
    }
  },
  created () {
    this.getGameInfo()
  },
  methods: {
    getGameInfo () {
      this.$store.commit('pageLoading', true)
      let arr = [
        {
          name: '',
          imgurl: '',
          img: '',
          cardid: '',
          num: 0,
          imgshare: '',
          drawval: '',
          msgdesc: ''
        }
      ]
      const id = this.$route.params.id
      serverApi('/activity/gameinfo', {id: id},
        response => {
          if (response.data.code === 0) {
            this.addData = response.data.data
            this.tabs = response.data.data.gamelist.length > 0 ? response.data.data.gamelist : arr
          } else {
            this.$Message.warning(response.data.msg)
          }
         this.$store.commit('pageLoading', false)
        },
        error => {
         this.$store.commit('pageLoading', false)
          this.$Message.error(error.toString())
        }
      )

    },
    onSelectStartDate (e) {
      this.addData.starttime = e
    },
    onSelectEndDate (e) {
      this.addData.endtime = e
    },
    onSelectGameType (e) {
      this.addData.type = e
    },
    onUploadShareImg (path) {
      this.addData.shareimg = path
    },
    onUploadSinningImg (path) {
      this.addData.winningimg = path
    },
    onUploadLoseImg (path) {
      this.addData.loseimg = path
    },
    onUploadbgimgImg (path) {
      this.addData.bgimg = path
    },
    handleTabsAdd () {
      let obj = {
        name: '',
        imgurl: '',
        img: '',
        cardid: '',
        num: '',
        imgshare: '',
        drawval: '',
        msgdesc: ''
      }
      this.tabs.push(obj)
      this.activeTab = this.tabs.length - 1
    },
    onClickPrice (e) {
      this.tabs.splice(e, 1)
      this.activeTab = 0
    },
    onUploadImg (path, index) {
      this.tabs[index].imgurl = path
    },
    onClickSave () {
      this.addData.gamelist = JSON.stringify(this.tabs)
      this.submitLoading = true
      console.log(this.addData)
      serverApi('/activity/game', this.addData,
        response => {
          this.submitLoading = false
          if (response.data.code === 0) {
            this.$Message.success(response.data.msg)
          } else {
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          this.submitLoading = false
          console.log(error)
          this.$Message.error(error.toString())
        }
      )
    }
  }
}
</script>
<style lang="less" scoped>
.box{
  .content{
    display: flex;
    flex-direction: row;
    .phone{
      width: 420px;
      background-color: rgb(224, 222, 222);
      height: 720px;
      flex-shrink: 0;
      justify-content: center;
      padding-top: 20px;
      .phone-box{
        width: 345px;
        background-color: #fff;
        height: 627px;
        margin: 0 auto;
        .phone-title{
          width: 100%;
          background-color: #fff;
          position: relative;
          font-size: 0;
          img{
            width: 100%;
          }
          p{
            position: absolute;
            left: 0;
            right: 0;
            text-align: center;
            bottom: 8px;
            font-size: 15px;
            color: #444;
          }
        }
        .phone-content{
          width: 100%;
          height: 100%;
          background-size: 100% 100%;
        }
      }
    }
    .editarea{
      width: 100%;
      overflow: hidden;
      .game-type{
        margin: 0 12px;
        border: 1px solid #eee;
        padding: 12px;
        .item-box{
          display: flex;
          flex-direction: row;
          .type-item{
            width: 120px;
            height: 90px;
            display: flex;
            justify-content: center;
            align-items: center;
            border: 1px solid #eee;
            border-right: none;
            border-collapse: collapse;
            cursor: pointer;
            &:last-child{
              border-right: 1px solid #eee;
            }
            &.selected{
              border: 1px solid #2d8cf0;
            }
          }
        }
      }
      .game-list{
        padding: 0 12px;
        margin-top: 15px;
        .price-edit{
          width: 100%;
          overflow: hidden;
        }
      }
    }
  }

}
</style>
