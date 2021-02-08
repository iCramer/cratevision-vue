<template>
  <div class="no-results">
    <font-awesome-icon v-if="icon" class="no-results-icon" :icon="icon" />
    <h5 class="no-results-header">{{header}}</h5>
    <p v-if="body" class="no-results-body">{{body}}</p>
    <app-button v-if="btnLabel" class="no-results-btn" btnStyle="secondary" @click="buttonClick">{{btnLabel}}</app-button>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import AppButton from './button.vue';

@Component({
  components: {
    AppButton
  }
})
export default class NoResults extends Vue {
  @Prop() header: string;
  @Prop() icon: string;
  @Prop() btnLabel: string;
  @Prop() body: string;

  buttonClick() {
    this.$emit('button-click');
  }
}

</script>
