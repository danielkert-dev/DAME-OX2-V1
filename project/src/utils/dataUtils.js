export function processDailyData(weatherData) {
        /* //@ Process 
        - Group irradiance values by day and calculate rounded daily average
      */

        const directNormalIrradiance = weatherData.hourly.direct_normal_irradiance
        const hourlyTime = weatherData.hourly.time
        const dataForDaily = []
      
        let currentDate = null;
        let totalIrradiance = 0;
        let hourCount = 0;
        let day = 0;
      
        for (let i = 0; i < hourlyTime.length ; i++) {
          const time = hourlyTime[i];
          const date = time.split("T")[0];
      
          if (date !== currentDate) {
            // New day, save the average irradiance for the previous day
            if (currentDate !== null) {
              // const sunshine = weatherData.daily.sunshine_duration[day-1]
              // const sunshineHours = Math.floor(sunshine / 3600)
              // const sunshineMinutes = Math.floor((sunshine % 3600) / 60)
              const weather = weatherData.daily.weather_code[day-1]
              const temperature = weatherData.daily.temperature_2m_max[day-1]
  
              dataForDaily.push({
                date: currentDate,
                totalIrradiance: totalIrradiance,
                // sunshine: sunshineHours + "." + sunshineMinutes,
                weather: weather,
                temperature: temperature,
              });
            }
      
            // Reset counters for the new day
            currentDate = date;
            totalIrradiance = 0;
            hourCount = 0;
            day++;
          }
      
          // Accumulate irradiance for the current day
          totalIrradiance += directNormalIrradiance[i];
          hourCount++;
        }
      
        // Add the last day's average irradiance
        if (currentDate !== null) {
          dataForDaily.push({
            date: currentDate,
            totalIrradiance: totalIrradiance,
          });
        }
  
        if (dataForDaily && Array.isArray(dataForDaily)) {
          // Solar Irradence = Direct Normal Irradiance
          const panelArea = 56;
          const panelEfficiency = 0.35;
      
          // Calculate energy for each day using the formula
          let completeData = dataForDaily.map(day => {
            const energy = day.totalIrradiance * panelArea * panelEfficiency;
            // If before today then past if after today then future if today then current
            const age =
              day.date > new Date().toISOString().slice(0, 10)
                ? "future"
                : day.date === new Date().toISOString().slice(0, 10)
                ? "current"
                : "past";
    
    
            let accuracy = 100;
            if (age === 'current') {
              accuracy = 99;
            }
            if (age === 'past') {
              accuracy = 100;
            }
            if (age === 'future') {
              accuracy = 90;
            }
    
            return {
              date: day.date,
              energyW: energy.toFixed(2),
              energyKWh: (energy / 1000).toFixed(2),
              weather: day.weather,
              temperature: day.temperature,
              sunshine: day.sunshine,
              age: age,
              accuracy: accuracy,
            };
          });
    
          // remove last data completeData
          completeData.pop();
    
        
          // console.log(completeData);
          return completeData;
  }
}

export function processMonthlyData(weatherData) {

  /* 
  date: january,
  energyKWh: 100kwh,
  weather: sunny,
  sunsgine: ?,
  age: past||current||future,
  accuracy: accuracy,
  */

  console.log('processMonthlyData')

  return weatherData

}


export function processYearlyData(weatherData) {


  console.log('pr')

  return weatherData
}

  // export function calculateMonthlyData(completeData) {
        
  //   // Convert to monthly
  //   const monthlyData = [];
  //   let currentMonth = [];
  //   let monthStartDate = null;

  //   completeData.forEach((day, index) => {
  //   if (!monthStartDate) {
  //       monthStartDate = day.date;
  //   }
  //   currentMonth.push(day);

  //   const nextDay = index + 1 < completeData.length ? new Date(completeData[index + 1].date) : null;

  //   if (!nextDay || nextDay > new Date() || nextDay.getMonth() > new Date(day.date).getMonth()) {
  //       const energySum = currentMonth.reduce((sum, entry) => sum + parseFloat(entry.energyW), 0);
  //       const sunshineSum = currentMonth.reduce((sum, entry) => sum + parseFloat(entry.sunshine), 0);
  //       const averageEnergy = (energySum / currentMonth.length).toFixed(2);

  //       // Handle NaN case
  //       const averageEnergyKWh = isNaN(averageEnergy) ? '0.00' : ((averageEnergy / 1000) * sunshineSum).toFixed(2);

  //       monthlyData.push({
  //       date: monthStartDate,
  //       endDate: day.date,
  //       averageEnergyW: averageEnergy,
  //       averageEnergyKWh: averageEnergyKWh,
  //       });

  //       currentMonth = [];
  //       monthStartDate = null;
  //   }
  //   });

  //   // this.dataMonthlyOutput = monthlyData;
  //   return monthlyData; // Add this line to return the monthlyData
  // }

  
  // export function calculateWeeklyData(completeData) {
  //   // console.log(completeData);
  //   // Convert to weekly
  //   const weeklyData = [];
  //   let currentWeek = [];
  //   let weekStartDate = null;

  //   completeData.forEach(day => {
  //     if (!weekStartDate) {
  //       weekStartDate = day.date;
  //     }
  //     currentWeek.push(day);
      
  //     const nextDay = new Date(day.date);
  //     nextDay.setDate(nextDay.getDate() + 1);

  //      // If its this week then set today date
  //      let thisWeek = ''
  //      if (day.date === new Date().toISOString().slice(0, 10)) {
  //        thisWeek = new Date().toISOString().slice(0, 10);
  //      } else {
  //        thisWeek = new Date(day.date).toISOString().slice(0, 10);
  //      }
      
  //     if (nextDay.getDay() === 1 || nextDay > new Date()) {
  //       const energySum = currentWeek.reduce((sum, entry) => sum + parseFloat(entry.energyW), 0);
  //       const sunshineSum = currentWeek.reduce((sum, entry) => sum + parseFloat(entry.sunshine), 0);
  //       const averageEnergy = (energySum / currentWeek.length).toFixed(2);
  //       const averageSunshine = (sunshineSum / currentWeek.length).toFixed(2);
       

  //       weeklyData.push({
  //         date: thisWeek,
  //         startDate: weekStartDate,
  //         endDate: day.date,
  //         averageEnergyW: averageEnergy,
  //         averageEnergyKWh: ((averageEnergy / 1000) * averageSunshine).toFixed(2),
  //       });

  //       currentWeek = [];
  //       weekStartDate = null;
  //     }
  //   });

  //   // this.dataWeeklyOutput = weeklyData;
  //   // console.log(weeklyData);
  //   return weeklyData; // Add this line to return the weeklyData
  // }
  