import { defineStore } from 'pinia';
import { useWeatherAPIStore } from './WeatherAPIStore.js';
import { processDailyData, processMonthlyData, processYearlyData} from '../utils/dataUtils.js';

export const useDataStore = defineStore('data', {
  state: () => ({
    dataOutput: [], // Add the dataOutput property here
    dataMonthlyOutput: [],
    dataYearlyOutput: [],
  }),
  actions: {
    async setData() {
      const weatherData = await useWeatherAPIStore().fetchData();

      const dataForDaily = await processDailyData(weatherData);
      this.dataOutput = dataForDaily;

      const dataForMonthly = await processMonthlyData(weatherData);
      this.dataMonthlyOutput = dataForMonthly;

      const dataForYearly = await processYearlyData(weatherData);
      this.dataYearlyOutput = dataForYearly;


    },
  }
});