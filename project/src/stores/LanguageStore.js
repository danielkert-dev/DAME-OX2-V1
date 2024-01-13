import { defineStore } from 'pinia'

export const useLanguageStore = defineStore('language', {
    state: () => ({
        language: 'en',
    }),
    actions: {
        setLanguage(input) {
            this.language = input;
        },

        getLanguage() {
            return this.language;
        },
    },

})
