<template>
  <div>
    <error-banner v-model="errorList" />
    <no-results v-if="inventory && !inventory.length" header="No Inventory Found" icon="inventory" @button-click="openModal" btnLabel="Create One" />
    <list-group v-for="(item, index) in inventory" :iconList="false" :key="index" :title="`Warehouse ${index + 1}`" :showBtn="true" @util-click="openModal(item)">
      <list-group-item>
        Warehouse<span>{{item.warehouse && item.warehouse.name}}</span>
      </list-group-item>
      <list-group-item>
        Available<badge>{{item.available || 0}}</badge>
      </list-group-item>
      <list-group-item>
        On Hand<badge>{{item.onhand || 0}}</badge>
      </list-group-item>
      <list-group-item>
        Reserved<badge>{{item.reserved || 0}}</badge>
      </list-group-item>
    </list-group>

    <app-button :linkBtn="true" size="xs" icon="plus-circle" @click="openModal()">Add Inventory</app-button>

    <modal title="Edit Inventory" :open="showModal">
      <form v-if="!editWarehouses" @submit.prevent="submitForm">
        <validation-observer ref="form">
          <inventory-form v-model="editItem" :showEdit="showEdit" @edit-click="editWarehouses = true" />
        </validation-observer>
        <div class="modal-buttons">
          <app-button :linkBtn="true" @click="closeModal">Cancel</app-button>
          <app-button btnType="submit">Save</app-button>
        </div>
      </form>
      <warehouse-editor v-else @back-click="editWarehouses = false" />
    </modal>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { ListGroup, ListGroupItem, Badge, Modal, InputField, AppButton, NoResults, ErrorBanner } from '@/components';
import InventoryForm from './inventory-form.vue';
import { WarehouseEditor } from '@/patterns';
import api from '@/api';
import deepCopy from '@/utils';
import { IInventory, VForm } from '@/interfaces';
import { ValidationObserver } from 'vee-validate';

@Component({
  components: {
    ListGroup,
    ListGroupItem,
    Badge,
    InputField,
    Modal,
    AppButton,
    InventoryForm,
    NoResults,
    ValidationObserver,
    ErrorBanner,
    WarehouseEditor
  }
})
export default class Inventory extends Vue {
  @Prop({default: () => []}) inventory: IInventory[];
  @Prop() id: number;
  @Prop({default: 'productitem'}) objectType: 'product' | 'productitem';
  @Prop({default: true}) showEdit: boolean;
  editItem: IInventory = {};
  showModal = false;
  editWarehouses = false;
  errorList: string[] = [];

  created() {
    this.resetEditItem();
  }

  closeModal() {
    this.showModal = false;
    this.resetEditItem();
  }

  resetEditItem() {
    this.editItem = {};
  }

  openModal(obj) {
    if(obj) {
      if(!obj.warehouse) {
        obj.warehouse = {};
      }
      this.editItem = obj;
    }
    this.showModal = true;
  }

  submitForm() {
    (this.$refs.form as VForm).validate().then( valid => {
      if(valid) {
        let inventory = deepCopy(this.inventory);
        let id = this.editItem.id;
        const index = inventory.findIndex( obj => obj.id === id );
        if(index > -1) {
          inventory[index] = this.editItem;
        }
        else {
          inventory.push(this.editItem);
        }
        const body = { inventory: inventory };
        api.put(this.objectType + '/' + this.id, body).then( () => {
          this.$toast.success('Inventory updated');
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
