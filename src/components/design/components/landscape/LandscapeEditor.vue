<template>
  <DesignEditor :desc="desc">
    <Form :label-width="60">
      <FormItem label="图片" style="margin-bottom: 10px">
        <InputWithUpload v-model="designValue.imgurl"></InputWithUpload>
      </FormItem>
      <FormItem label="显示蒙层" style="margin-bottom: 10px">
        <i-switch v-model="designValue.mask">
          <span slot="open">是</span>
          <span slot="close">否</span>
        </i-switch>
      </FormItem>
      <FormItem label="城市" style="margin-bottom: 10px">
        <CheckboxGroup v-model="designValue.city" >
          <Checkbox v-for="item in citylist" :key="item.value" :label="item.value">{{item.name}}</Checkbox>
        </CheckboxGroup>
      </FormItem>
      <FormItem label="链接类型" style="margin-bottom: 10px">
        <Select v-model="designValue.linktype">
          <Option v-for="item in linkTypeList" :key="item.value" :value="item.value">{{item.label}}</Option>
        </Select>
      </FormItem>
      <FormItem label="链接地址">
        <Input placeholder="请输入" v-model="designValue.linkurl"></Input>
      </FormItem>
      <FormItem>
        <div class="bgimg">
          <img :src="designValue.imgurl" alt="">
        </div>
      </FormItem>
    </Form>
  </DesignEditor>
</template>
<script>
import editorMixins from '../../mixins/editorMixins'
import InputWithUpload from '../../common/InputWithUpload.vue'
export default {
  name: 'LandscapeEditor',
  mixins: [editorMixins],
  components: {
    InputWithUpload
  },
  data () {
    return {}
  },
  computed: {
    citylist () {
      return this.$store.state.cityList
    },
    cityValues () {
      let arr = []
      this.citylist.forEach(item => {
        arr.push(item.value)
      })
      return arr
    },
    linkTypeList () {
      return this.$store.state.actionTypeArr
    }
  },
  created () {
    this.designValue.city = this.cityValues
  },
  methods: {
  }
}
</script>
<style lang="less" scoped>
.bgimg{
  height: 140px;
  img{
    max-height: 100%;
  }
}
</style>
