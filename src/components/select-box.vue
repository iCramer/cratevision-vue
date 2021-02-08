<template>
  <div class="form-group-wrapper select-box">
    <div ref="selectBox" :class="['form-group', validateClasses, { 'form-group-filled': isFilled, 'form-group-focus': open }]">
      <label v-if="label" class="form-group-label" :for="name">{{label}}<font-awesome-icon class="asterisk" icon="asterisk" /></label>
      <button type="button" class="select-box-btn form-group-control" @click="open = !open" @focus="inFocus = true">
        <span v-if="value">{{ getLabel() }}</span>
      </button>
      <font-awesome-icon ref="iconBtn" @click="open = !open" class="select-box-icon" size="1x" icon="chevron-down" />
      <select-list :options="options" v-model="innerValue" :open="open" :withSearch="withSearch" />
    </div>
    <slot></slot>
    <span class="validation-error">{{ errorMessages[0] }}</span>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import SelectList from './select-list.vue';

@Component({
  components: { SelectList }
})
export default class SelectBox extends Vue {
  @Prop() label: string;
  @Prop() name: string;
  @Prop() value: any;
  @Prop() options: any[];
  @Prop({default: () => []}) errorMessages: any;
  @Prop() validateClasses: any;
  @Prop() withSearch: boolean;
  open = false;
  innerValue: any = {};
  isFilled = false;

  @Watch('innerValue')
  innerValueChange() {
    this.$emit('input', this.innerValue);
  }

  @Watch('value')
  valueChange() {
    this.innerValue = this.value;
    this.isFilled = this.value && (Object.keys(this.value).length > 0 || this.value.length > 0);
    this.open = false;
  }

  getLabel() {
    if (typeof this.value === 'string' || typeof this.value === 'number') {
      return this.value;
    }
    else {
      return this.value.label || this.value.name;
    }
  }

  outsideClick(evt) {
    let el: any = this.$refs.selectBox;
    let target = evt.target;
    if ( el !== target && !el.contains(target)) {
      this.open = false;
    }
  }

  created () {
    document.addEventListener('click', this.outsideClick);
  }

  destroyed () {
    document.removeEventListener('click', this.outsideClick);
  }
}
</script>
