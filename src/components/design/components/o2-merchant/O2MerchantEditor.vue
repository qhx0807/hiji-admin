<template>
  <DesignEditor :desc="desc">
    <Form :label-width="80">
      <FormItem label="商户编码" style="margin-bottom:10px">
        <Input v-model="designValue.ids" type="textarea" :autosize="{minRows: 4,maxRows: 8}" placeholder="商户编码, 以逗号分隔"></Input>
      </FormItem>
      <FormItem style="margin-bottom:10px">
        <Button :loading="searchLoading"  @click="onClickQuery">查询</Button>
      </FormItem>
    </Form>
  </DesignEditor>
</template>
<script>
import editorMixins from '../../mixins/editorMixins'
import serverApi from '../../../../axios/index.js'
export default {
  name: 'O2MerchantEditor',
  mixins: [editorMixins],
  data () {
    return {
      searchLoading: false
    }
  },
  methods: {
    onClickQuery () {
      if (!this.designValue.ids) {
        this.$Message.warning('请输入商户编码')
        return false
      }
      this.searchLoading = true
      let d = {
        ids: this.designValue.ids,
        type: 'o2-merchant'
      }
      serverApi('/Homepage/waresearch', d,
        response => {
          if (response.data.code === 0) {
            if (response.data.data.length > 0) {
              this.designValue.items = response.data.data
            } else {
              this.$Message.warning('未查询到数据')
            }
          } else {
            this.$Message.warning(response.data.msg)
          }
          this.searchLoading = false
        },
        error => {
          this.$Message.error(error.toString())
          this.searchLoading = false
        }
      )
    }
  }
}
</script>
<style lang="less" scoped>

</style>
