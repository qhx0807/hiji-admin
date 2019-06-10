<template>
  <DesignEditor>
    <Form :label-width="80">
      <FormItem label="选择模板" style="margin-bottom:10px">
        <div class="select-templ-box">
          <div class="templ-item" @click="onSelectTemplate(item.value)" :class="{'active': designValue.template === item.value}" v-for="(item, index) in templItems" :key="index">
            <img :src="item.imgurl" alt="">
            <p>{{item.name}}</p>
          </div>
        </div>
      </FormItem>
      <FormItem label="页面边距" style="margin-bottom:10px">
        <Slider v-model="designValue.padding" show-input input-size="small"></Slider>
      </FormItem>
      <FormItem label="图片间距" style="margin-bottom:10px">
        <Slider v-model="designValue.spacing" show-input input-size="small"></Slider>
      </FormItem>
      <FormItem label="图片宽度(%)" style="margin-bottom:10px" v-show="designValue.template === 3">
        <Slider v-model="designValue.width" show-input input-size="small"></Slider>
      </FormItem>
    </Form>
    <div class="design-imagead-editor-items">
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
                <Select size="small" v-model="item.city">
                  <Option v-for="item in citylist" :key="item.value" :value="item.value">{{item.name}}</Option>
                </Select>
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
import ImageItemEditor from '../../common/ImageItemEditor.vue'
import editorMixins from '../../mixins/editorMixins'
import { applyDrag } from '../../../../utlis/dnd'
export default {
  name: 'LineEditor',
  mixins: [editorMixins],
  components: {
    DesignEditorImageUpload,
    Container,
    Draggable,
    ImageItemEditor
  },
  data () {
    return {
      templItems: [
        {
          name: '一行一个',
          imgurl: 'http://cdn.cqyyy.cn/pic/20190610102946.png',
          value: 1
        },
        {
          name: '一行两个',
          imgurl: 'http://cdn.cqyyy.cn/pic/20190610113851.png',
          value: 2
        },
        {
          name: '横向滑动',
          imgurl: 'http://cdn.cqyyy.cn/pic/20190610102947.png',
          value: 3
        }
      ]
    }
  },
  created () {},
  computed: {
    citylist () {
      return this.$store.state.cityList
    },
    linkTypeList () {
      return this.$store.state.actionTypeArr
    }
  },
  methods: {
    onSelectTemplate (e) {
      this.designValue.template = e
    },
    uploadImageCallback (url) {
      let item = {
        imageurl: url,
        linktype: 0,
        linkurl: '',
        city: 0
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
.select-templ-box{
  display: flex;
  flex-direction: row;
  .templ-item{
    box-sizing: border-box;
    height: 74px;
    width: 74px;
    background-color: #fff;
    margin-right: 15px;
    cursor: pointer;
    text-align: center;
    display: flex;
    justify-items: center;
    align-items: center;
    flex-direction: column;
    border: 1px solid #fff;
    &.active{
      border: 1px solid #6CA9FC;
    }
    img{
      width: 64px;
    }
    p{
      font-size: 12px;
      color: #444;
    }
  }
}
.design-imagead-editor-items{
  padding-top: 10px;
}
</style>
