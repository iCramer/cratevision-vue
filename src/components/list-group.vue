<template>
  <div>
    <section-title v-if="title" :showBtn="showBtn" v-on:util-click="handleUtilClick">{{title}}</section-title>
    <ul v-bind:class="['list-group', className, {'icon-list': iconList}]">
      <slot></slot>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import SectionTitle from './section-title.vue';

@Component({
  components: { SectionTitle }
})
export default class ListGroup extends Vue {
  @Prop() title: string;
  @Prop() className: string;
  @Prop({default: true}) iconList: boolean;
  @Prop({default: false}) showBtn: boolean;

  handleUtilClick() {
    this.$emit('util-click');
  }
}

</script>
