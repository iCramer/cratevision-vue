<template>
  <div>
    <ul class="progress-tracker" v-if="steps && steps.length">
      <li v-for="(step, index) in steps" :key="index" v-bind:class="['progress-tracker-item', {'complete': index < activeIndex, 'active': index === activeIndex}]">
        <span v-if="index >= activeIndex">{{index + 1}}</span>
        <span v-else>
          <font-awesome-icon icon="check"></font-awesome-icon>
        </span>
        <span>{{step.title}}</span>
      </li>
    </ul>
    <slot></slot>
    <button-group>
      <app-button btnStyle="info-link" push="left" size="xs" icon="chevron-left" @click="prevClick" v-show="activeIndex > 0">Previous</app-button>
      <app-button btnStyle="info-link" size="lg" @click="$emit('cancel')" v-if="showCancel">Cancel</app-button>
      <app-button size="lg" @click="nextClick">{{getBtnText()}}</app-button>
    </button-group>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import AppButton from './button.vue';
import ButtonGroup from './button-group.vue';
import { VForm } from '@/interfaces';

@Component({
  components: { AppButton, ButtonGroup }
})
export default class ProgressTracker extends Vue {
  @Prop({default: true}) showCancel: boolean;
  @Prop({default: 'Submit'}) submitBtnLabel: string;
  steps: any[] = [];
  activeStep: Object = {};
  activeIndex: number = 0;

  mounted() {
    this.renderSteps();
  }

  nextClick() {
    let children: any[] = this.$children;
    let index = this.activeIndex;
    if(children[index].validate) {
      (children[index] as VForm).validate().then(isValid => {
        if(isValid) {
          this.continue();
          children[index].$emit('next-click');
        }
      });
    }
    else {
      this.continue();
    }
  }

  continue() {
    let children = this.$children;
    let index = this.activeIndex;
    if(index + 1 === this.steps.length) {
      this.$emit('submit');
    }
    else {
      let step = children.find(child => child['stepIndex'] === index + 1);
      this.setActiveStep(step);
    }
  }

  prevClick() {
    let step = this.$children.find(child => child['stepIndex'] === this.activeIndex - 1);
    this.setActiveStep(step);
  }

  getBtnText() {
    if(this.activeIndex < this.steps.length - 1) {
      return 'Next';
    }
    else {
      return "Finish";
    }
  }

  renderSteps() {
    let steps = [];
    let activeStep;
    let children = this.$children;

    children.forEach( (child, index) => {
      if (child.$vnode.componentOptions.tag === 'progress-tracker-step') {
        steps.push({title: child['title'], stepIndex: index});
        child['stepIndex'] = index;
        if (child['active']) {
          activeStep = child;
        }
      }
    });
    if (!activeStep) {
      const activeIndex = 0;
      activeStep = children.find(child => child['stepIndex'] === activeIndex);
    }
    this.setActiveStep(activeStep);
    this.steps = steps;
  }

  setActiveStep(step) {
    if(this.activeStep){
      this.activeStep['active'] = false;
    }
    step.active = true;
    this.activeStep = step;
    this.activeIndex = step.stepIndex;
  }
}
</script>
