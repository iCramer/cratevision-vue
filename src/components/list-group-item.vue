<template>
  <li :class="['list-group-item', {'d-flex justify-content-between': justifyContent, 'item-prefixed': icon }]">
    <span v-if="icon" :class="['list-item-prefix', {[color]: color}]">
      <font-awesome-icon :icon="icon" />
    </span>
    <slot></slot>
  </li>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class ListGroupItem extends Vue {
  @Prop() icon: string;
  @Prop({default: 'blue'}) color: string;
  @Prop({default: true}) justifyContent: boolean;
}

</script>
