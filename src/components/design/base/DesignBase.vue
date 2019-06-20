<template>
  <div class="design">
    <div class="design-preview">
      <div class="design-preview-wrap" :style="{backgroundColor: configValue.bgcolor, backgroundImage:'url('+configValue.bgimg+')'}">
        <Container @drop="onDropItem" drag-handle-selector=".design-preview-controller">
          <Draggable v-for="(element, index) in designList" :key="element.type">
            <section class="list-group-item">
              <renderPreview
                @onSelectDesigner="onSelectDesigner(index)"
                :value="element"
                :designComponents="designComponents"
                :isactive="index == activeIndex"
                @onRemoveDesigner="onRemoveDesigner(index)"
                @onClickInsertComponents="(evt, position) => onClickInsertComponents(evt, position, index)"
              >
              </renderPreview>
            </section>
          </Draggable>
        </Container>
      </div>

      <div class="design-preview-add">
        <div class="design-preview-add-grouped" v-for="(item, index) in groupedComponents" :key="index">
          <p class="title">{{item.name}}</p>
          <div class="group-list" >
            <section class="group-list-item" v-for="(btn, id) in item.components">
              <span @click="onClickAddBtn(btn)">{{btn.name}}</span>
            </section>
          </div>
        </div>
      </div>

      <div class="design-preview-add fixed" :style="{top: offsetTop+'px'}" v-show="addShow">
        <div class="design-preview-add-grouped" v-for="(item, index) in groupedComponents" :key="index">
          <p class="title">{{item.name}}</p>
          <div class="group-list" >
            <section class="group-list-item" v-for="(btn, id) in item.components">
              <span @click="onClickInsertBtn(btn)">{{btn.name}}</span>
            </section>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
<script>
import renderPreview from './renderPreview'
import { applyDrag } from '../../../utlis/dnd'
import { Container, Draggable } from "vue-smooth-dnd"
export default {
  name: 'DesignBase',
  components: {
    renderPreview,
    Container,
    Draggable
  },
  props: {
    value: {
      type: Array,
      default: () => []
    },
    groupedComponents: Array,
    designComponents: Array
  },
  data () {
    return {
      drag: false,
      addShow: false,
      designList: [],
      dragOptions: {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost",
        filter: ''
      },
      activeIndex: -1,
      offsetTop: 0,
      insertIndex: -1,
    }
  },
  watch: {
    // value (n, o) {
    //   console.log(n)
    // }
  },
  created () {
    this.designList = this.value
  },
  computed: {
    configValue () {
      return this.value.find(item => item.type === 'config')
    }
  },
  methods: {
    onClickAddBtn (type) {
      let PostImgArr = ['image-ad', 'magic-box', 'icon', 'swiper']
      if (type.selector === 'share') {
        let index = this.designList.findIndex(item => item.type === 'share')
        if (index > -1) {
          this.$Message.warning('页面分享功能已存在!')
          this.activeIndex = index
          return false
        }
      }
      if (type.selector === 'tabbar') {
        let index = this.designList.findIndex(item => item.type === 'tabbar')
        if (index > -1) {
          this.$Message.warning('标签栏已存在!')
          this.activeIndex = index
          return false
        }
      }
      let designer = this.designComponents.find(item => {
        return item.designType === type.selector
      })
      if (PostImgArr.includes(designer.designType)) {
        designer.defaultValue.items = []
      }
      if (designer.defaultValue.hasOwnProperty('items') && designer.defaultValue.hasOwnProperty('ids')) {
        designer.defaultValue.items = [].concat(designer.defaultValue.items)
      }
      this.activeIndex = this.value.length
      this.$emit('onAddComponent', {type: type.selector, ...designer.defaultValue}, this.value.length)
      this.addShow = false
    },
    onSelectDesigner (index) {
      this.addShow = false
      this.activeIndex = index
    },
    onRemoveDesigner (index) {
      this.$emit('onDeleteDesigner', index)
    },
    onClickInsertComponents (event, position, index) {
      this.offsetTop = event.clientY - 121
      this.addShow = true
      this.activeIndex = -1
      this.insertIndex = position === 'top' ? index : index + 1
    },
    onClickInsertBtn (type) {
      let designer = this.designComponents.find(item => {
        return item.designType === type.selector
      })
      if (designer.defaultValue.items) {
        designer.defaultValue.items = []
      }
      this.activeIndex = this.insertIndex
      this.$emit('onAddComponent', {type: type.selector, ...designer.defaultValue}, this.insertIndex)
      this.addShow = false
    },
    onDropItem (dropResult) {
      this.activeIndex = -1
      this.designList = applyDrag(this.designList, dropResult)
      this.$emit('input', this.designList)
    }
  }
}
</script>
<style lang="less" scoped>
.design{
  width: 800px;
  padding: 10px;
  &-preview{
    box-sizing: content-box;
    border: 1px solid #e5e5e5;
    width: 320px;
    min-height: 450px;
    position: relative;
    &-wrap{
      min-height: 350px;
      background-repeat: repeat-y;
      background-size: 100%;
      background-origin: border-box;
    }
    &-add{
      padding-bottom: 5px;
      position: relative;
      border-top: 1px solid #e5e5e5;
      min-height: 100px;
      width: 320px;
      &-grouped{
        padding: 0 5px 0 10px;
        .title{
          font-size: 12px;
          margin-bottom: 8px;
          margin-top: 6px;
        }
        .group-list{
          display: flex;
          flex-wrap: wrap;
          .group-list-item{
            display: inline-block;
            box-sizing: border-box;
            flex: 0 0 33.33%;
            height: 30px;
            margin-bottom: 5px;
            padding-right: 5px;
            span{
              border: 1px dashed #e5e5e5;
              color: #666;
              background: #f8f8f8;
              box-sizing: border-box;
              font-size: 12px;
              border-radius: 0;
              width: 100%;
              height: 100%;
              display: flex;
              justify-content: center;
              align-items: center;
              cursor: pointer;
              &:hover{
                background: #e8f7fd;
                border-color: #bdf;
                color: #38f;
              }
            }
          }
        }
      }
      &.fixed{
        position: absolute;
        min-height: 28px;
        background-color: #ffffff;
        border: 1px solid #e5e5e5;
        left: 340px;
        padding: 0 5px 10px 5px;
        top: 0;
        border-radius: 5px;
        z-index: 5;
        &::before{
          border: solid transparent;
          border-color: transparent #e5e5e5 transparent transparent;
          border-width: 7px;
          margin-top: -7px;
          content: " ";
          height: 0;
          width: 0;
          position: absolute;
          pointer-events: none;
          right: 100%;
          top: 20px;
        }
        &::after{
          border: solid transparent;
          border-color: transparent #ffffff transparent transparent;
          border-width: 6px;
          margin-top: -6px;
          content: " ";
          height: 0;
          width: 0;
          position: absolute;
          pointer-events: none;
          right: 100%;
          top: 20px;
        }
      }
    }
  }
}
.ghost{
  opacity: 0.5;
  background: #c8ebfb;
}
.list-group {
  min-height: 20px;
}
.smooth-dnd-container.vertical > .smooth-dnd-draggable-wrapper{
  overflow: visible!important;
}
</style>
