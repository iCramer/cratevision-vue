<template>
  <div class="dropdown" ref="dropdownMenu">
    <div v-if="btnLabel">
      <app-button @click="open = !open">{{ btnLabel }}</app-button>
    </div>
    <ul v-if="list && list.length" :class="['dropdown-list', {'open': open}]">
      <dropdown-item
        v-for="(item, index) in list"
        :label="item.label || item.name"
        :value="item.value || item.id"
        @click="handleClick"
        :key="index"
      ></dropdown-item>
    </ul>
    <ul v-else :class="['dropdown-list', {'open': open}]">
      <slot></slot>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import DropdownItem from './dropdown-item.vue';
import AppButton from './button.vue';

@Component({
  components: { AppButton, DropdownItem }
})
export default class Dropdown extends Vue {
  @Prop() btnLabel: string;
  @Prop() list: any[];
  @Prop() open = false;

  outsideClick(evt) {
    let el: any = this.$refs.dropdownMenu;
    let target = evt.target;
    if ( el !== target && !el.contains(target)) {
      this.open = false;
    }
  }

  handleClick(evt) {
    this.$emit('click', evt);
  }

  created () {
    document.addEventListener('click', this.outsideClick);
  }

  destroyed () {
    document.removeEventListener('click', this.outsideClick);
  }
}

</script>
