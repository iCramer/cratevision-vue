<template>
  <div class="image-gallery">
    <div class="thumbnail-images">
      <button
        type="button"
        v-for="(img, index) in images"
        @click="changeImage(index)"
        :class="['thumbnail-image', {'active': index === activeIndex}]"
      >
        <data-image :fileName="img.name" />
      </button>
    </div>
    <div class="main-image">
      <data-image v-for="(img, index) in images" :fileName="img['name']" v-show="index === activeIndex" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import DataImage from './data-image.vue';
import { IMedia } from '@/interfaces';

@Component({
  components: { DataImage }
})
export default class ImageGallery extends Vue {
  @Prop({default: () => []}) images: IMedia[];
  activeIndex = 0;
  prevIndex = 0;

  changeImage(index) {
    this.prevIndex = this.activeIndex;
    this.activeIndex = index;
  }

}
</script>
