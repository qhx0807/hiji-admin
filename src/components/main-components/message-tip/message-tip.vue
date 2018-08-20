<template>
    <div @click="showMessage" class="message-con">
        <Tooltip :content="value > 0 ? '有' + value + '条未读消息' : '无未读消息'" placement="bottom">
            <Badge :count="value" dot>
                <Icon type="md-notifications-outline" :size="23"></Icon>
                <!-- <Icon type="md-notifications-outline" /> -->
            </Badge>
        </Tooltip>
    </div>
</template>

<script>
export default {
  name: 'messageTip',
  props: {
    value: {
      type: Number,
      default: 0
    }
  },
  methods: {
    showMessage () {
      // this.$Message.info("")
    }
  }
}
</script>
