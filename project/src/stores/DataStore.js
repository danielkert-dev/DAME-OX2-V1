import { defineStore } from 'pinia'

export const useDataStore = defineStore('data', {
  state: () => ({
    dataOutput [],
    dataDate: [],
    dataWeather: 'Nothing',
    dataPower: 'Nothing'
  }),
  actions: {
    initData() {
      this.setDate()
      this.setWeather()
      this.setPower()
    },

    setDate() {
      const currentDay = new Date()
      const currentMonth = currentDay.getMonth()
      const currentYear = currentDay.getFullYear()

      // Past 12 months
      for (let i = 11; i >= 0; i--) {
        const date = new Date(currentYear, currentMonth - i, 1)
        this.dataDate.push({
          date: date.toISOString().slice(0, 10),
          type: 'month',
          age: 'past'
        })
      }

      // Past week
      for (let i = 0; i < 7; i++) {
        const date = new Date()
        date.setDate(date.getDate() - i)

        this.dataDate.push({
          date: date.toISOString().slice(0, 10),
          type: 'day',
          age: 'past'
        })
      }

      // Current day
      const today = new Date().toISOString().slice(0, 10)
      this.dataDate.push({
        date: today,
        type: 'day',
        age: 'current'
      })

      // Future week
      for (let i = 0; i < 7; i++) {
        const date = new Date()
        date.setDate(date.getDate() + i)

        this.dataDate.push({
          date: date.toISOString().slice(0, 10),
          type: 'day',
          age: 'future'
        })
      }

      // Future 12 months
      for (let i = 1; i <= 12; i++) {
        const date = new Date(currentYear, currentMonth + i, 1)
        this.dataDate.push({
          date: date.toISOString().slice(0, 10),
          type: 'month',
          age: 'future'
        })
      }

    },

    setWeather() {
      // Implement your logic to set weather data here
    },

    setPower() {
      // Implement your logic to set power data here
    }
  }
})
