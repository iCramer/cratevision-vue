<template>
  <div class="accordion">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  components: {  }
})
export default class Accordion extends Vue {
  handleClick() {
    this.$emit('click');
  }

}

</script>
