import { defineStore } from 'pinia';
import { useWeatherAPIStore } from './WeatherAPIStore.js';
import { processDailyData, calculateEnergy, calculateWeeklyData, calculateMonthlyData } from '../utils/dataUtils.js';

export const useDataStore = defineStore('data', {
  state: () => ({
    dataOutput: [], // Add the dataOutput property here
    dataWeeklyOutput: [],
    dataMonthlyOutput: [],
  }),
  actions: {
    async setData() {
      const weatherData = await useWeatherAPIStore().fetchData();
      const dataForDaily = await processDailyData(weatherData);

      const completeData = await calculateEnergy(dataForDaily);
      this.dataOutput = completeData;

      // console.log(this.dataOutput);
      const weeklyData = await calculateWeeklyData(completeData);
      this.dataWeeklyOutput = weeklyData;

      const monthlyData = await calculateMonthlyData(completeData);
      this.dataMonthlyOutput = monthlyData;
    },
  }
});