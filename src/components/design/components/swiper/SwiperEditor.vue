<template>
  <DesignEditor :desc="desc">
    <Form :label-width="80">
      <FormItem>
        <span slot="label">
          组件高度
          <Tooltip placement="top" content="数字+单位，vw, wh, px">
            <Icon color="#bdf" size="16" type="ios-information-circle-outline" />
          </Tooltip>
        </span>
        <Input size="small" v-model="designValue.height"></Input>
      </FormItem>
    </Form>

    <div class="design-swiper-editor-items">
      <Container @drop="onDropItem">
        <Draggable v-for="(item, index) in designValue.items" :key="item.id">
          <ImageItemEditor @uploadSuccess="url => onImageEditorItemUpload(url, index)" :imgsrc="item.imageurl" @onRemoveImgItem="onRemoveImgItem(index)">
            <Form :label-width="60">
              <FormItem label="链接类型">
                <Select size="small" v-model="item.linktype">
                  <Option v-for="item in linkTypeList" :key="item.value" :value="item.value">{{item.label}}</Option>
                </Select>
              </FormItem>
              <FormItem label="链接地址">
                <Input size="small" placeholder="请输入" v-model="item.linkurl"></Input>
              </FormItem>
              <FormItem label="是否展示">
                <i-switch size="small" v-model="item.isshow" />
              </FormItem>
              <FormItem label="城市">
                <!-- <Select size="small" v-model="item.city">
                  <Option v-for="item in citylist" :key="item.value" :value="item.value">{{item.name}}</Option>
                </Select> -->
                <CheckboxGroup v-model="item.city" size="small">
                  <Checkbox v-for="item in citylist" :key="item.value" :label="item.value">{{item.name}}</Checkbox>
                </CheckboxGroup>
              </FormItem>
            </Form>
          </ImageItemEditor>
        </Draggable>
      </Container>
    </div>
    <DesignEditorImageUpload @uploadSuccess="uploadImageCallback" />
  </DesignEditor>
</template>
<script>
import { Container, Draggable } from "vue-smooth-dnd"
import DesignEditorImageUpload from '../../common/DesignEditorImageUpload.vue'
import editorMixins from '../../mixins/editorMixins'
import { applyDrag } from '../../../../utlis/dnd'
import ImageItemEditor from '../../common/ImageItemEditor.vue'
export default {
  name: 'SwiperEditor',
  mixins: [editorMixins],
  components: {
    DesignEditorImageUpload,
    Container,
    Draggable,
    ImageItemEditor
  },
  data () {
    return {}
  },
  created () {},
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
  methods: {
    uploadImageCallback (url) {
      let item = {
        imageurl: url,
        linktype: '',
        linkurl: '',
        city: [].concat(this.cityValues),
        isshow: true
      }
      this.designValue.items.push(item)
    },
    onImageEditorItemUpload (url, index) {
      this.designValue.items[index].imageurl = url
    },
    onRemoveImgItem (index) {
      this.designValue.items.splice(index, 1)
    },
    onDropItem (dropResult) {
      this.designValue.items = applyDrag(this.designValue.items, dropResult)
    }
  }
}
</script>
<style lang="less" scoped>

</style>
