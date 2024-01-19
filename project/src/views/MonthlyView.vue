<script setup>
import { onMounted, ref, watch, computed, nextTick } from "vue";

import { useTextStore } from "../stores/TextStore.js";
import { useDataStore } from "../stores/DataStore.js";
import { useDataTypeStore } from "../stores/DataTypeStore";

import { Swiper, SwiperSlide } from "swiper/vue";
import { Pagination, Scrollbar } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

const modules = [Pagination, Scrollbar];

useTextStore().setText();

// data type to determine what page it is on
// const udts = useDataTypeStore()
// // const dataType = 'daily';
// const dataType = udts.dataType;
const monthlyData = ref("");
// const selectedData = ref('')
// const selectedDate = ref('')
// const firstDate = ref('')// const lastDate = ref('')

// const textData = ref('')
// const textList = ref([]);

// const selectedSlide = ref('');

// const swiperRef = ref(null);

onMounted(async () => {
  monthlyData.value = await useDataStore().$state.dataMonthlyOutput;
});
</script>

<template>
  <img
    style="width: 100%; margin-top: -1rem"
    src="https://www.datanom.ax/~kjell/ox2/wp-content/uploads/2024/01/Namnlos-1024x614.png"
  />
  {{ monthlyData }}
</template>
