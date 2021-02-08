<template>
  <div class="counter-input">
    <label v-if="label">{label}</label>
    <app-button btnStyle="link" @click="onChange($event)" :value="getValue() - 1" size="sm" :disabled="value <= 0" icon="chevron-left"></app-button>
    <input type="number" v-bind:class="{'has-count': value > 0}" @input="onChange($event)" @blur="onBlur($event)" :value="value" :max="max" />
    <app-button btnStyle="link" @click="onChange($event)" :value="getValue() + 1" size="sm" :disabled="value === parseInt(max)" icon="chevron-right"></app-button>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import AppButton from './button.vue';

@Component({
  components: { AppButton }
})
export default class Counter extends Vue {
  @Prop() label: string;
  @Prop({default: 0}) value: any;
  @Prop() max: number;

  onChange(evt: any) {
    let value = evt.target.value || 0;
    this.$emit('input', value);
  }

  onBlur(evt: any) {
    let value = evt.target.value || 0;
    this.$emit('blur', value);
  }

  getValue(){
    if(this.value === '' || isNaN(this.value)) {
      return 0;
    }
    else {
      return parseInt(this.value);
    }
  }
}
</script>
