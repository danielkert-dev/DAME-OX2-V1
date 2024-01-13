import { defineStore } from 'pinia';

const WEATHER_API_BASE_URL = `https://api.open-meteo.com/v1/forecast?
latitude=60.0973
&longitude=19.9348
&hourly=temperature_2m,weather_code,direct_normal_irradiance
&daily=sunshine_duration&timezone=auto
&past_days=92
&forecast_days=16
`;


export const useWeatherAPIStore = defineStore('weatherAPI', {
    state: () => ({
        weatherAPILink: WEATHER_API_BASE_URL,
    }),
        actions: {
            async fetchData() {
              const url = this.weatherAPILink;
        
              try {
                const response = await fetch(url);
                if (!response.ok) {
                  throw new Error(`Failed to fetch data from ${url}`);
                }
        
                const data = await response.json();
                return data;
              } catch (error) {
                console.error(error);
                throw new Error('Failed to fetch data.');
              }
            },
          }
});