<template>
  <div class="row">
    <div class="col-md-12">
      <input-validate label="Name" name="name" rules="required" v-model="innerValue.name" />
    </div>
    <div class="col-md-4">
      <input-field label="Item Cost" name="itemCost":numberStep=".01" inputType="number" v-model="innerValue.itemCost" />
    </div>
    <div class="col-md-4">
      <input-field label="Case Cost" name="caseCost" inputType="number" v-model="innerValue.caseCost" />
    </div>
    <div class="col-md-4">
      <input-field label="Items Per Case" name="caseQty" inputType="number" v-model="innerValue.caseQty" />
    </div>
    <div class="col-md-12">
      <input-field inputType="textarea" label="Description" name="description" v-model="innerValue.description" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { InputField, InputValidate } from '@/components';
import { IProductItem } from '@/interfaces';

@Component({
  components: {
    InputField,
    InputValidate
  }
})
export default class BasicInfoForm extends Vue {
  @Prop() value: IProductItem;
  innerValue: IProductItem = {
    name: '',
    itemCost: undefined,
    caseCost: undefined,
    caseQty: undefined,
    description: ''
  };

  mounted() {
    this.innerValue = this.value;
  }

  @Watch('innerValue', {deep: true})
  innerValueChange() {
    this.$emit('input', this.innerValue);
  }

  @Watch('value', {deep: true})
  valueChange() {
    this.innerValue = this.value;
  }

}

</script>
