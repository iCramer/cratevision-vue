<template>
  <h6 :class="['section-title', sectionType + '-title']">
    <slot></slot>
    <app-button v-if="showBtn" btnStyle="link" class="section-edit" size="xs" @click="handleClick" :icon="btnIcon"></app-button>
  </h6>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import AppButton from './button.vue';

@Component({
  components: { AppButton }
})
export default class SectionTitle extends Vue {
  @Prop({default: false}) showBtn: boolean;
  @Prop({default: 'edit'}) btnIcon: string;
  @Prop({default: 'list'}) sectionType: string;

  handleClick() {
    this.$emit('util-click');
  }
}

</script>
