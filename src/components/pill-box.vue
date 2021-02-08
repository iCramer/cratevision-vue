<template>
  <div class="pill-box">
    <span><slot></slot></span>
    <app-button className="pill-btn" @click="handleClick" size="xs" :linkBtn="true" icon="times-circle" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import AppButton from './button.vue';

@Component({
  components: { AppButton }
})
export default class PillBox extends Vue {
  handleClick(evt) {
    this.$emit('click', evt);
  }
}
</script>
