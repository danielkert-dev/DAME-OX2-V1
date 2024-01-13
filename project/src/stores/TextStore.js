import { defineStore } from 'pinia'

export const useTextStore = defineStore('text', {
    state: () => ({
        wpText: 'Nothing',
    }),
    actions: {
        setText(input) {
            this.wpText = input
        }
    }
})