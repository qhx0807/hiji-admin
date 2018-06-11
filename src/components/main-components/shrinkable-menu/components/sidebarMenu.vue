<style lang="less">
@import '../styles/menu.less';
</style>

<template>
    <Menu ref="sideMenu" :active-name="activeName" :open-names="openNames" :theme="menuTheme" accordion width="auto" @on-select="changeMenu">
        <template v-for="item in menuList">
            <MenuItem v-if="item.child.length<1" :name="item.url" :key="'menuitem' + item.url">
                <Icon :type="item.icon || item.icon" :size="iconSize" :key="'menuicon' + item.id"></Icon>
                <span class="layout-text" :key="'title' + item.id">{{ item.name }}</span>
            </MenuItem>
            <Submenu v-if="item.child.length >= 1" :name="item.id" :key="item.id">
                <template slot="title">
                    <Icon :type="item.icon" :size="iconSize"></Icon>
                    <span class="layout-text">{{ item.name }}</span>
                </template>
                <template v-for="child in item.child">
                    <MenuItem :name="child.url" :key="'menuitem' + child.id">
                        <Icon :type="child.icon" :size="iconSize" :key="'icon' + child.id"></Icon>
                        <span class="layout-text" :key="'title' + child.id">{{ child.name }}</span>
                    </MenuItem>
                </template>
            </Submenu>
        </template>
    </Menu>
</template>

<script>
export default {
  name: 'sidebarMenu',
  props: {
    menuList: Array,
    iconSize: Number,
    menuTheme: {
      type: String,
      default: 'dark'
    },
    activeName: {
      type: String
    },
    openNames: {
      type: Array
    }
  },
  methods: {
    changeMenu (active) {
      this.$emit('on-change', active)
    }
  },
  updated () {
    this.$nextTick(() => {
      if (this.$refs.sideMenu) {
        this.$refs.sideMenu.updateOpened()
        this.$refs.sideMenu.updateActiveName()
      }
    })
  }
}
</script>
