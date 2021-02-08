<template>
  <div class="pagination">
    <div class="col">
      <span><strong>{{ startRecord }}</strong> to <strong>{{ endRecord }}</strong> of <strong>{{ totalRecords }}</strong></span>
    </div>
    <div class="col pagination-controls">
      <div v-if="pages.length > 1">
        <app-button @click="setPage(1)" btnStyle="info-link" :icon="['far', 'chevron-double-left']" :disabled="currentPage === 1" />
        <app-button @click="setPage(currentPage - 1)" btnStyle="info-link" :icon="['far', 'chevron-left']" :disabled="currentPage === 1" />
        <div class="pagination-select">
          <select v-model="currentPage" @change="setPage(currentPage)">
            <option v-for="page in pages" :value="page">{{ page }}</option>
          </select>
          <font-awesome-icon class="select-arrow" :icon="['fal', 'chevron-down']" />
        </div>
        <app-button @click="setPage(currentPage + 1)" btnStyle="info-link" :icon="['far', 'chevron-right']" :disabled="currentPage === pages.length" />
        <app-button @click="setPage(pages.length)" btnStyle="info-link" :icon="['far', 'chevron-double-right']" :disabled="currentPage === pages.length" />
      </div>
    </div>
    <div class="col page-length">
      <div class="pagination-select">
        <label>Per Page</label>
        <select v-model="perPage">
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
        <font-awesome-icon class="select-arrow" :icon="['fal', 'chevron-down']" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import AppButton from './button.vue';

@Component({
  components: {
    AppButton
  }
})
export default class Pagination extends Vue {
  @Prop({default: 0}) totalRecords: number;
  @Prop({default: 1}) startPage: number;
  perPage = 25;
  currentPage = 1;
  startRecord = 1;
  endRecord = 25;
  pages: number[] = [];

  mounted() {
    this.getPages();
  }

  @Watch('totalRecords')
  updateTotal() {
    this.getPages();
  }

  @Watch('perPage')
  updatePages() {
    this.getPages();
  }

  getPages() {
    let length = Math.ceil(this.totalRecords / this.perPage);
    this.pages = Array.from({length: length}, (v, i) => i + 1);
    this.setPage(1);
  }

  setPage(page) {
    this.currentPage = page;
    if (this.perPage >= this.totalRecords || page === this.pages[this.pages.length - 1]) {
      this.endRecord = this.totalRecords;
    }
    else {
      this.endRecord = this.perPage * page;
    }
    this.startRecord = this.perPage * (page - 1) + 1;
    this.$emit('change', { start: this.startRecord - 1, end: this.endRecord });
  }

}

</script>
