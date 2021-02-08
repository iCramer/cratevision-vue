<template>
  <div v-if="value && value.address">
    <div class="row">
      <div class="col-md-6">
        <input-validate name="name" label="Name" rules="required" v-model="innerValue.name" />
      </div>
    </div>
    <div class="row">
      <div class="col-md-6">
        <input-field name="addressLine1" label="Address Line 1" v-model="innerValue.address.addressLine1" />
      </div>
      <div class="col-md-6">
        <input-field name="addressLine2" label="Address Line 2" v-model="innerValue.address.addressLine2" />
      </div>
    </div>
    <div class="row">
      <div class="col-md-6">
        <input-field name="city" label="City" v-model="innerValue.address.city" />
      </div>
      <div class="col-md-6">
        <select-box name="state" :options="states" label="State" v-model="innerValue.address.state" />
      </div>
    </div>
    <div class="row">
      <div class="col-md-6">
        <input-field name="zipCode" label="Zip Code" v-model="innerValue.address.zipCode" />
      </div>
      <div class="col-md-6">
        <input-field name="country" label="Country" v-model="innerValue.address.country" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { ListGroup, ListGroupItem, Badge, Modal, InputField, InputValidate, SelectBox, AppButton } from '@/components';
import { ISupplier } from '@/interfaces';
import { states } from '@/data/states';

@Component({
  components: {
    ListGroup,
    ListGroupItem,
    Badge,
    InputField,
    InputValidate,
    SelectBox,
    Modal,
    AppButton
  }
})
export default class SupplierForm extends Vue {
  @Prop() value: ISupplier;
  innerValue: ISupplier = {
    name: '',
    address: {}
  };

  mounted() {
    this.innerValue = this.value;
  }

  @Watch('innerValue')
  innerValueChange() {
    this.$emit('input', this.innerValue);
  }

  @Watch('value')
  valueChange() {
    this.innerValue = this.value;
  }

  states = states;

}

</script>
