<template>
  <DesignEditor :desc="desc">
    <Form :label-width="80">
      <FormItem label="选择模板" style="margin-bottom:10px">
        <div class="select-templ-box">
          <div class="templ-item" @click="onSelectTemplate(item)" :class="{'active': designValue.template === item.value}" v-for="(item, index) in templItems" :key="index">
            <img :src="item.imgurl" alt="">
            <p>{{item.name}}</p>
          </div>
        </div>
      </FormItem>
      <!-- <FormItem label="图片间隙" style="margin-bottom:10px">
        <Slider v-model="designValue.spacing" show-input input-size="small"></Slider>
      </FormItem> -->

      <FormItem label="城市">
        <CheckboxGroup v-model="value.city">
          <Checkbox v-for="item in citylist" :key="item.value" :label="item.value">{{item.name}}</Checkbox>
        </CheckboxGroup>
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
            </Form>
          </ImageItemEditor>
        </Draggable>
      </Container>
    </div>
  </DesignEditor>
</template>
<script>
import { Container, Draggable } from "vue-smooth-dnd"
import ImageItemEditor from '../../common/ImageItemEditor.vue'
import { applyDrag } from '../../../../utlis/dnd'
import editorMixins from '../../mixins/editorMixins'
export default {
  name: 'MagicBoxEditor',
  mixins: [editorMixins],
  components: {
    Container,
    Draggable,
    ImageItemEditor
  },
  data () {
    return {
      templItems: [
        {
          name: '1行2个',
          imgurl: 'http://cdn.cqyyy.cn/pic/20190610140355.png',
          value: 1,
          num: 2
        },
        {
          name: '1行3个',
          imgurl: 'http://cdn.cqyyy.cn/pic/20190610140422.png',
          value: 2,
          num: 3
        },
        {
          name: '1行4个',
          imgurl: 'http://cdn.cqyyy.cn/pic/20190610140433.png',
          value: 3,
          num: 4
        },
        {
          name: '2左2右',
          imgurl: 'http://cdn.cqyyy.cn/pic/20190610140451.png',
          value: 4,
          num: 4
        },
        {
          name: '1左2右',
          imgurl: 'http://cdn.cqyyy.cn/pic/20190610140508.png',
          value: 5,
          num: 3
        },
        {
          name: '1左3右',
          imgurl: 'http://cdn.cqyyy.cn/pic/20190610140602.png',
          value: 6,
          num: 4
        },
        // {
        //   name: '自定义',
        //   imgurl: 'http://cdn.cqyyy.cn/pic/20190610140713.png',
        //   value: 7,
        //   num: 16
        // }
      ]
    }
  },
  computed: {
    citylist () {
      return this.$store.state.cityList
    },
    linkTypeList () {
      return this.$store.state.actionTypeArr
    }
  },
  created () {
    // this.designValue.items = [
    //   {
    //     imageurl: 'http://cdn.cqyyy.cn/pic/20190610151400.png',
    //     linktype: 0,
    //     linkurl: '',
    //     city: 0
    //   },
    //   {
    //     imageurl: 'http://cdn.cqyyy.cn/pic/20190610151400.png',
    //     linktype: 0,
    //     linkurl: '',
    //     city: 0
    //   }
    // ]
  },
  methods: {
    onSelectTemplate (e) {
      if (e.value === 7) {
        this.$Message.info('暂未开放')
        return false
      }
      if (this.designValue.items.length < e.num) {
        while (this.designValue.items.length < e.num) {
          this.designValue.items.push({
            imageurl: 'http://cdn.cqyyy.cn/pic/20190610151400.png',
            linktype: 0,
            linkurl: '',
            isshow: true,
            city: this.cityValues
          })
        }
      } else {
        this.designValue.items.length = e.num
      }
      this.designValue.template = e.value
    },
    onImageEditorItemUpload (url, index) {
      this.designValue.items[index].imageurl = url
    },
    onDropItem (dropResult) {
      this.designValue.items = applyDrag(this.designValue.items, dropResult)
    },
    onRemoveImgItem (index) {
      this.designValue.items.splice(index, 1)
    }
  }
}
</script>
<style lang="less" scoped>
.select-templ-box{
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
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
    margin-bottom: 10px;
    &.active{
      border: 1px solid #6CA9FC;
    }
    img{
      width: 64px;
    }
    p{
      font-size: 12px;
      color: #333;
    }
  }
}
</style>
