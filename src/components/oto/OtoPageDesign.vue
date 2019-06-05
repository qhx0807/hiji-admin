<template>
  <div class="box">
    <DesignBase
      :designComponents="designComponents"
      :groupedComponents="groupedComponents"
      :value="pageValue"
      @onAddComponent="onAddDesignComponent"
    >
    </DesignBase>
    <Button @click="getPageValue">获取数据</Button>
  </div>
</template>
<script>
import serverApi from '../../axios'
import DesignBase from '../design/base/DesignBase'
import Config from '../design/components/config'
import WhiteSpace from '../design/components/whitespace'
export default {
  name: 'OtoPageDesign',
  components: {
    DesignBase
  },
  data () {
    return {
      pageValue: [
        {
          type: 'config',
          title: '测试页面',
          bgcolor: '#ffffff'
        },
      ],
      pageinfo: {},
      designComponents: [Config, WhiteSpace],
      groupedComponents: []
    }
  },
  created () {
    // this.getPageInfo()
    const group = [
      {
        name: '基础',
        components: [WhiteSpace]
      }
    ]
    this.groupedComponents = this.getGroupDesigns(group)
  },
  methods: {
    getPageInfo () {
      this.$store.commit('pageLoading', true)
      let d = {
        homeid: this.$route.params.id
      }
      serverApi('/Homepage/webhomeinfo', d,
        response => {
          if (response.data.code === 0) {
            this.pageinfo = response.data.data
            this.pageValue = response.data.data.content
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
    onAddDesignComponent (val) {
      this.pageValue.push(val)
    },
    getPageValue () {
      console.log(this.pageValue)
    },
    getGroupDesigns (items) {
      items.map(item => {
        item.components.map((sub, index) => {
          item.components[index] = {
            name: sub.designDescription,
            selector: sub.designType
          }
        })
      })
      return items
    }
  }
}
</script>
<style lang="less" scoped>
.box{
  background-color: #fff;
  min-height: 600px;
  padding-left: 100px;
  padding-top: 20px;
}
</style>
