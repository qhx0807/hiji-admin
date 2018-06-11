<template>
    <div style="display:inline-block;padding:0 6px;">
        <Dropdown trigger="click" @on-click="setTheme">
            <a href="javascript:void(0)">
                <Icon :style="{marginTop: '-2px', verticalAlign: 'middle'}" color="#495060" :size="18" type="paintbucket"></Icon>
                <Icon type="arrow-down-b"></Icon>
            </a>
            <DropdownMenu slot="list">
                <DropdownItem v-for="(item, index) in themeList" :key="index" :name="item.name">
                    <Row type="flex" justify="center" align="middle">
                        <span style="margin-right:10px;"><Icon :size="20" :type="item.name.substr(0, 1) !== 'b' ? 'happy-outline' : 'happy'" :color="item.menu"/></span>
                        <span><Icon :size="22" type="record" :color="item.element"/></span>
                    </Row>
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
    </div>
</template>

<script>
import Cookies from 'js-cookie'
import config from '../../../../build/config.js'
export default {
  name: 'themeSwitch',
  data() {
    return {
      themeList: [
        {
          name: 'black_b',
          menu: '#495060',
          element: '#2d8cf0'
        },
        {
          name: 'black_g',
          menu: '#495060',
          element: '#00a854'
        },
        {
          name: 'black_y',
          menu: '#495060',
          element: '#e96500'
        },
        {
          name: 'black_r',
          menu: '#495060',
          element: '#e43e31'
        },
        {
          name: 'light_b',
          menu: '#495060',
          element: '#2d8cf0'
        },
        {
          name: 'light_g',
          menu: '#495060',
          element: '#00a854'
        },
        {
          name: 'light_y',
          menu: '#495060',
          element: '#e96500'
        },
        {
          name: 'light_r',
          menu: '#495060',
          element: '#e43e31'
        }
      ]
    }
  },
  created () {
    if (localStorage.theme && process.env.NODE_ENV != 'development') {
      this.addCssLink(localStorage.theme)
    }
  },
  methods: {
    setTheme (themeFile) {
      if (process.env.NODE_ENV === 'development') {
        this.$Message.warning('更换主题功能在开发环境下不可用！')
        return
      }
      let menuTheme = themeFile.split('_')[0]
      let mainTheme = themeFile.split('_')[1]
      if (menuTheme === 'black') {
        this.$store.commit('changeMenuTheme', 'dark')
        menuTheme = 'dark'
      } else {
        this.$store.commit('changeMenuTheme', 'light')
        menuTheme = 'light'
      }
      if (mainTheme === 'b') {
        localStorage.removeItem('theme')
        let th = document.querySelectorAll('link[name="theme"]')
        th.forEach(item => {
          item.parentNode.removeChild(item)
        })
      } else {
        let path = './theme/' + mainTheme + '.css'
        localStorage.setItem('theme', path)
        this.addCssLink(path)
      }

    },
    addCssLink (url) {
      let link = document.createElement('link')
      link.setAttribute('rel', 'stylesheet')
      link.setAttribute('type', 'text/css')
      link.setAttribute('name', 'theme')
      link.setAttribute('href', url)
      let heads = document.getElementsByTagName("head")
        if(heads.length)
          heads[0].appendChild(link)
        else
          doc.documentElement.appendChild(link)
    }
  }
}
</script>
