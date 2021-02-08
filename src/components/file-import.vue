<template>
  <div class="file-import">
    <input type="file" :multiple="false" @change="onChange" accept="*" class="input-file">
    <app-button icon="cloud-upload">
      Import Items
    </app-button>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { NoResults, AppButton, ButtonGroup } from '@/components';
import ProgressBar from './progress-bar.vue';
import api from '@/api';

@Component({
  components: { NoResults, AppButton, ButtonGroup, ProgressBar }
})
export default class FileImport extends Vue {
  file: any;
  onChange(evt: any) {
    this.file = evt.target.files[0];
    this.upload();
  }

  getLabel(file) {
    if (file.status === 'complete') {
      return 'Complete';
    }
    else if (file.status === 'failed') {
      return 'Failed';
    }
    else {
      return file.status + '%';
    }
  }

  upload() {
    let file = this.file;
    if(file.status !== 'complete') {
      let fd = new FormData();
      fd.append('file', file);
      fd.append('name', file.name);
      console.log(file)
      api.put('productitem/import', fd, {
        onUploadProgress: uploadEvt => {
          file.status = Math.round(uploadEvt.loaded / uploadEvt.total * 100);
        }
      }).then(resp => {
        console.log(resp)
        file.status = 'complete';
        // this.$emit('input', this.uploadedFiles);
      }).catch( error => {
        file.status = 'failed';
      });
    }
  }
}
</script>
