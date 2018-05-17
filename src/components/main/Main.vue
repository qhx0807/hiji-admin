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
                    <div slot="top" class="logo-con" style="padding-top:18px">
                      <img v-show="!shrink"  src="../../images/logo.jpg" key="max-logo" />
                      <img v-show="shrink" src="../../images/mini.png" key="min-logo" style="height:25px"/>
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
                      <Breadcrumb>
                        <BreadcrumbItem to="">Home</BreadcrumbItem>
                        <BreadcrumbItem to="">系统设置</BreadcrumbItem>
                        <BreadcrumbItem>菜单管理</BreadcrumbItem>
                      </Breadcrumb>
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
            <Spin v-show="pageLoading" size="large" fix></Spin>
            <!-- <transition name="fade"> -->
              <router-view></router-view>
            <!-- </transition> -->
          </div>
        </div>
    </div>
</template>
<script>
import shrinkableMenu from '../main-components/shrinkable-menu/shrinkable-menu.vue'
import fullScreen from '../main-components/fullscreen/fullscreen.vue'
import lockScreen from '../main-components/lockscreen/lockscreen.vue'
import scrollBar from '../scroll-bar/vue-scroller-bars'
import serverApi from '../../axios'
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
      userName: '',
      isFullScreen: false,
      openedSubmenuArr: [],
      avatorPath: '',
      menuList: []
    }
  },
  computed: {
    menuTheme () {
      return 'dark'
    },
    mesCount () {
      return '0'
    },
    pageLoading () {
      return this.$store.getters.isLoading
    }
  },
  created () {
    this.userName = sessionStorage.username || ''
    this.getMenuList()
  },
  methods: {
    toggleClick () {
      this.shrink = !this.shrink
    },
    handleSubmenuChange () {},
    fullscreenChange () {},
    handleClickUserDropdown (e) {
      if (e === 'loginout') {
        this.$Modal.confirm({
          title: '提示',
          content: '<p>确认退出当前登录账号？</p>',
          onOk: () => {
            sessionStorage.clear()
            this.$router.replace({name: 'Login'})
          }
        })
      }
    },
    getMenuList () {
      serverApi('/menu/index', '',
        response => {
          if (response.data.code === 0) {
            this.menuList = response.data.data
          } else {
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          console.log(error)
        }
      )
    }
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
