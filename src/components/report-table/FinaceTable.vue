<template>
  <div class="box">
    <Card :bordered="false"  class="mb12">
      <p>财务报表</p>
    </Card>
    <Row :gutter="10">
      <Col span="6" v-for="(item, index) in itemData" :key="index">
        <Card :bordered="false" class="item mb12" @click.native="seeReportTable(item.routeName)">
          <div class="item-left">
            <div class="img-box">
              <img :src="item.imgSrc" alt="">
            </div>
          </div>
          <div class="item-right">
            <h5 class="item-title">{{item.title}}</h5>
            <p>{{item.desc}}</p>
          </div>
          <div class="clear-fix"></div>
        </Card>
      </Col>
    </Row>
  </div>
</template>
<script>
import serverApi from '../../axios'
export default {
  name: 'FinaceTable',
  data () {
    return {
      itemData: [
        {
          imgSrc: 'https://gw.alipayobjects.com/zos/rmsportal/pbmKMSFpLurLALLNliUQ.svg',
          title: '实收统计',
          desc: '实收统计实收统计实收统计实收统计',
          routeName: 'RealReceive'
        },
        {
          imgSrc: 'https://gw.alipayobjects.com/zos/rmsportal/hBbIHzUsSbSxrhoRFYzi.svg',
          title: '实收汇总',
          desc: '实收汇总实收汇总实收汇总实收汇总',
          routeName: 'RealReceiveTotal'
        },
        {
          imgSrc: 'https://gw.alipayobjects.com/zos/rmsportal/BISfzKcCNCYFmTYcUygW.svg',
          title: '实付统计',
          desc: '实付统计实付统计',
          routeName: 'RealPay'
        },
        {
          imgSrc: 'https://gw.alipayobjects.com/zos/rmsportal/RpJIQitGbSCHwLMimybX.svg',
          title: '结余',
          desc: '结余',
          routeName: 'Remain'
        }
      ]
    }
  },
  created () {},
  methods: {
    seeReportTable (name) {
      this.$router.push({name: name})
    }
  }
}
</script>
<style lang="less" scoped>
.item{
  cursor: pointer;
  &:hover{
    .item-right{
      padding-top: 5px;
      h5{
        color: #111;
      }
    }
    .img-box{
      box-shadow: rgba(47, 84, 235, 0.117647) 0px 6px 12px;
    }
  }
}
.item-left{
  width: 70px;
  height: 60px;
  float: left;
  .img-box{
    width: 60px;
    height: 60px;
    border-radius: 30px;
    // box-shadow: rgba(47, 84, 235, 0.117647) 0px 6px 12px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.item-right{
  padding-left: 75px;
  padding-top: 10px;
  transition: all .3s;
  h5{
    font-weight: normal;
    font-size: 14px;
  }
  p{
    font-size: 13px;
    color: rgba(0, 0, 0, .45);
  }
}
</style>
