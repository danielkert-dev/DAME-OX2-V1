// store.js
import { defineStore } from 'pinia';
import { ref } from 'vue';

const data = ref(null);
const response = ref(null);
const error = ref(null);
const loading = ref(true);

const API_BASE_URL = 'https://www.datanom.ax/~kjell/ox2/wp-json/wp/v2/';

export const useWpAPIStore = defineStore('wordpressAPI', {
  state: () => ({
    apiLink: API_BASE_URL,
  }),
  actions: {
    async request(method, uri, params = {}) {
      const url = this.apiLink + uri;
      this.wpLoading = true;

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

        this.wpError = error;
        this.wpLoading = false;
        return { error, loading: false };
        
      }
    },
    async get(uri, params) {
      return this.request('GET', uri, params);
    },
    async post(uri, params) {
      return this.request('POST', uri, params);
    },
    async head(uri, params) {
      return this.request('HEAD', uri, params);
    },
  },
});
