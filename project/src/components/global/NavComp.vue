<script setup>
import { onMounted, ref, watch, computed, nextTick} from 'vue';

import { useRouter } from 'vue-router';
const router = useRouter();
import { useDataTypeStore } from '../../stores/DataTypeStore';
import WpAPIComp from '../../components/global/WpAPIComp.vue';


const udts = useDataTypeStore();
const dataType = ref(udts.dataType);
const firstDate = ref(udts.firstDate)
const lastDate = ref(udts.lastDate)
const selectedDate = ref(udts.selectedDate)



function goToView(dataType) {
  if (dataType === 'daily') {
    router.push({ name: 'main' });
  } else if (dataType === 'monthly') {
    router.push({ name: 'monthly' });
  } else if (dataType === 'yearly') {
    router.push({ name: 'yearly' });
  } else {
    console.error('Invalid data type');
  }
}

/* //@watch
*/

watch(useDataTypeStore(), async() => {
    // console.log(dataType);
    // console.log(udts.firstDate);
    // console.log(udts.selectedDate);

    firstDate.value = udts.firstDate
    lastDate.value = udts.lastDate
    selectedDate.value = udts.selectedDate
});

watch(selectedDate, () => {
    udts.selectedDate = selectedDate.value
});

// Sets the date of dataType to the current route (Needed to display in nav)
watch(() => router.currentRoute.value, () => {
  console.log(router.currentRoute.value.name);
  if (router.currentRoute.value.name === 'main') {
      dataType.value = 'daily'
  } else {
    dataType.value = router.currentRoute.value.name
  }
});



</script>

<template>

<nav class="d-flex justify-content-between mx-4">
        <div>
            <h4 class="mt-2"><img 
            style="margin-top: -.2rem"
            width="45"
            src="https://www.datanom.ax/~kjell/ox2/wp-content/uploads/2024/01/ox2-logo-black-1024x414.png">
                 Forecast</h4>
            <p class="text-muted">Möckelö</p>
        </div>

            
            <div class="d-flex flex-wrap justify-content-center" v-if="router.currentRoute.value.name !== 'about'">
            <select v-model="dataType" class="form-select m-2 dataTypeSelect" style="width: 8rem; height: fit-content"
            @change="goToView(dataType)">
                <option value="daily" :selected="dataType === 'daily'">Daily</option>
                <option value="monthly" :selected="dataType === 'monthly'">Monthly
                </option>
                <option value="yearly" :selected="dataType === 'yearly'">Yearly</option>
            </select>



            <div v-if="dataType === 'daily'">
                <!-- Diable date selectedData before first date after last date -->
                <input type="date" v-model="selectedDate"
                 :min="firstDate" :max="lastDate"
                 class="form-control m-2 dateSelectDaily" style="width: 10rem; height: fit-content" />
            </div>

            <div v-if="dataType === 'monthly'">
                <select class="form-control m-2 dateSelectMonthly">
                    <option> test</option>
                </select>
            </div>


        </div>
        
        <div class="">
            <WpAPIComp />
        </div>

        </nav>

    
</template>