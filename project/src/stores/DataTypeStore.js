import { defineStore } from 'pinia';

export const useDataTypeStore = defineStore('dataType', {
    state: () => ({
        dataType: 'daily',
        selectedDate: new Date().toISOString().slice(0, 10),
        firstDate: '',
        lastDate: '',
    }),
    actions: {

        
    }
})