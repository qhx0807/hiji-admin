<style lang="less">
@import './main.less';
</style>
<template>
    <div class="main" :class="{'main-hide-text': shrink}">
        <div class="sidebar-menu-con" :style="{width: shrink?'60px':'200px', overflow: shrink ? 'visible' : 'auto'}">
            <scroll-bar ref="scrollBarRef">
                <shrinkable-menu
                    :shrink="shrink"
                    @on-change="handleSubmenuChange"
                    :theme="menuTheme"
                    :active-name="activeName"
                    :open-names="openedSubmenuArr"
                    :menu-list="menuList">
                    <div slot="top" class="logo-con" style="padding-top:18px">
                      <!-- <img v-show="!shrink"  src="../../images/logo.jpg" key="max-logo" /> -->
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
                        <BreadcrumbItem v-for="(item, index) in breadcrumbArr" :key="index" :to="item.to">{{item.name}}</BreadcrumbItem>
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
                            <Avatar style="background: #619fe7;margin-left: 10px;text-align:center" icon="person"></Avatar>
                        </Row>
                    </div>
                </div>
            </div>
        </div>
        <div class="single-page-con" :style="{left: shrink ? '60px':'200px'}">
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
import { formatJsonTree } from '../../utlis/tools.js'
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
      activeName: '',
      menuList: [],
      menuTable: []
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
    },
    breadcrumbArr () {
      return this.$store.getters.breadcrumList
    }
  },
  created () {
    this.userName = sessionStorage.username || ''
    this.getMenuList()
    this.activeName = this.$route.name
  },
  methods: {
    toggleClick () {
      this.shrink = !this.shrink
    },
    scrollBarResize () {
      this.$refs.scrollBarRef.resize()
    },
    handleSubmenuChange (e) {
      let arr = []
      let obj = this.menuTable.find((item) => {
        return item.url === e
      })
      if (obj.upname) {
        arr.push({name: obj.upname, to: ''})
        arr.push({name: obj.name, to: obj.url})
      } else {
        arr.push({name: obj.name, to: obj.url})
      }
      this.$store.commit('updateBread', arr)
    },
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
      let userid = sessionStorage.userid
      serverApi('/menu/index', {userid: userid},
        response => {
          // console.log(response)
          if (response.data.code === 0) {
            this.menuList = response.data.data
            this.menuTable = formatJsonTree(response.data.data, 'child')
            let n = this.$route.name

            let arr = []
            let obj = this.menuTable.find((item) => {
              return item.url === n
            })
            if (obj.upname) {
              arr.push({name: obj.upname, to: ''})
              arr.push({name: obj.name, to: obj.url})
            } else {
              arr.push({name: obj.name, to: obj.url})
            }
            let a = obj.updid
            // this.openedSubmenuArr =
            let b = []
            b.push(a)
            this.openedSubmenuArr = b
            this.$store.commit('updateBread', arr)

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
  watch: { },
  mounted () {
    window.addEventListener('resize', this.scrollBarResize)
  },
  dispatch () {
    window.removeEventListener('resize', this.scrollBarResize)
  }
}
</script>
