<template>
  <div>
    <title-bar title="Dashboard"></title-bar>
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-4">
          <panel title="Recent Activity">
            <list-group>
              <list-group-item v-for="(note, index) in recentActivity" :icon="getNoteIcon(note.title)[0]" :color="getNoteIcon(note.title)[1]" :justifyContent="false">
                {{ note.title }}<span class="accent">{{ note.updatedOn | date('fromNow') }}</span>
                <p>{{ note.description }}</p>
              </list-group-item>
            </list-group>
          </panel>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { TitleBar, Panel, ListGroup, ListGroupItem } from '@/components';
import { DoughnutChart } from '@/charts';
import api from '@/api';
import { INote } from '@/interfaces';

@Component({
  components: {
    TitleBar,
    Panel,
    DoughnutChart,
    ListGroup,
    ListGroupItem
  }
})
export default class Dashboard extends Vue {
  recentActivity: INote[] = [];

  created() {
    this.getNotes();
  }

  getNotes() {
    api.get('note/all').then( resp => {
      this.recentActivity = resp.data.splice(0, 15);
    });
  }

  getNoteIcon(title) {
    if(title.toLowerCase().includes('supplier')) {
      return ['parachute-box', 'blue'];
    }
    else if(title.toLowerCase().includes('product item')) {
      return [['fal', 'barcode-read'], 'green'];
    }
    else if(title.toLowerCase().includes('product')) {
      return [['far', 'box-usd'], 'yellow'];
    }
    else {
      return 'map-marker-alt';
    }
  }
}
</script>
