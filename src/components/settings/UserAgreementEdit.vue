<template>
  <div class="box">
    <Card :bordered="false" class="mb10">
      <div class="shop-img">
        <img src="http://cdn.cqyyy.cn/pic/20190311180501.png" alt="">
      </div>
      <div class="tips">
        <h4><span style="font-size:14px;font-weight:500">修改协议内容</span></h4>
        <p>
          修改协议内容
          <router-link :to="{name: 'UserAgreement'}">返回【协议列表】</router-link>
        </p>
      </div>
      <div class="clear-fix"></div>
    </Card>
    <Card :bordered="false">
      <Row>
        <Form ref="form" :model="addData" :rules="rules" :label-width="70">
          <Col span="6">
            <FormItem label="协议名称" style="margin-bottom:0">
              <Input v-model="addData.protocolname" placeholder="请输入协议名称"></Input>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="协议类型" style="margin-bottom:0">
              <Select v-model="addData.protocoltype" transfer>
                <Option :value="1">注册使用</Option>
                <Option :value="2">登录使用</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="12">
            <div style="text-align:right">
              <Button type="primary" @click="onClickSave" :loading="saveLoading">保存</Button>
            </div>
          </Col>
        </Form>
      </Row>
      <Divider />
      <Row>
        <Col span="24">
          <TextEdit ref="ue" :config="ueConfig"></TextEdit>
        </Col>
      </Row>
    </Card>
  </div>
</template>
<script>
import serverApi from '../../axios'
import TextEdit from '../common/text-editor'
export default {
  name: 'UserAgreementEdit',
  components: {
    TextEdit
  },
  data () {
    return {
      searchKey: '',
      addData: {},
      saveLoading: false,
      ueConfig: {
        initialFrameWidth: '100%',
        initialFrameHeight: 400,
        toolbars: [['fullscreen', 'source', 'undo', 'redo', 'bold', 'italic',
          'underline','forecolor','fontborder', 'backcolor', 'fontsize', 'fontfamily',
          'justifyleft', 'justifyright','justifycenter', 'justifyjustify',
          'strikethrough','superscript', 'subscript','map', 'inserttable',
           'pasteplain', 'insertimage', 'lineheight', 'edittable', 'edittd', '|',
           'backcolor','insertorderedlist', 'insertunorderedlist',
          'selectall', 'cleardoc', 'link','emotion']
        ]
      },
    }
  },
  mounted () {
    this.getTableData()
  },
  methods: {
    getTableData () {
      this.tableLoading = true
      let d = {
        protocolid: this.$route.params.id
      }
      serverApi('/Protocol/Protocolinfo', d,
        response => {
          console.log(response)
          if (response.data.code === 0){
            this.addData = response.data.data
            this.$nextTick(() => {
              this.$refs.ue.setContent(decodeURIComponent(response.data.data.content))
            })
          }else{
            this.$Message.warning(response.data.msg)
          }
          this.tableLoading = false
        },
        error => {
          console.log(error)
          this.tableLoading = false
        }
      )
    },
    onClickSave () {
      if (!this.addData.protocolname) {
        this.$Message.warning('请输入名称！')
        return false
      }
      let content = this.$refs.ue.getUEContent()
      this.addData.content = content ? encodeURIComponent(content) : ''
      this.saveLoading = true
      serverApi('/Protocol/Protocoledit', this.addData,
        response => {
          if (response.data.code === 0){
            this.$Message.success(response.data.msg)
          }else{
            this.$Message.warning(response.data.msg)
          }
          this.saveLoading = false
        },
        error => {
          console.log(error)
          this.saveLoading = false
        }
      )
    }
  }
}
</script>
<style lang="less" scoped>
.box{
  position: relative;
}
.shop-img{
  width: 40px;
  height: 40px;
  float: left;
  img{
    height: 100%;
    width: 100%;
  }
}
.tips{
  padding-left: 50px;
  h4{
    margin-top: 2px;
  }
  p{
    margin-top: 3px;
  }
}
.share-img{
  height: 40px;
}
</style>
