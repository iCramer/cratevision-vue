<template>
  <li class="dropdown-list-item">
    <button class="dropdown-btn" type="button" :value="value" @click.prevent="clickHandler">
      {{ label }}
    </button>
  </li>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class DropdownItem extends Vue {
  @Prop() label: string;
  @Prop() value: any;

  clickHandler(evt) {
    this.$emit('click', { label: this.label, value: this.value });
  }
}

</script>
