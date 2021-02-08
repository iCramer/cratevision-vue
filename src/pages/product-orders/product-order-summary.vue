<template>
  <div v-if="order">
    <accordion :iconList="false">
      <accordion-item v-for="(item, index) in orderSummary" :badgeContent="item.quantity" :title="item.product.name" :key="`summaryItem-${index}`">
        <span slot="utility" class="order-summary-util">
          <span>{{item.totalCost | currency}}</span>
        </span>
        <app-table :columns="summaryColumns" :records="item.prodItems">
          <badge slot="cost" slot-scope="{record}">{{record.totalCost | currency}}</badge>
        </app-table>
      </accordion-item>
      <accordion-item title="TOTAL" :initializeOpen="true" :boldText="true">
        <app-table :columns="summaryColumns" :records="totalProdItemQty">
          <badge slot="cost" slot-scope="{record}">{{record.totalCost | currency}}</badge>
        </app-table>
      </accordion-item>
    </accordion>
    <div class="product-order-total">
      <list-group :iconList="false">
        <list-group-item v-for="fee in order.fees">
          {{fee.name}} <span>{{fee.amount | fee(fee.type)}}</span>
        </list-group-item>
        <hr v-if="order.fees.length" />
        <list-group-item>
          Total Order Cost: <span>{{getTotalCost() | currency}}</span>
        </list-group-item>
      </list-group>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { Accordion, AccordionItem, Badge, ListGroup, ListGroupItem, AppTable } from '@/components';
import { IProductOrder } from '@/interfaces';

@Component({
  components: {
    Accordion,
    AccordionItem,
    Badge,
    ListGroup,
    ListGroupItem,
    AppTable
  }
})
export default class ProductOrderSummary extends Vue {
  @Prop({default: {}}) order: IProductOrder;
  orderSummary = [];
  totalProdItemQty = [];
  summaryColumns = [
    { label: 'Name', selector: 'name' },
    { label: 'Total Quantity', selector: 'totalItemQty' },
    { label: 'Cases Needed', selector: 'casesNeeded' },
    { label: 'Overstock', selector: 'overstock' },
    { label: 'Cost', slotName: 'cost' }
  ];

  mounted() {
    this.calculateProdCost();
  }

  @Watch('order', {deep: true})
  updateSummary() {
    this.calculateProdCost();
  }

  calculateProdCost() {
    this.orderSummary = [];
    this.totalProdItemQty = [];
    this.order.productQuantities.forEach( prodQty => {
      let summaryItem: any = {product: prodQty.product, quantity: prodQty.count, totalCost: 0, prodItems: [] };
      prodQty.product.productItemQuantities.forEach( prodItemQty => {
        let totalItemQty = prodItemQty.count * prodQty.count;
        let casesNeeded = Math.ceil(totalItemQty / prodItemQty.productItem.caseQty);
        let overstock = totalItemQty % prodItemQty.productItem.caseQty;
        let totalCost = casesNeeded * prodItemQty.productItem.caseCost;

        summaryItem.prodItems.push({
          name: prodItemQty.productItem.name,
          totalItemQty: totalItemQty,
          casesNeeded: casesNeeded,
          overstock: overstock,
          totalCost: totalCost
        });
        summaryItem.totalCost += totalCost;

        let item = this.totalProdItemQty.find(x => x.id === prodItemQty.productItem.id);
        if(item) {
          item.totalItemQty += totalItemQty;
          item.totalCost += totalCost;
          item.casesNeeded += casesNeeded;
          item.overstock = (item.totalItemQty % prodItemQty.productItem.caseQty);
        }
        else {
          this.totalProdItemQty.push({
            id: prodItemQty.productItem.id,
            name: prodItemQty.productItem.name,
            totalItemQty: totalItemQty,
            casesNeeded: casesNeeded,
            totalCost: totalCost,
            overstock: overstock
          });
        }
      });

      this.orderSummary.push(summaryItem);
    });
  }

  getTotalCost() {
    let cost = 0;
    this.orderSummary.forEach( product => {
      cost += product.totalCost;
    });
    let feeCost = 0;
    this.order.fees.forEach( fee => {
      if(fee.type === 'PERCENTAGE') {
        feeCost += (fee.amount / 100) * cost;
      }
      else {
        feeCost += fee.amount;
      }
    });

    return cost + feeCost;
  }
}
</script>
