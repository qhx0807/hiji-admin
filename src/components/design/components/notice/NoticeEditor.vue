<template>
  <DesignEditor>
    <Form :label-width="80">
      <FormItem label="公告" required style="margin-bottom:10px">
        <Input placeholder="请输入" v-model="designValue.content"></Input>
      </FormItem>
      <FormItem label="文字颜色" style="margin-bottom:10px">
        <ColorPicker alpha v-model="designValue.color" @on-active-change="e => designValue.color = e" recommend />
        <Button @click="designValue.color = '#ed6a0c'" style="margin-left:10px">重置</Button>
      </FormItem>
      <FormItem label="背景颜色" style="margin-bottom:10px">
        <ColorPicker alpha v-model="designValue.bgcolor" @on-active-change="e => designValue.bgcolor = e" recommend />
        <Button @click="designValue.bgcolor = '#fffbe8'" style="margin-left:10px">重置</Button>
      </FormItem>
      <FormItem label="城市">
        <!-- <RadioGroup v-model="value.city">
          <Radio v-for="item in citylist" :key="item.value" :label="item.value">{{item.name}}</Radio>
        </RadioGroup> -->
        <CheckboxGroup v-model="value.city">
          <Checkbox v-for="item in citylist" :key="item.value" :label="item.value">{{item.name}}</Checkbox>
        </CheckboxGroup>
      </FormItem>
    </Form>
  </DesignEditor>
</template>
<script>
import editorMixins from '../../mixins/editorMixins'
export default {
  name: 'NoticeEditor',
  mixins: [editorMixins],
  data () {
    return {}
  },
  computed: {
    citylist () {
      return this.$store.state.cityList
    }
  },
  created () {},
  methods: {
  }
}
</script>
<style lang="less" scoped>

</style>
