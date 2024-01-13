<script setup>
import { computed, onMounted, ref, watch} from 'vue';
import {weatherIcon} from '../data/WeatherComp.js';

const props = defineProps({
    selectedNode: { type: Object, required: true },
    weatherData: { type: Object, required: true }
});



  const selectedNode = computed(() => props.selectedNode);
  const weatherData = computed(() => props.weatherData);
  const energyProduction = ref([]);


onMounted(async() => {
  getEnergyProduction();

});



const getEnergyProduction = () => {
  const producedValue = selectedNode.value.energyproduced;
  // 0.22 x 56 = 0.154 kw
  // 56 kvadratmeter 
  // 
  energyProduction.value = (producedValue * 56).toFixed(2);
}

const getEnergyDivision = () => {
  const calc = energyProduction.value / 3
  return calc.toFixed(2)
}

watch(selectedNode, () => {
  getEnergyProduction();
});



</script>

<template>

    <div class="d-flex flex-wrap justify-content-center">
    <div class="m-2 p-4 border rounded">
      <h3>Expected</h3><br>
      <p class="text-muted">Peak power:  {{ energyProduction }}kw </p>
      <p class="text-muted">*Maybe chart if possible</p>
    </div>

    <div class="m-2 p-4 border rounded">
      <h3>Weather</h3><br>
      <!-- {{ weatherData.data }} -->
      <p class="text-muted">Weather:  {{ weatherIcon(selectedNode.weather) }} </p>
      <p class="text-muted" v-if="selectedNode.age === 'current'">Temperature: {{ weatherData.data.daily.temperature_2m_max[0] }}
C</p> 
      <p class="text-muted"  v-if="selectedNode.age === 'current'">Daylight: {{ weatherData.data.daily.daylight_duration[0] }}</p> 
    </div>

    <div class="m-2 p-4 border rounded ">
      <h3>Storage</h3><br>
      <p class="text-muted">Battery:  {{ getEnergyDivision() }}</p>
      <p class="text-muted">Hydrogen:  {{ getEnergyDivision() }}</p>
      <p class="text-muted">Finland:  {{ getEnergyDivision() }}</p>
    </div>

    <div class="m-2 p-4 border rounded">
      <h3>Description</h3><br>
      <p class="text-muted"> {{ selectedNode.age }}</p>
      <p class="text-muted" v-if="selectedNode.age === 'current'"> This description is about current bla bla bla</p>
      <p class="text-muted" v-if="selectedNode.age === 'past'"> I hate cats</p>
      <p class="text-muted" v-if="selectedNode.age === 'future'"> I love god</p>


    </div>

    <div class="m-2 p-4 border rounded">
      <h3>Buttons</h3><br>
      <p class="text-muted">Bla bla bla</p>
      <p class="text-muted">Bla bla bla</p>
    </div>

    <div class="m-2 p-4 border rounded">
      <h3>Electric car</h3><br>
      <p class="text-muted">Bla bla bla</p>
      <p class="text-muted">Bla bla bla</p>
    </div>

    <div class="m-2 p-4 border rounded">
      <h3>Earings</h3><br>
      <p class="text-muted">Bla bla bla</p>
      <p class="text-muted">Bla bla bla</p>
    </div>

    </div>



</template>

<style lang="scss">
.text-muted {
  font-size: .8rem;
}
</style>