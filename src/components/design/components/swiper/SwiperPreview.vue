<template>
  <div class="design-swiper-preview" :style="{}">
    <div class="design-swiper-preview-nodata" v-show="value.items.length === 0">点击编辑轮播广告</div>
    <Carousel loop autoplay radius-dot arrow="never" v-if="value.items.length > 0">
      <CarouselItem v-for="(item, index) in value.items" :key="index" >
          <div class="design-swiper-carousel" v-if="item.imageurl">
            <img :src="item.imageurl" alt="">
          </div>
      </CarouselItem>
    </Carousel>
    <slot></slot>
  </div>
</template>
<script>
import previewMixins from '../../mixins/previewMixins'
export default {
  name: 'SwiperPreview',
  mixins: [previewMixins]
}
</script>
<style lang="less" scoped>
  .design-swiper-preview{
    position: relative;
    cursor: grab;
    height: 120px;
    &-nodata{
      height: 120px;
      line-height: 120px;
      text-align: center;
      background: #bdf;
      color: #fff;
      font-size: 14px;
    }
    .design-swiper-carousel{
      height: 120px;
      width: 100%;
      img{
        height: 100%;
        width: 100%;
      }
    }
  }
</style>
