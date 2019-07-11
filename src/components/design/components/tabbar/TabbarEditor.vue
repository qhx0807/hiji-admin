<template>
  <DesignEditor :desc="desc">
    <Form :label-width="80">
      <Row>
        <Col span="12">
          <FormItem label="背景颜色" style="margin-bottom:10px">
            <ColorPicker alpha v-model="designValue.bgcolor" @on-active-change="e => designValue.bgcolor = e" recommend />
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="底部固定" style="margin-bottom:10px">
            <i-switch v-model="designValue.fixed">
              <span slot="open">开</span>
              <span slot="close">关</span>
            </i-switch>
          </FormItem>
        </Col>
      </Row>
      <FormItem label="背景图片" style="margin-bottom:10px">
        <InputWithUpload  v-model="designValue.bgimg"/>
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
              <FormItem label="城市">
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
import editorMixins from '../../mixins/editorMixins'
import InputWithUpload from '../../common/InputWithUpload.vue'
import ImageItemEditor from '../../common/ImageItemEditor.vue'
import { applyDrag } from '../../../../utlis/dnd'
import DesignEditorImageUpload from '../../common/DesignEditorImageUpload.vue'
export default {
  name: 'TabbarEditor',
  mixins: [editorMixins],
  components: {
    DesignEditorImageUpload,
    Container,
    Draggable,
    InputWithUpload,
    ImageItemEditor
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
  created () {},
  methods: {
    uploadImageCallback (url) {
      let item = {
        imageurl: url,
        linktype: 0,
        linkurl: '',
        city: this.cityValues
      }
      this.designValue.items.push(item)
    },
    onImageEditorItemUpload (url, index) {
      this.designValue.items[index].imageurl = url
    },
    onDropItem (dropResult) {
      this.designValue.items = applyDrag(this.designValue.items, dropResult)
    }
  }
}
</script>
<style lang="less" scoped>

</style>
