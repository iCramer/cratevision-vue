<template>
  <div>
    <title-bar title="User Settings"></title-bar>
    <div class="container-fluid">
      <error-banner v-model="errorList" />
      <div class="row">
        <div class="col-md-4">
          <panel title="User Info">
            <list-group :iconList="true" v-if="user" title="Basic Info" :showBtn="true" @util-click="openInfoModal">
              <list-group-item icon="address-card">
                Name <span>{{user.firstName}} {{user.lastName}}</span>
              </list-group-item>
              <list-group-item icon="mailbox">
                Email <span>{{user.username}}</span>
              </list-group-item>
              <list-group-item icon="user-lock">
                Password <span>******</span>
              </list-group-item>
            </list-group>
            <section-title :showBtn="true" @util-click="openImageModal">Picture</section-title>
            <no-results v-if="!user.picture" header="No User Picture" btnLabel="Add Picture" :icon="['far', 'images']" @button-click="openImageModal"></no-results>
            <data-image v-else :fileName="user.picture.name" />
          </panel>
          </div>
      </div>
    </div>
    <modal title="Images" :open="showImageModal">
      <form @submit.prevent="submitImages">
        <file-uploader v-model="userEdit.picture" />
        <button-group>
          <app-button :linkBtn="true" @click="closeImageModal">Cancel</app-button>
          <app-button btnType="submit">Save</app-button>
        </button-group>
      </form>
    </modal>
    <modal title="Images" :open="showInfoModal">
      <validation-observer ref="infoForm">
        <form @submit.prevent="submitInfo">
          <div class="row">
            <div class="col-md-6">
              <input-validate v-model="userEdit.firstName" rules="required" label="First Name" />
            </div>
            <div class="col-md-6">
              <input-validate v-model="userEdit.lastName" rules="required" label="Last Name" />
            </div>
            <div class="col-md-6">
              <input-validate v-model="userEdit.username" rules="required" label="Email" />
            </div>
          </div>
          <button-group>
            <app-button btnStyle="info-link" @click="closeInfoModal">Cancel</app-button>
            <app-button btnType="submit">Save</app-button>
          </button-group>
        </form>
      </validation-observer>
    </modal>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { TitleBar, Panel, ListGroup, ListGroupItem, FileUploader, SectionTitle, NoResults, ErrorBanner, Modal, AppButton, ButtonGroup, DataImage, InputValidate } from '@/components';
import { IUser, VForm } from '@/interfaces';
import { ValidationObserver } from 'vee-validate';
import api from '@/api';
import deepCopy from '@/utils';

@Component({
  components: {
    TitleBar,
    Panel,
    ListGroup,
    ListGroupItem,
    FileUploader,
    SectionTitle,
    NoResults,
    ErrorBanner,
    Modal,
    AppButton,
    ButtonGroup,
    DataImage,
    InputValidate,
    ValidationObserver
  }
})
export default class UserSettings extends Vue {
  user: IUser = {};
  userEdit: IUser = {};
  errorList: string[] = [];
  showImageModal = false;
  showInfoModal = false;

  created() {
    this.getUserInfo();
  }

  getUserInfo() {
    api.get('user/').then( resp => {
      this.user = resp.data;
    }).catch( error => {
      this.errorList.push(error.response.data.message);
    });
  }

  openImageModal() {
    this.showImageModal = true;
  }

  openInfoModal() {
    this.userEdit = deepCopy(this.user);
    this.showInfoModal = true;
  }

  closeImageModal() {
    this.showImageModal = false;
  }

  closeInfoModal() {
    this.showInfoModal = false;
  }

  submitImages() {
    let body = { id: this.user.id, picture: this.userEdit.picture[0] };
    this.submitForm(body);
    this.closeImageModal();
  }

  submitInfo() {
    (this.$refs.infoForm as VForm).validate().then( valid => {
      if (valid) {
        if(!this.userEdit.password) {
          delete this.userEdit.password;
        }
        let body = this.userEdit;
        this.submitForm(body);
        this.closeInfoModal();
      }
    });
  }

  submitForm(body) {
    api.put('user/', body).then( resp => {
      this.user = resp.data;
      this.getUserInfo();
      this.$toast.success('User Updated');
    }).catch( error => {
      this.errorList.push(error.response.data.message);
    });
  }
}
</script>
