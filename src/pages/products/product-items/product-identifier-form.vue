<template>
  <div class="row">
    <div class="col-md-3">
      <select-validate label="Type" rules="required" name="type" v-model="innerValue.type" :options="options" />
    </div>
    <div class="col-md-5">
      <input-validate label="Name" rules="required" name="name" v-model="innerValue.name" />
    </div>
    <div class="col-md-4">
      <input-validate label="Identifier" rules="required" name="identifier" v-model="innerValue.identifier" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { ListGroup, ListGroupItem, InputValidate, AppButton, SelectValidate } from '../../../components';
import { IProductIdentifier } from '@/interfaces';

@Component({
  components: {
    InputValidate,
    AppButton,
    SelectValidate
  }
})
export default class ProductIdentifierForm extends Vue {
  @Prop() value: IProductIdentifier;
  innerValue: IProductIdentifier = {};
  options = ['SKU', 'ASIN', 'UPC', 'GTIN', 'GCID', 'EPID', 'EAN', 'ISBN', 'FNSKU'];

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
}

</script>
