import { Component, Prop, Mixins, Watch } from 'vue-property-decorator';
import { Doughnut, mixins } from 'vue-chartjs';
import { Chart } from 'chart.js';

const { reactiveProp } = mixins;

@Component
export default class DoughnutChart extends Mixins(Doughnut, reactiveProp) {
  @Prop() options: any;
  @Prop() chartData: any;
  @Prop() innerText: string;

  mounted() {
    this.renderChart(this.chartData, this.options);
    if(this.innerText) {
      this.renderInnerText();
    }
  }

  @Watch('innerText')
  setInner() {
    this.renderInnerText();
  }

  renderInnerText() {
    let innerText = this.innerText;

    Chart.pluginService.register({
      beforeDraw: (chart: any) => {
        let width = chart.chart.width;
        let height = chart.chart.height;
        let ctx = chart.chart.ctx;
        ctx.clearRect(0, 0, 1200, 1000);

        ctx.restore();
        let fontSize = (height / 150).toFixed(2);
        ctx.font = fontSize + "em sans-serif";
        ctx.fillStyle = "#396177";
        ctx.textBaseline = "middle";

        let text = '$' + innerText;
        let textX = Math.round((width - ctx.measureText(text).width) / 2);
        let textY = (height - 30) / 2;
        ctx.fillText(text, textX, textY);
        ctx.save();
      }
    });
  }

}
