<style lang="less">
@import './styles/menu.less';
</style>

<template>
  <div :style="{background: bgColor}" class="ivu-shrinkable-menu">
    <slot name="top"></slot>
    <sidebar-menu
        v-show="!shrink"
        :menu-theme="theme"
        :menu-list="menuList"
        :open-names="openNames"
        @on-change="handleChange"
        :active-name="activeName"
    ></sidebar-menu>
    <sidebar-menu-shrink
        v-show="shrink"
        :menu-theme="theme"
        :menu-list="menuList"
        :icon-color="shrinkIconColor"
        @on-change="handleChange"
    ></sidebar-menu-shrink>
  </div>
</template>

<script>
import sidebarMenu from './components/sidebarMenu.vue'
import sidebarMenuShrink from './components/sidebarMenuShrink.vue'
export default {
  name: 'shrinkableMenu',
  components: {
    sidebarMenu,
    sidebarMenuShrink
  },
  props: {
    shrink: {
      type: Boolean,
      default: false
    },
    menuList: {
      type: Array,
      required: true
    },
    theme: {
      type: String,
      default: 'dark'
    },
    beforePush: {
      type: Function
    },
    openNames: {
      type: Array
    },
    activeName: {
      type: String
    }
  },
  computed: {
    bgColor () {
      return this.theme === 'dark' ? '#495060' : '#fff'
    },
    shrinkIconColor () {
      return this.theme === 'dark' ? '#fff' : '#495060'
    }
  },
  methods: {
    handleChange (url, name) {
      let willpush = true
      if (this.beforePush !== undefined) {
        if (!this.beforePush(url)) {
          willpush = false
        }
      }
      if (willpush) {
        this.$router.push({
          name: url
        })
      }
      this.$emit('on-change', url)
    }
  }
}
</script>
