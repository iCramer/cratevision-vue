import Vue from 'vue';
import moment from 'moment';

Vue.filter('currency', (value: number) => {
  if (!value) return '$0'
  return '$' + value.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
});

Vue.filter('fee', (value: number, type: 'AMOUNT' | 'PERCENTAGE') => {
  if (type === 'AMOUNT') {
    if (!value) return '$0';
    else {
      return '$' + value.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  }
  else if (type === 'PERCENTAGE') {
    if (!value) return '0%';
    else {
      return value + '%';
    }
  }
  else {
    return value;
  }
});

Vue.filter('date', (value: string, format: string = 'M-DD-YYYY') => {
  if (format && format === 'fromNow') {
    return moment(value).fromNow();
  }
  else {
    return moment(value).format(format);
  }
});
