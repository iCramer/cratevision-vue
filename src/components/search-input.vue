<template>
  <div class="search-input">
    <font-awesome-icon class="search-input-icon" icon="search" />
    <input type="text" placeholder="Search" :value="value" @input="onChange" />
    <!-- <app-button v-if="value.length" :linkBtn="true" btnStyle="danger" size="sm" @click="onClear" icon="times-circle" /> -->
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import AppButton from './button.vue';

@Component({
  components: { AppButton }
})
export default class SearchInput extends Vue {
  @Prop() list: any[];
  @Prop() value: string;

  onChange(evt) {
    this.$emit('input', evt.target.value);
  }

  onClear() {
    this.$emit('input', '');
  }
}

</script>
