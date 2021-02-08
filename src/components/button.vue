<template>
    <router-link v-if="route" :to="route" @click="handleClick($event)" v-bind:class="getClassSet()">
      <font-awesome-icon v-if="icon" class="btn-icon" :icon="icon" />
      <slot></slot>
    </router-link>
    <button v-else :type="btnType" :value="value" @click="handleClick($event)" :disabled="disabled" v-bind:class="getClassSet()" :icon="icon">
      <font-awesome-icon v-if="icon" class="btn-icon" :icon="icon" />
      <slot></slot>
    </button>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class AppButton extends Vue {
  @Prop({default: 'md'}) size: string;
  @Prop({default: false}) linkBtn: boolean;
  @Prop({default: 'primary'}) btnStyle: string;
  @Prop({default: false}) centered: boolean;
  @Prop({default: 'button'}) btnType: string;
  @Prop() className: string;
  @Prop() route: string;
  @Prop() icon: string;
  @Prop() value: any;
  @Prop({default: false}) disabled: boolean;
  @Prop() push: string;

  getClassSet() {
    return [
      'btn',
      `btn-${this.btnStyle}`,
      `btn-${this.size}`,
      this.className,
      {
        'btn-link': this.linkBtn,
        'btn-centered': this.centered,
        'icon-with-text': this.icon && this.$slots.default,
        'btn-push-left': this.push === 'left',
        'btn-push-right': this.push === 'right'
      }
    ];
  }

  handleClick(evt: any) {
    this.$emit('click', evt);
  }
}
</script>
