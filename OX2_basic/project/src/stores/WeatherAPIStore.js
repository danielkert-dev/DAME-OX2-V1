// store.js
import { defineStore } from 'pinia';
import { ref } from 'vue';

const data = ref(null);
const response = ref(null);
const error = ref(null);
const loading = ref(true);

const API_BASE_URL = `https://api.open-meteo.com/v1/forecast?latitude=60.11354447300488&longitude=19.90986781165426&daily=weather_code,temperature_2m_max,temperature_2m_min,daylight_duration,sunshine_duration&timezone=auto`;

export const useWeatherAPIStore = defineStore('weatherAPI', {
  state: () => ({
    apiLink: API_BASE_URL,

  }),
  actions: {
    async request(method, uri, params = {}) {
      const url = this.apiLink + uri;

      try {

        try {
          const result = await fetch(url, { method, ...params });
          data.value = await result.json();
          response.value = result;
        } catch (ex) {
          error.value = ex;
        } finally {
          loading.value = false;
        }
        return { data, response, error, loading };

      } catch (error) {
        return { error, loading: false };
        
      }
    },
    async get(uri, params) {
      return this.request('GET', uri, params);
    },
    async post(uri, params) {
      return this.request('POST', uri, params);
    },

  },
});
