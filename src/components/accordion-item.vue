<template>
  <div :class="['accordion-item', {open: open}]">
    <h6 class="accordion-item-header">
      <button type="button" @click="handleClick" :aria-expanded="open" :aria-controls="title">
        <font-awesome-icon :icon="getIcon()"></font-awesome-icon>
        <span :class="{'font-weight-bold': boldText}">{{title}}</span>
        <badge v-if="badgeContent" badgeStyle="info">{{badgeContent}}</badge>
        <span class="accordion-item-utility">
          <slot name="utility"></slot>
        </span>
      </button>
    </h6>
    <transition name="expand">
      <div class="accordion-item-content" :id="title" v-if="open">
        <slot></slot>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Badge } from '@/components';

@Component({
  components: { Badge }
})
export default class AccordionItem extends Vue {
  @Prop() title: string;
  @Prop() badgeContent: string | number;
  @Prop({default: false}) initializeOpen: boolean;
  @Prop({default: false}) boldText: boolean;
  open = false;

  mounted() {
    if(this.initializeOpen) {
      this.open = !this.open;
    }
  }

  handleClick() {
    this.open = !this.open;
    this.$emit('click');
  }

  getIcon() {
    return this.open ? 'chevron-circle-down' : 'chevron-circle-right';
  }

}

</script>
