<template>
  <div class="file-uploader">
    <div class="file-dropzone">
      <input type="file" :multiple="multiple" @change="onChange" accept="image/*" class="input-file">
      <no-results body="Drag your files here or click to browse" :icon="['far', 'images']"></no-results>
    </div>
    <ul class="file-uploader-list" v-if="fileList.length">
      <li v-for="file in fileList">
        <span class="file-name">{{file.file.name}}</span>
        <app-button :linkBtn="true" size="xs" @click="removeFile(file)"><font-awesome-icon icon="times-circle" /></app-button>
        <progress-bar v-if="file.status !== 'queued'" :value="file.status" :label="getLabel(file)" :progressStyle="getStyle(file)" />
      </li>
    </ul>
    <button-group align="center" v-if="fileList.length">
      <app-button @click="upload" icon="cloud-upload">Upload</app-button>
    </button-group>
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
export default class FileUploader extends Vue {
  @Prop({default: true}) multiple: boolean;
  fileList: any[] = [];
  uploadedFiles: any[] = [];

  onChange(evt: any) {
    let files = evt.target.files;
    for (let i = 0; i < files.length; i++) {
      this.fileList.push({
        status: 'queued',
        file: files[i]
      });
    };
  }

  getStyle(file) {
    if (file.status === 'complete') {
      return 'success';
    }
    else if (file.status === 'failed') {
      return 'danger';
    }

    return null;
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

  removeFile(file) {
    this.fileList = this.fileList.filter( item => item !== file );
    this.uploadedFiles = this.uploadedFiles.filter( item => item!== file );
  }

  upload() {
    this.fileList.forEach(file => {
      if(file.status !== 'complete') {
        let fd = new FormData();
        fd.append('file', file.file);
        fd.append('name', file.file.name);
        api.post('media/upload', fd, {
          onUploadProgress: uploadEvt => {
            file.status = Math.round(uploadEvt.loaded / uploadEvt.total * 100);
          }
        }).then(resp => {
          file.status = 'complete';
          this.uploadedFiles.push({ id: resp.data.id, name: resp.data.name });
          this.$emit('input', this.uploadedFiles);
        }).catch( error => {
          file.status = 'failed';
        });
      }
    });
  }
}
</script>
