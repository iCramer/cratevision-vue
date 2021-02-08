<template>
  <div>
    <checkbox v-for="(item, index) in options" :value="item[valueSelector]" :checked="isChecked(item)" @change="checkItem" :key="index">{{ item.label || item.name }}</checkbox>
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import Checkbox from './checkbox.vue';

@Component({
  components: { Checkbox }
})
export default class CheckboxGroup extends Vue {
  @Prop() label: string;
  @Prop() name: string;
  @Prop() options: any[];
  @Prop() value: any[];
  @Prop({default: 'value'}) valueSelector: string;
  checkedItems: any[] = [];

  mounted() {
    this.$on('change', this.checkItem);
    this.checkedItems = this.value;
  }

  onChange(checked: boolean, val: any) {
    this.$emit('input', this.checkedItems);
  }

  checkItem(checked, val) {
    if (checked) {
      this.checkedItems.push(val);
    }
    else {
      let index = this.checkedItems.findIndex( x => x.id === val.id );
      this.checkedItems.splice(index, 1);
    }
  }

  isChecked(item) {
    return this.checkedItems.includes(item);
  }
}
</script>
