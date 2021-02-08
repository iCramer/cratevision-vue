<template>
  <div class="image-editor">
    <div class="thumbnail-images">
      <div v-for="(img, index) in value" class="thumbnail-image">
        <data-image :fileName="img.name" />
        <app-button  class="delete-btn" btnStyle="link" size="sm" @click="deleteImg(img.id)" icon="times-circle"></app-button>
      </div>
    </div>
    <file-uploader v-model="newImages" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import DataImage from './data-image.vue';
import FileUploader from './file-uploader.vue';
import AppButton from './button.vue';
import { IMedia } from '@/interfaces';
import api from '@/api';

@Component({
  components: { DataImage, AppButton, FileUploader }
})
export default class ImageEditor extends Vue {
  @Prop({default: () => []}) value: IMedia[];
  newImages: IMedia[] = [];
  imgCollection: IMedia[] = [];

  @Watch('newImages')
  updateImages() {
    let collection = [...this.newImages, ...this.value];
    this.imgCollection = [...new Set([...collection])];
    this.emitEvent();
  }

  deleteImg(id) {
    let index = this.imgCollection.findIndex(x => x.id === id);
    this.imgCollection.splice(index, 1);
    this.emitEvent();
  }

  emitEvent() {
    this.$emit('input', this.imgCollection);
  }
}
</script>
