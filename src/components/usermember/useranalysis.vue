<template>
  <div class="box">
    <Row :gutter="10">
      <Col :lg="4" :md="6" :sm="12" class="mb10">
        <Card :bordered="false" :padding="0">
          <div class="card-item">
            <div class="card-icon card1bg">
              <Icon size="40" type="md-arrow-round-up" />
            </div>
            <div class="card-content">
              <h4 class="card1">{{memberInfo.today}}</h4>
              <p>今日增长人数</p>
            </div>
          </div>
        </Card>
      </Col>
      <Col :lg="4" :md="6" :sm="12" class="mb10">
        <Card :bordered="false" :padding="0">
          <div class="card-item">
            <div class="card-icon card2bg">
              <Icon size="40" type="md-arrow-round-up"></Icon>
            </div>
            <div class="card-content">
              <h4 class="card2">{{memberInfo.yesterday}}</h4>
              <p>昨日增长人数</p>
            </div>
          </div>
        </Card>
      </Col>
      <Col :lg="4" :md="6" :sm="12" class="mb10">
        <Card :bordered="false" :padding="0">
          <div class="card-item">
            <div class="card-icon card3bg">
              <Icon size="40" type="md-arrow-round-up"></Icon>
            </div>
            <div class="card-content">
              <h4 class="card3">{{memberInfo.nearly7days}}</h4>
              <p>7天内增长人数</p>
            </div>
          </div>
        </Card>
      </Col>
      <Col :lg="4" :md="6" :sm="12" class="mb10">
        <Card :bordered="false" :padding="0">
          <div class="card-item">
            <div class="card-icon card4bg">
              <Icon size="40" type="md-arrow-round-up"></Icon>
            </div>
            <div class="card-content">
              <h4 class="card4">{{memberInfo.thisweek}}</h4>
              <p>本周</p>
            </div>
          </div>
        </Card>
      </Col>
      <Col :lg="4" :md="6" :sm="12" class="mb10">
        <Card :bordered="false" :padding="0">
          <div class="card-item">
            <div class="card-icon card1bg">
              <Icon size="40" type="md-arrow-round-up" />
            </div>
            <div class="card-content">
              <h4 class="card1">{{memberInfo.lastweek}}</h4>
              <p>上周</p>
            </div>
          </div>
        </Card>
      </Col>
      <Col :lg="4" :md="6" :sm="12" class="mb10">
        <Card :bordered="false" :padding="0">
          <div class="card-item">
            <div class="card-icon card2bg">
              <Icon size="40" type="md-arrow-round-up"></Icon>
            </div>
            <div class="card-content">
              <h4 class="card2">{{memberInfo.thismonth}}</h4>
              <p>本月</p>
            </div>
          </div>
        </Card>
      </Col>
      <Col :lg="4" :md="6" :sm="12" class="mb10">
        <Card :bordered="false" :padding="0">
          <div class="card-item">
            <div class="card-icon card3bg">
              <Icon size="40" type="md-arrow-round-up"></Icon>
            </div>
            <div class="card-content">
              <h4 class="card3">{{memberInfo.lastmonth}}</h4>
              <p>上月</p>
            </div>
          </div>
        </Card>
      </Col>
      <Col :lg="4" :md="6" :sm="12" class="mb10">
        <Card :bordered="false" :padding="0">
          <div class="card-item">
            <div class="card-icon card4bg">
              <Icon size="40" type="md-arrow-round-up"></Icon>
            </div>
            <div class="card-content">
              <h4 class="card4">{{memberInfo.thisquarter}}</h4>
              <p>本季度</p>
            </div>
          </div>
        </Card>
      </Col>
      <Col :lg="4" :md="6" :sm="12" class="mb10">
        <Card :bordered="false" :padding="0">
          <div class="card-item">
            <div class="card-icon card2bg">
              <Icon size="40" type="md-arrow-round-up"></Icon>
            </div>
            <div class="card-content">
              <h4 class="card2">{{memberInfo.lastquarter}}</h4>
              <p>上季度</p>
            </div>
          </div>
        </Card>
      </Col>
      <Col :lg="4" :md="6" :sm="12" class="mb10">
        <Card :bordered="false" :padding="0">
          <div class="card-item">
            <div class="card-icon card3bg">
              <Icon size="40" type="md-arrow-round-up"></Icon>
            </div>
            <div class="card-content">
              <h4 class="card3">{{memberInfo.nearly6month}}</h4>
              <p>近6个月内</p>
            </div>
          </div>
        </Card>
      </Col>
      <Col :lg="4" :md="6" :sm="12" class="mb10">
        <Card :bordered="false" :padding="0">
          <div class="card-item">
            <div class="card-icon card2bg">
              <Icon size="40" type="md-arrow-round-up"></Icon>
            </div>
            <div class="card-content">
              <h4 class="card2">{{memberInfo.thisyear}}</h4>
              <p>本年</p>
            </div>
          </div>
        </Card>
      </Col>
      <Col :lg="4" :md="6" :sm="12" class="mb10">
        <Card :bordered="false" :padding="0">
          <div class="card-item">
            <div class="card-icon card1bg">
              <Icon size="40" type="md-arrow-round-up"></Icon>
            </div>
            <div class="card-content">
              <h4 class="card1">{{memberInfo.lastyear}}</h4>
              <p>去年</p>
            </div>
          </div>
        </Card>
      </Col>
    </Row>
  </div>
</template>
<script>
import serverApi from '../../axios'
export default {
  name: 'UserAnalysis',
  data () {
    return {
      memberInfo: {}
    }
  },
  created () {
    this.getStaData()
  },
  methods: {
    getStaData () {
      this.$store.commit('pageLoading', true)
      serverApi('/member/statistics', null,
        response => {
          console.log(response)
          if (response.data.code === 0){
            this.memberInfo = response.data.data[0]
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
    }
  }
}
</script>
<style lang="less" scoped>
.card-item{
  height: 100px;
}
.card-icon{
  float: left;
  width: 60px;
  background-color: rgb(45, 140, 240);
  color: white;
  padding-left: 12px;
  padding-right: 12px;
  height: 100%;
  border-radius: 3px 0 0 3px;
  display: flex;
  text-align: center;
  justify-content: center;
  align-items: center;
}
.mb10{
  margin-bottom: 15px;
}
.card1bg{
  background-color: rgb(45, 140, 240);
}
.card2bg{
  background-color: rgb(100, 213, 114);
}
.card3bg{
  background-color: rgb(255, 213, 114);
}
.card4bg{
  background-color: rgb(242, 94, 67);
}
.card1{
  color: rgb(45, 140, 240);
}
.card2{
  color: rgb(100, 213, 114);
}
.card3{
  color: rgb(255, 213, 114);
}
.card4{
  color: rgb(242, 94, 67);
}
.card-content{
  text-align: center;
  h4{
    padding-top: 20px;
    font-size: 30px;
    font-weight: 700;
  }
  p{
    font-size: 12px;
    font-weight: 500;
    color: #C8C8C8;
  }
}
</style>
