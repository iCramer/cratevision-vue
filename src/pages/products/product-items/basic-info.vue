<template>
  <div>
    <error-banner v-model="errorList" />
    <data-image v-if="item.picture && item.picture.name" :fileName="item.picture.name" />
    <list-group title="Basic Info" :showBtn="true" @util-click="openModal">
      <list-group-item icon="address-card">
        Name<span>{{item.name}}</span>
      </list-group-item>
      <list-group-item icon="hand-holding-usd">
        Item Cost<badge>{{item.itemCost | currency}}</badge>
      </list-group-item>
      <list-group-item :icon="['far', 'box-usd']">
        Case Cost<badge>{{item.caseCost | currency}}</badge>
      </list-group-item>
      <list-group-item :icon="['far', 'tally']">
        Items per Case<badge>{{item.caseQty}}</badge>
      </list-group-item>
      <list-group-item :icon="['far', 'comment-alt-lines']" :justifyContent="false">
        Description<p>{{item.description}}</p>
      </list-group-item>
    </list-group>

    <modal title="Edit Basic Info" :open="showModal">
      <validation-observer ref="form">
        <form @submit.prevent="submitForm" novalidate>
          <basic-info-form v-model="editItem"></basic-info-form>
          <div class="modal-buttons">
            <app-button :linkBtn="true" @click="closeModal">Cancel</app-button>
            <app-button btnType="submit">Save</app-button>
          </div>
        </form>
      </validation-observer>
    </modal>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { ListGroup, ListGroupItem, Badge, Modal, InputField, AppButton, ErrorBanner, DataImage } from '@/components';
import BasicInfoForm from './basic-info-form.vue';
import api from '@/api';
import deepCopy from '@/utils';
import { IProductItem, VForm } from '@/interfaces';
import { ValidationObserver } from 'vee-validate';

@Component({
  components: {
    ListGroup,
    ListGroupItem,
    Badge,
    InputField,
    Modal,
    AppButton,
    BasicInfoForm,
    ValidationObserver,
    ErrorBanner,
    DataImage
  }
})
export default class BasicInfo extends Vue {
  @Prop({default: {}}) item: IProductItem;
  editItem: IProductItem = {};
  showModal = false;
  errorList: string[] = [];

  closeModal() {
    this.showModal = false;
    this.editItem = {};
  }

  openModal() {
    this.editItem = deepCopy(this.item);
    this.showModal = true;
  }

  submitForm() {
    (this.$refs.form as VForm).validate().then( valid => {
      if(valid) {
        api.put('productitem/' + this.item.id, this.editItem).then( () => {
          this.$toast.success('Product item updated');
        })
        .catch(error => {
          this.errorList.push(error.response.data.message);
        });

        this.closeModal();
      }
    });
  }
}

</script>
