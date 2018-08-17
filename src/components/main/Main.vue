<style lang="less">
@import './main.less';
</style>
<template>
    <div class="main" :class="{'main-hide-text': shrink}">
        <div class="sidebar-menu-con" :style="{width: shrink?'60px':'200px', overflow: shrink ? 'visible' : 'auto', background: bgColor}">
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
        </div>
        <div class="main-header-con" :style="{paddingLeft: shrink?'60px':'200px'}">
            <div class="main-header">
                <div class="navicon-con">
                    <Button :style="{transform: 'rotateZ(' + (this.shrink ? '-90' : '0') + 'deg)'}" type="text" @click="toggleClick">
                        <Icon type="ios-menu" size="32"/>
                    </Button>
                </div>
                <div class="header-middle-con">
                    <div class="main-breadcrumb">
                      <Breadcrumb>
                        <BreadcrumbItem :style="{cursor: 'pointer'}" @click.native="onClickBread(item.to)" v-for="(item, index) in breadcrumbArr" :key="index">{{item.name}}</BreadcrumbItem>
                      </Breadcrumb>
                    </div>
                </div>
                <div class="header-avator-con">
                    <full-screen v-model="isFullScreen" @on-change="fullscreenChange"></full-screen>
                    <lock-screen></lock-screen>
                    <message-tip :value="messageNum"></message-tip>
                    <theme-switch></theme-switch>
                    <div class="user-dropdown-menu-con">
                        <Row type="flex" justify="end" align="middle" class="user-dropdown-innercon">
                            <Dropdown transfer trigger="click" @on-click="handleClickUserDropdown">
                                <a href="javascript:void(0)">
                                    <span class="main-user-name">{{ userName }}</span>
                                    <!-- <Icon type="arrow-down-b"></Icon> -->
                                    <!-- <Icon type="md-arrow-dropdown" /> -->
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
              <keep-alive :include="keepAliveName">
                <router-view></router-view>
              </keep-alive>
            <!-- </transition> -->
          </div>
        </div>
    </div>
</template>
<script>
import shrinkableMenu from '../main-components/shrinkable-menu/shrinkable-menu.vue'
import fullScreen from '../main-components/fullscreen/fullscreen.vue'
import lockScreen from '../main-components/lockscreen/lockscreen.vue'
import themeSwitch from '../main-components/theme-switch/theme-switch.vue'
import messageTip from '../main-components/message-tip/message-tip.vue'
import serverApi from '../../axios'
import { formatJsonTree } from '../../utlis/tools.js'
import Cookies from 'js-cookie'
export default {
  components: {
    shrinkableMenu,
    fullScreen,
    lockScreen,
    messageTip,
    themeSwitch,
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
      menuTable: [],
      keepAliveName: [],
      // keepAliveName: []
      keepAliveName: ['UserMember','CouponItem', 'ShopOrders', 'FinaceTable']
    }
  },
  computed: {
    menuTheme () {
      return this.$store.state.menuTheme
    },
    mesCount () {
      return '0'
    },
    pageLoading () {
      return this.$store.getters.isLoading
    },
    breadcrumbArr () {
      return this.$store.getters.breadcrumList
    },
    bgColor () {
      return this.menuTheme === 'dark' ? '#495060' : '#fff'
    },
    messageNum () {
      return this.$store.state.messageNum
    }
  },
  created () {
    this.isLocking()
    this.userName = sessionStorage.username || ''
    this.getMenuList()
    this.activeName = this.$route.name
  },
  methods: {
    toggleClick () {
      this.shrink = !this.shrink
    },
    handleSubmenuChange (e) {
      let arr = []
      let obj = this.menuTable.find((item) => {
        return item.url === e
      })
      if (obj && obj.upname) {
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
            if (obj && obj.upname) {
              arr.push({name: obj.upname, to: ''})
              arr.push({name: obj.name, to: obj.url})
            } else {
              arr.push({name: obj.name, to: obj.url})
            }
            let a = obj.updid
            let b = []
            b.push(Number(a))
            this.openedSubmenuArr = b
            this.$store.commit('updateBread', arr)
          } else {
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          // console.log(error)
        }
      )
    },
    isLocking () {
      let lock = Cookies.get('locking')
      let token = sessionStorage.getItem('token')
      if (lock==1 && token) {
        this.$router.push({name: 'Lock'})
      }
    },
    onClickBread (to) {
      if (to == '/Main') {
        this.$router.push({name: 'Home'})
        let arr = []
        this.$store.commit('updateBread', arr)
        this.openedSubmenuArr = []
        this.activeName = ''
      }
    }
  }
}
</script>
