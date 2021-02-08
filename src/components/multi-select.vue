<template>
  <div ref="multiSelect" class="form-group-wrapper multi-select">
    <div :class="['form-group', { 'form-group-filled': isFilled, 'form-group-focus': isFocused || open }]">
      <label class="form-group-label">{{ label }}</label>
      <div
        class="multi-select-input form-group-control"
        tabindex="0"
        role="button"
        @click.self="open = !open"
        @keyup.enter="open = !open"
        @keyup.space="open = !open"
        @focus="isFocused = true"
        @blur="onBlur"
        :aria-pressed="open"
      >
        <pill-box v-for="item in selectedItems" @click="removeItem(item)">{{ item.label || item.name }}</pill-box>
      </div>
      <font-awesome-icon ref="iconBtn" @click="open = !open" class="multi-select-icon" size="1x" icon="chevron-down" />
      <select-list :multiSelect="true" :valueProp="valueProp" :displayValue="displayValue" :options="options" v-model="selectedItems" :open="open" :withSearch="withSearch" />
    </div>
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import AppButton from './button.vue';
import SelectList from './select-list.vue';
import PillBox from './pill-box.vue';

@Component({
  components: { AppButton, PillBox, SelectList }
})
export default class MultiSelect extends Vue {
  @Prop() label: string;
  @Prop() options: any[];
  @Prop() value: any[];
  @Prop({default: 'value'}) valueProp: string;
  @Prop({default: false}) displayValue: boolean;
  @Prop() withSearch: boolean;
  open = false;
  selectedItems: any[] = [];
  isFilled = false;
  isFocused = false;

  @Watch('value')
  updateSelected() {
    this.selectedItems = this.value || [];
    this.isFilled = this.selectedItems.length > 0;
  }

  @Watch('selectedItems')
  innerValueChange() {
    this.$emit('input', this.selectedItems);
  }

  created () {
    document.addEventListener('click', this.outsideClick);
  }

  mounted() {
    this.selectedItems = this.value;
    this.isFilled = this.selectedItems.length > 0;
  }

  destroyed () {
    document.removeEventListener('click', this.outsideClick);
  }

  onBlur() {
    this.$emit('blur', this.selectedItems);
    this.isFilled = this.value.length > 0;
    this.isFocused = false;
  }

  removeItem(item) {
    let index = this.selectedItems.findIndex( x => {
      return x.id === item.id
    });
    this.selectedItems.splice(index, 1);
  }

  outsideClick(evt) {
    let el: any = this.$refs.multiSelect;
    let target = evt.target;
    if ( el !== target && !el.contains(target)) {
      this.open = false;
    }
  }

}
</script>
