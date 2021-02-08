<template>
  <img v-if="imageURL" :src="`${imageURL}`" :alt="alt" :class="className" />
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import axios from 'axios';


@Component
export default class DataImage extends Vue {
  @Prop() fileName: string;
  @Prop() className: string;
  @Prop() alt: string;
  imgType: string = 'png';
  imageURL: string = null;

  created() {
    this.getImage();
  }

  @Watch('fileName')
  onFileChange() {
    this.getImage();
  }

  getImage() {
    axios({
      url: 'http://api.bundlevo.com/media/' + this.fileName,
      method: 'GET',
      responseType: 'blob',
      headers: {
        'Authorization': sessionStorage.getItem('jwt')
      }
    }).then( resp => {
      this.imageURL = URL.createObjectURL(resp.data);
    });
  }

}
</script>
