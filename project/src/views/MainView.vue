<script setup>
import WpAPIComp from '../components/global/WpAPIComp.vue';
import { useTextStore } from '../stores/TextStore.js';
import { useDataStore } from '../stores/DataStore.js';
import { onMounted, ref, watch } from 'vue';

/* //@ Init
 */

useTextStore().setText();

const selectedDate = ref('');
const selectedData = ref('');
const textData = ref('')
const dataType = ref('daily');
const textList = ref([]);
let selectedDataList = ref([]);



/* //@ On mounted
 */
onMounted(async () => {
    await useDataStore().setData();

    // It changes the selected date and the selected data on load
    await initSelectedData(new Date().toISOString().split('T')[0]);

    if (dataType.value === 'daily') {
        selectedDataList.value = await useDataStore().$state.dataOutput;
        await setSelectedData();
    } else if (dataType.value === 'weekly') {
        selectedDataList.value = await useDataStore().$state.dataWeeklyOutput;
        await setSelectedData();
    } else if (dataType.value === 'monthly') {
        selectedDataList.value = await useDataStore().$state.dataMonthlyOutput;
        await setSelectedData();
    } else {
        selectedDataList.value = [];
    }

});

/* //@ Watch
 */

watch(useTextStore(), async () => {
    textData.value = await useTextStore().$state.wpText[0].content.rendered;

    const divElements = Array.from(new DOMParser().parseFromString(textData.value, 'text/html').querySelectorAll('div'));
    const innerTextList = divElements.map((div) => div.innerText);

    // Select specific id's like this: <div id="energy-watt">Text</div> and <div id="energy-kwh">Text</div> and put them in an array

    // const energyWatt = innerTextList.filter((text) => text.includes('Watt'));

    textList.value = innerTextList;
});

watch(dataType, async () => {
    await initSelectedData(selectedDate.value);
    if (dataType.value === 'daily') {
        selectedDataList.value = await useDataStore().$state.dataOutput;
        selectedData.value = selectedDataList.value.find((data) => data.date === selectedDate.value);
    } else if (dataType.value === 'weekly') {
        selectedDataList.value = await useDataStore().$state.dataWeeklyOutput;
        selectedData.value = selectedDataList.value.find((data) => data.date === selectedDate.value);
    } else if (dataType.value === 'monthly') {
        selectedDataList.value = await useDataStore().$state.dataMonthlyOutput;
        selectedData.value = selectedDataList.value.find((data) => data.date === selectedDate.value);
    } else {
        selectedDataList.value = [];
    }
    console.log(dataType.value);
});

watch(selectedDate, () => {
  selectedData.value = selectedDataList.value.find((data) => data.date === selectedDate.value);
});

watch(selectedDataList, () => {
  selectedData.value = selectedDataList.value.find((data) => data.date === selectedDate.value);
});


/* //@ Functions / Computed
 */

 async function setSelectedData() {
    selectedData.value = selectedDataList.value.find((data) => data.date === selectedDate.value);
}

 function initSelectedData(date) {
  selectedDate.value = date;

  if (dataType.value === 'daily') {
    selectedData.value = selectedDataList.value.find((data) => data.date === selectedDate.value);
  } else if (dataType.value === 'weekly') {
    selectedData.value = selectedDataList.value.find((data) => data.date === selectedDate.value);
  } else if (dataType.value === 'monthly') {
    selectedData.value = selectedDataList.value.find((data) => data.date === selectedDate.value);
  }
}



</script>

<template>
    <div class="container">
        <nav class="d-flex justify-content-between mt-2">
        <div>
            <h4 class="">OX2 Forecast</h4>
            <p class="text-muted">Möckelö</p>
        </div>
        <div class="d-flex justify-content-center">
            <div class="d-flex flex-wrap justify-content-center">
            <select v-model="dataType" class="form-select m-2" style="width: 8rem; height: fit-content">
                <option value="daily" selected>Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly" disabled>Monthly</option>
            </select>

            <!-- ... your existing code ... -->

            <select v-model="selectedDate" class="form-select m-2" style="width: 16rem; height: fit-content">
                <!-- Update selected data based on the dataType -->
                <!-- Select the closest to today or if day then today -->
                <option v-for="data in selectedDataList" :key="data.date" :value="data.date" :selected="data.date === selectedDate">
                    <div v-if="dataType === 'daily'">
                    {{ data.date }}
                    </div>
                    <div v-if="dataType === 'weekly'">
                    {{ data.startDate }} - {{ data.endDate }}
                    </div>
                    
                    </option>
            </select>
        </div>
        </div>
        <div class="">
            <WpAPIComp />
        </div>

        </nav>


        <!-- Background image from assets images -->
        <div class="my-5 p-5 d-flex justify-content-center align-content-center border rounded w-100"
        style="cover; background-size: cover; background-position: center; background-repeat: no-repeat; background-attachment: fixed; background-size: 55rem 10rem; background-position-x: 50%; background-position-y: 6.5rem;"
        :style=" `background-image: url(https://danielkertdev.pockethost.io/api/files/1lwpjj9b3z5a50y/m0bz450hkf3u0pm/capture_azxqSFU3Lz.JPG?token=);`">
            The selectable graph
        </div>

        <div class="text-center">
            <div class="card">
                <div class="card-body text-start">

                <div v-if="dataType === 'daily'">
                <h3>{{ selectedDate }}</h3>
                <br>
                <div class="my-2">{{ textList[0] }}:  <span class="text-muted">{{ selectedData.energyW }}W</span></div>
                <div class="my-2">{{ textList[1] }}:  <span class="text-muted">{{ selectedData.energyKWh }}kWh</span></div>
                <div class="my-2">{{ textList[2] }}:  <span class="text-muted">{{ selectedData.sunshine }}</span></div>
                </div>

                <div v-if="dataType === 'weekly'">
                <h3>{{ selectedData.startDate }} - {{ selectedData.endDate }}</h3>
                <br>
                <div class="my-2">{{ textList[0] }}:  <span class="text-muted">{{ selectedData.averageEnergyW }}W</span></div>
                <div class="my-2">{{ textList[1] }}:  <span class="text-muted">{{ selectedData.averageEnergyKWh }}kWh</span></div>
                <div class="my-2">{{ textList[2] }}:  <span class="text-muted">{{ selectedData.sunshine }}</span></div>
                </div> 
                

                <br><br><br><br><br>
                {{ selectedData }}
                
                </div>
            </div>
        </div>


    </div>
</template>
