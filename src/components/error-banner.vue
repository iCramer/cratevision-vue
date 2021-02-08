<template>
  <transition name="fade">
    <div class="error-banner" v-if="value.length">
      <div class="error-banner-icon">
        <font-awesome-icon size="2x" :icon="['far', 'exclamation-circle']" />
      </div>
      <ul class="error-list">
        <li v-for="error in errorList">{{ error || 'An erorr has occured.' }}</li>
      </ul>
      <app-button className="error-banner-close" btnStyle="link" size="xs" icon="times" @click="close" />
    </div>
  </transition>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import  AppButton from './button.vue';

@Component({
  components: { AppButton }
})
export default class ErrorBanner extends Vue {
  @Prop({default: () => []}) value: string[];
  errorList: string[] = [];

  @Watch('value')
  onValueChange() {
    this.value.forEach( error => {
      if(!this.errorList.includes(error)) {
        this.errorList.push(error);
      }
    });
  }

  close() {
    this.$emit('input', []);
  }
}
</script>
