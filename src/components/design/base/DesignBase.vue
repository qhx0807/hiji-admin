<template>
  <div class="design">
    <div class="design-preview">
      <div class="design-preview-wrap" :style="{backgroundColor: value[0].bgcolor}">
        <draggable
          class="list-group"
          tag="ul"
          v-model="designList"
          v-bind="dragOptions"
          @start="drag = true"
          @end="drag = false"
          handle=".design-preview-controller"
        >
          <transition-group type="transition" name="flip-list">
            <li class="list-group-item" v-for="(element, index) in designList" :key="element.type">
              <renderPreview
                @onSelectDesigner="onSelectDesigner(index)"
                :value="element"
                :designComponents="designComponents"
                :isactive="index == activeIndex"
                @onRemoveDesigner="onRemoveDesigner"
                @onClickInsertComponents="onClickInsertComponents"
              >
              </renderPreview>
            </li>
          </transition-group>
        </draggable>
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

      <div class="design-preview-add fixed">
        <div class="design-preview-add-grouped" v-for="(item, index) in groupedComponents" :key="index">
          <p class="title">{{item.name}}</p>
          <div class="group-list" >
            <section class="group-list-item" v-for="(btn, id) in item.components">
              <span @click="onClickAddBtn(btn)">{{btn.name}}</span>
            </section>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
<script>
import draggable from 'vuedraggable'
import renderPreview from './renderPreview'
export default {
  name: 'DesignBase',
  components: {
    draggable,
    renderPreview
  },
  props: {
    value: {
      type: Array,
      default: []
    },
    groupedComponents: Array,
    designComponents: Array
  },
  data () {
    return {
      drag: false,
      designList: [],
      dragOptions: {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost",
        filter: ''
      },
      activeIndex: -1
    }
  },
  computed: {
  },
  created () {
    console.log(this.groupedComponents)
    this.designList = this.value
  },
  methods: {
    onClickAddBtn (type) {
      let designer = this.designComponents.find(item => {
        return item.designType === type.selector
      })
      this.activeIndex = this.value.length
      this.$emit('onAddComponent', {type: type.selector, ...designer.defaultValue})
    },
    onSelectDesigner (index) {
      this.activeIndex = index
    },
    onRemoveDesigner () {
      console.log('del')
    },
    onClickInsertComponents () {
      console.log('onClickInsertComponents')
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
          margin-top: 13px;
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
.flip-list-move {
  transition: transform 0.5s;
}

.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
.list-group {
  min-height: 20px;
}
.list-group-item {
  list-style: none;
}
</style>
