<style lang="less">
@import './main.less';
</style>
<template>
    <div class="main" :class="{'main-hide-text': shrink}">
        <div class="sidebar-menu-con" :style="{width: shrink?'60px':'200px', overflow: shrink ? 'visible' : 'auto'}">
            <scroll-bar ref="scrollBar">
                <shrinkable-menu
                    :shrink="shrink"
                    @on-change="handleSubmenuChange"
                    :theme="menuTheme"
                    :open-names="openedSubmenuArr"
                    :menu-list="menuList">
                    <div slot="top" class="logo-con">
                        <img v-show="!shrink"  src="../../images/logo.jpg" key="max-logo" />
                        <img v-show="shrink" src="../../images/logo-min.jpg" key="min-logo" />
                    </div>
                </shrinkable-menu>
            </scroll-bar>
        </div>
        <div class="main-header-con" :style="{paddingLeft: shrink?'60px':'200px'}">
            <div class="main-header">
                <div class="navicon-con">
                    <Button :style="{transform: 'rotateZ(' + (this.shrink ? '-90' : '0') + 'deg)'}" type="text" @click="toggleClick">
                        <Icon type="navicon" size="32"></Icon>
                    </Button>
                </div>
                <div class="header-middle-con">
                    <div class="main-breadcrumb">
                        <!-- <breadcrumb-nav :currentPath="currentPath"></breadcrumb-nav> -->
                    </div>
                </div>
                <div class="header-avator-con">
                    <full-screen v-model="isFullScreen" @on-change="fullscreenChange"></full-screen>
                    <lock-screen></lock-screen>
                    <div class="user-dropdown-menu-con">
                        <Row type="flex" justify="end" align="middle" class="user-dropdown-innercon">
                            <Dropdown transfer trigger="click" @on-click="handleClickUserDropdown">
                                <a href="javascript:void(0)">
                                    <span class="main-user-name">{{ userName }}</span>
                                    <Icon type="arrow-down-b"></Icon>
                                </a>
                                <DropdownMenu slot="list">
                                    <DropdownItem name="ownSpace">个人中心</DropdownItem>
                                    <DropdownItem name="loginout" divided>退出登录</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                            <Avatar :src="avatorPath" style="background: #619fe7;margin-left: 10px;"></Avatar>
                        </Row>
                    </div>
                </div>
            </div>
        </div>
        <div class="single-page-con" :style="{left: shrink?'60px':'200px'}">
          <div class="single-page">
            <router-view></router-view>
          </div>
        </div>
    </div>
</template>
<script>
import shrinkableMenu from '../main-components/shrinkable-menu/shrinkable-menu.vue'
import fullScreen from '../main-components/fullscreen/fullscreen.vue'
import lockScreen from '../main-components/lockscreen/lockscreen.vue'
// import Cookies from 'js-cookie'
import scrollBar from '../scroll-bar/vue-scroller-bars'

export default {
  components: {
    shrinkableMenu,
    fullScreen,
    lockScreen,
    // messageTip,
    // themeSwitch,
    scrollBar
  },
  data () {
    return {
      shrink: false,
      userName: 'admin',
      isFullScreen: false,
      openedSubmenuArr: [],
      avatorPath: ''
    }
  },
  computed: {
    menuList () {
      return [
        {
          children: [],
          name: '1',
          icon: 'folder',
          title: '一级菜单'
        },
        {
          children: [],
          name: '2',
          icon: 'folder',
          title: '一级菜单'
        }
      ]
    },
    menuTheme () {
      return 'dark'
    },
    mesCount () {
      return '0'
    }
  },
  methods: {
    toggleClick () {
      this.shrink = !this.shrink
    },
    handleSubmenuChange () {},
    fullscreenChange () {},
    handleClickUserDropdown () {}
  },
  watch: {},
  mounted () {
    // window.addEventListener('resize', this.scrollBarResize)
  },
  dispatch () {
    // window.removeEventListener('resize', this.scrollBarResize)
  }
}
</script>
