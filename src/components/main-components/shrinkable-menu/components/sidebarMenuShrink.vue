<template>
    <div>
        <template v-for="(item, index) in menuList">
            <div style="text-align: center;" :key="index">
                <Dropdown transfer v-if="item.child.length !== 0" placement="right-start" :key="index" @on-click="changeMenu(item.url, item.name)">
                    <Button style="width: 70px;margin-left: -5px;padding:10px 0;" type="text">
                        <Icon :size="20" :color="iconColor" :type="item.icon"></Icon>
                    </Button>
                    <DropdownMenu style="width: 200px;" slot="list">
                        <template v-for="(child, i) in item.child">
                            <DropdownItem :name="child.url" :key="i"><Icon :type="child.icon"></Icon><span style="padding-left:10px;">{{ child.name }}</span></DropdownItem>
                        </template>
                    </DropdownMenu>
                </Dropdown>
                <Dropdown transfer v-else placement="right-start" :key="index" @on-click="changeMenu(item.url, item.name)">
                    <Button @click="changeMenu(item.url, item.name)" style="width: 70px;margin-left: -5px;padding:10px 0;" type="text">
                        <Icon :size="20" :color="iconColor" :type="item.icon || item.icon"></Icon>
                    </Button>
                    <DropdownMenu style="width: 200px;" slot="list">
                        <DropdownItem :name="item.url" :key="'d' + index"><Icon :type="item.icon || item.icon"></Icon><span style="padding-left:10px;">{{ item.name }}</span></DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
        </template>
    </div>
</template>

<script>
export default {
  name: 'sidebarMenuShrink',
  props: {
    menuList: {
      type: Array
    },
    iconColor: {
      type: String,
      default: 'white'
    },
    menuTheme: {
      type: String,
      default: 'darck'
    }
  },
  methods: {
    changeMenu (url, name) {
      this.$emit('on-change', url, name)
    },
    itemTitle (item) {
      if (typeof item.title === 'object') {
        return this.$t(item.title.i18n)
      } else {
        return item.title
      }
    }
  }
}
</script>
