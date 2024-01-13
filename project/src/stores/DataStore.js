import { defineStore } from 'pinia'
import { useWeatherAPIStore } from './WeatherAPIStore.js'

export const useDataStore = defineStore('data', {
  state: () => ({
    dataOutput: [],
    dataDate: [],
  }),
  actions: {

    async setData() {
      /* //@ Import 
      */

      const weatherData = await useWeatherAPIStore().fetchData()
      // console.log(weatherData)
    
      const directNormalIrradiance = weatherData.hourly.direct_normal_irradiance
      const hourlyTime = weatherData.hourly.time
      const dataForDaily = []

      /* //@ Process 
        - Group irradiance values by day and calculate rounded daily average
      */
    
      let currentDate = null;
      let totalIrradiance = 0;
      let hourCount = 0;
    
      for (let i = 0; i < hourlyTime.length; i++) {
        const time = hourlyTime[i];
        const date = time.split("T")[0];
    
        if (date !== currentDate) {
          // New day, save the average irradiance for the previous day
          if (currentDate !== null) {
            const averageIrradiance = Math.round(totalIrradiance / hourCount);
            dataForDaily.push({
              date: currentDate,
              averageIrradiance: averageIrradiance
            });
          }
    
          // Reset counters for the new day
          currentDate = date;
          totalIrradiance = 0;
          hourCount = 0;
        }
    
        // Accumulate irradiance for the current day
        totalIrradiance += directNormalIrradiance[i];
        hourCount++;
      }
    
      // Add the last day's average irradiance
      if (currentDate !== null) {
        const averageIrradiance = Math.round(totalIrradiance / hourCount);
        dataForDaily.push({
          date: currentDate,
          averageIrradiance: averageIrradiance,
          sunshineDuration: weatherData.daily.sunshine_duration
        });
      }

      console.log(dataForDaily)
      /* //@Calculate
        - Energy for each day
        - Energy (kWh)=Panel Efficiency×Solar Irradiance×Panel Area×Time
      */

      const panelEfficiency = 0.7;
      // Solar Irradence = Direct Normal Irradiance
      const panelArea = 1;
      const sunshineDuration = 5;

      // Calculate energy for each day using the formula
      const energyData = dataForDaily.map(day => {
        const energy = panelEfficiency * day.averageIrradiance * panelArea * sunshineDuration;
        return {
          date: day.date,
          energy: energy
        };
      });

      // console.log(energyData);
      this.dataOutput = energyData



      // /* //@ Dates */
      // const currentDay = new Date()
      // const currentMonth = currentDay.getMonth()
      // const currentYear = currentDay.getFullYear()

      // // Past 12 months
      // for (let i = 11; i >= 0; i--) {
      //   const date = new Date(currentYear, currentMonth - i, 1)
      //   this.dataDate.push({
      //     date: date.toISOString().slice(0, 10),
      //     type: 'month',
      //     age: 'past'
      //   })
      // }

      // // Past week
      // for (let i = 0; i < 7; i++) {
      //   const date = new Date()
      //   date.setDate(date.getDate() - i)

      //   this.dataDate.push({
      //     date: date.toISOString().slice(0, 10),
      //     type: 'day',
      //     age: 'past'
      //   })
      // }

      // // Current day
      // const today = new Date().toISOString().slice(0, 10)
      // this.dataDate.push({
      //   date: today,
      //   type: 'day',
      //   age: 'current'
      // })

      // // Future week
      // for (let i = 0; i < 7; i++) {
      //   const date = new Date()
      //   date.setDate(date.getDate() + i)

      //   this.dataDate.push({
      //     date: date.toISOString().slice(0, 10),
      //     type: 'day',
      //     age: 'future'
      //   })
      // }

      // // Future 12 months
      // for (let i = 1; i <= 12; i++) {
      //   const date = new Date(currentYear, currentMonth + i, 1)
      //   this.dataDate.push({
      //     date: date.toISOString().slice(0, 10),
      //     type: 'month',
      //     age: 'future'
      //   })
      // }
    },
  }
})
