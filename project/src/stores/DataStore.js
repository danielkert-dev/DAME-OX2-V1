import { defineStore } from 'pinia';
import { useWeatherAPIStore } from './WeatherAPIStore.js';
import { processDailyData, calculateEnergy, calculateMonthlyData } from '../utils/dataUtils.js';

export const useDataStore = defineStore('data', {
  state: () => ({
    dataOutput: [], // Add the dataOutput property here
    dataMonthlyOutput: [],
  }),
  actions: {
    async setData() {
      const weatherData = await useWeatherAPIStore().fetchData();
      const dataForDaily = await processDailyData(weatherData);

      const completeData = await calculateEnergy(dataForDaily);
      this.dataOutput = completeData;

      const monthlyData = await calculateMonthlyData(completeData);
      this.dataMonthlyOutput = monthlyData;
    },
  }
});