<template>
  <DesignEditor :desc="desc">
    <Form :label-width="65">
      <FormItem label="商品ID" style="margin-bottom: 12px">
        <Input v-model="designValue.ids" placeholder="商品id, 以逗号分隔">
          <Button :loading="searchLoading" slot="append" @click="onClickQueryGoods">查询</Button>
        </Input>
      </FormItem>
      <FormItem label="商品组" style="margin-bottom: 12px">
        <Select v-model="designValue.templateId" filterable clearable placeholder="选择商品组则上面商品ID无效" @on-change="onSelectGoodsGroup">
          <Option v-for="(item, index) in designGoodsGroup" :key="index" :value="item.id">{{item.name}}</Option>
        </Select>
      </FormItem>
      <FormItem label="列表样式" style="margin-bottom: 10px">
        <RadioGroup v-model="designValue.listStyle">
          <Radio :label="1">大图模式</Radio>
          <Radio :label="2">一行两个</Radio>
          <Radio :label="3">一行三个</Radio>
          <br>
          <Radio :label="4">详细列表</Radio>
          <Radio :label="5">一大两小</Radio>
          <Radio :label="6">横向滑动</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="页面边距" style="margin-bottom:10px">
        <Slider v-model="designValue.padding" :max="30" show-input input-size="small"></Slider>
      </FormItem>
      <FormItem label="图片间距" style="margin-bottom:10px">
        <Slider v-model="designValue.spacing" :max="30" show-input input-size="small"></Slider>
      </FormItem>
      <FormItem label="商品样式" style="margin-bottom:10px">
        <RadioGroup v-model="designValue.itemStyle">
          <Radio :label="1">无边白底</Radio>
          <Radio :label="2">卡片投影</Radio>
          <Radio :label="3">描边白底</Radio>
          <Radio :label="4">无边透明底</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="图片比例" style="margin-bottom:10px">
        <RadioGroup v-model="designValue.imgScale">
          <Radio :label="1">1 : 1</Radio>
          <Radio :label="2">3 : 2</Radio>
          <Radio :label="3">4 : 3</Radio>
          <Radio :label="4">16 : 9</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="文本样式" style="margin-bottom:10px">
        <RadioGroup v-model="designValue.textStyle">
          <Radio :label="1">常规体</Radio>
          <Radio :label="2">加粗体</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="显示内容" style="margin-bottom:10px">
        <CheckboxGroup v-model="designValue.showContent">
          <Checkbox label="name">商品名称</Checkbox>
          <Checkbox label="desc">商品描述</Checkbox>
          <Checkbox label="disprice">抢购价</Checkbox>
          <Checkbox label="orprice">商品原价</Checkbox>
          <Checkbox label="stock">剩余库存</Checkbox>
          <Checkbox label="timer">抢购倒计时</Checkbox>
          <Checkbox label="progress">抢购进度条</Checkbox>
          <Checkbox label="buynum">已抢人数</Checkbox>
          <Checkbox label="buybtn">购买按钮</Checkbox>
          <Checkbox label="badge">角标</Checkbox>
          <Checkbox label="gap">减x元</Checkbox>
        </CheckboxGroup>
      </FormItem>
      <FormItem v-show="designValue.showContent.indexOf('buybtn') > -1" label="购买按钮" style="margin-bottom:10px">
        <RadioGroup v-model="designValue.btnStyle">
          <Radio :label="1">样式一</Radio>
          <Radio :label="2">样式二</Radio>
          <Radio :label="3">样式三</Radio>
          <Radio :label="4">样式四</Radio>
          <Radio :label="5">样式五</Radio>
          <Radio :label="6">样式六</Radio>
          <Radio :label="7">样式七</Radio>
          <Radio :label="8">样式八</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem v-show="[3,4,7,8].includes(designValue.btnStyle)" label="按钮文字" style="margin-bottom:10px">
        <Input size="small" v-model="designValue.btnText" style="width: 100px" :maxlength="4"></Input>
        <Tooltip content="自定义购买按钮文案，最多输入四个字" placement="top">
          <Icon type="ios-alert-outline" size="18" />
        </Tooltip>
      </FormItem>
      <FormItem v-show="designValue.showContent.indexOf('badge') > -1" label="商品角标" style="margin-bottom:10px">
        <RadioGroup v-model="designValue.badgeStyle">
          <Radio label="new-arrival">新品</Radio>
          <Radio label="hot-sale">热卖</Radio>
          <Radio label="new">NEW</Radio>
          <Radio label="hot">HOT</Radio>
          <Radio label="custom">自定义</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem v-show="designValue.badgeStyle === 'custom'" style="margin-bottom:10px">
        <InputWithUpload v-model="designValue.badgeImg" size="small"  />
      </FormItem>
    </Form>
  </DesignEditor>
</template>
<script>
import editorMixins from '../../mixins/editorMixins'
import serverApi from '../../../../axios/index.js'
import InputWithUpload from '../../common/InputWithUpload.vue'
export default {
  name: 'TimeLimitDiscountEditor',
  mixins: [editorMixins],
  components: {
    InputWithUpload
  },
  data () {
    return {
      searchLoading: false
    }
  },
  computed: {
    designGoodsGroup () {
      let group = this.$store.state.designGoodsGroup
      return group.filter(item => item.type === 'timelimit-discount')
    }
  },
  created () {},
  methods: {
    onClickQueryGoods () {
      if (!this.designValue.ids) {
        this.$Message.warning('请输入商品ID')
        return false
      }
      this.searchLoading = true
      let d = {
        ids: this.designValue.ids,
        type: 'timelimit-discount'
      }
      serverApi('/Homepage/waresearch', d,
        response => {
          if (response.data.data.length > 0) {
            this.designValue.items = response.data.data
            this.designValue.templateId = ''
          } else {
            this.$Message.warning('未查询到数据')
          }
          this.searchLoading = false
        },
        error => {
          this.$Message.error(error.toString())
          this.searchLoading = false
        }
      )
    },
    onSelectGoodsGroup (e) {
      if (e) {
        this.$Message.loading({
          duration: 0,
          content: '查询中...'
        })
        serverApi('/homepage/templatewarelists',  {id: e},
          response => {
            this.$Message.destroy()
            if (response.data.code === 0) {
              this.designValue.items = response.data.data
            } else {
              this.$Message.warning(response.data.msg)
            }
          },
          error => {
            this.$Message.destroy()
            this.$Message.error(error.toString())
          }
        )
      } else {
        this.designValue.templateId = ''
      }
    }
  }
}
</script>
<style lang="less" scoped>

</style>

