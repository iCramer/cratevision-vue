<template>
  <transition name="expand">
    <div v-if="open" class="select-list">
      <div v-if="withSearch" class="select-list-search">
        <search-input v-model="filter" />
      </div>
      <div v-if="!multiSelect">
        <!-- <app-button className="single-select-option" btnStyle="link" size="sm" @click="onChange(null)">No Selection</app-button> -->
        <app-button
          v-for="(item, index) in filteredOptions"
          className="single-select-option"
          btnStyle="link"
          size="sm"
          @click="onChange(item)"
          :key="index"
        >
          {{ getLabel(item) }}
        </app-button>
      </div>
      <checkbox-group v-else v-model="selectedItems">
        <checkbox v-for="item in filteredOptions" class="multi-select-option" :checked="isChecked(item)" :value="item">
          {{ getLabel(item) }} <span v-if="displayValue"> - <strong>{{ getLabelValue(item) }}</strong></span>
        </checkbox>
      </checkbox-group>
    </div>
  </transition>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import AppButton from './button.vue';
import SearchInput from './search-input.vue';
import Checkbox from './checkbox.vue';
import CheckboxGroup from './checkbox-group.vue';
import Badge from './badge.vue';
import { Filter } from '@/filter';

@Component({
  components: { AppButton, Checkbox, CheckboxGroup, SearchInput, Badge }
})
export default class SelectList extends Vue {
  @Prop() value: any;
  @Prop() options: Object[];
  @Prop({default: false}) multiSelect: boolean;
  @Prop({default: false}) open: boolean;
  @Prop({default: 'id'}) valueProp: string;
  @Prop({default: false}) displayValue: boolean;
  @Prop({default: false}) withSearch: boolean;
  filteredOptions: Object[] = [];
  selectedItems: any[] = [];
  filter = '';

  mounted() {
    this.filteredOptions = this.options;
  }

  @Watch('selectedItems')
  onSelectChange() {
    this.$emit('input', this.selectedItems);
  }

  @Watch('value')
  onValueChange() {
    this.selectedItems = this.value;
  }

  @Watch('options')
  onOptionChange() {
    this.onFilter();
  }

  getLabel(item) {
    if (typeof item === 'string' || typeof item === 'number') {
      return item;
    }
    else {
      return item.label || item.name;
    }
  }

  getLabelValue(item) {
    if (item.type) {
      return this.$options.filters.fee(item[this.valueProp], item.type);
    }
    else {
      return item[this.valueProp];
    }
  }

  onFilter() {
    if(this.withSearch) {
      this.filteredOptions = Filter([{field: 'all', value: this.filter}], this.options);
    }
    else {
      this.filteredOptions = this.options;
    }
  }

  @Watch('filter')
  onFilterChange() {
    this.onFilter();
  }

  onChange(value) {
    this.$emit('input', value);
  }

  isChecked(item) {
    let found = this.value.find(x => x.id === item.id);
    return found !== undefined;
  }
}
</script>
