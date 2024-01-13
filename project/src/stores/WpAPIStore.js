import { defineStore } from 'pinia';

const API_BASE_URL = 'https://www.datanom.ax/~kjell/ox2/wp-json/wp/v2/';

export const useWpAPIStore = defineStore('wpAPI', {
  state: () => ({
    apiLink: API_BASE_URL,
  }),
  actions: {
    async fetchData(endpoint, queryParams) {
      const url = `${this.apiLink}${endpoint}${queryParams ? `?${queryParams}` : ''}`;

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
  },
  getters: {},
});
