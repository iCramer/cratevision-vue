<template>
  <table class="table">
    <thead>
      <tr>
        <th v-for="(column, index) in columns" :key="`header=${index}`">{{column.label}}</th>
        <th v-if="actions">Actions</th>
      </tr>
    </thead>
    <tbody v-if="records && records.length">
      <tr v-for="(record, index) in records" :key="`row-${index}`">
        <td v-for="cell in columns" :class="cell.class" :key="`${cell.label}-${index}`">
          <slot v-if="$scopedSlots[cell.slotName]" :name="cell.slotName" :record="record"></slot>
          <span v-else>{{getCellValue(cell, index)}}</span>
        </td>
      </tr>
    </tbody>
    <tbody v-else>
      <slot></slot>
    </tbody>
  </table>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class AppTable extends Vue {
  @Prop() records: Object;
  @Prop() actions: Object[];
  @Prop() columns: Object[];
  @Prop() onRowClick: Function;

  getCellValue(cell, index) {
    let obj = this.records[index];
    let selectors = cell.selector.split('.');
    let value = obj[selectors[0]];

    if(selectors.length > 1) {
      let lastValue;
      for (let [i, sel] of selectors.entries()) {
        if(i === 0) {
          lastValue = value;
        }
        else if (lastValue) {
          value = lastValue[sel];
          lastValue = value;
        }
        else {
          break;
        }
      }
    }

    if(value && cell.filter) {
      value = this.$options.filters[cell.filter](value);
    }

    return value || '';
  }
}
</script>
