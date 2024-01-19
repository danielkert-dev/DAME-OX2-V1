<script setup>
import { onMounted, ref, watch, computed, nextTick } from "vue";

import { weatherCodes } from "../components/WeatherCodesComp.js";

import { useTextStore } from "../stores/TextStore.js";
import { useDataStore } from "../stores/DataStore.js";
import { useDataTypeStore } from "../stores/DataTypeStore";

import { GChart } from "vue-google-charts";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Pagination, Scrollbar } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

const modules = [Pagination, Scrollbar];

/* //@ Init
 */

useTextStore().setText();

const udts = useDataTypeStore();
// const dataType = 'daily';
const dataType = udts.dataType;
const dailyData = ref("");
const selectedData = ref("");
const selectedDate = ref("");
const firstDate = ref("");
const lastDate = ref("");

const textData = ref("");
const textList = ref([]);

const selectedSlide = ref("");

const swiperRef = ref(null);

/* //@ On mounted
 */
onMounted(async () => {
  const today = new Date().toISOString().slice(0, 10);
  await useDataStore().setData();
  dailyData.value = await useDataStore().$state.dataOutput;
  selectedData.value = dailyData.value.find((data) => data.date === today);
  selectedDate.value = udts.selectedDate;

  firstDate.value = dailyData.value[0].date;
  lastDate.value = dailyData.value[dailyData.value.length - 1].date;

  udts.selectedDate = today;
  udts.firstDate = dailyData.value[0].date;
  udts.lastDate = dailyData.value[dailyData.value.length - 1].date;

  console.log(udts.firstD);

  // await useDataTypeStore().firstDate = dailyData.value[0].date;
  // await useDataTypeStore().lastDate = dailyData.value[dailyData.value.length - 1].date;

  goToSlide(getIndexFromDate(today));
  // window.addEventListener('resize', () => {getCenter();});
  // console.log(dailyData.value);

  accuracyData.value = [
    ["Name", "Accuracy"],
    ["Accuracy", { v: selectedData.value.accuracy, f: "90%" }],
    ["Rest", { v: 100 - 100 * (selectedData.value.accuracy / 100), f: "10%" }],
  ];

  nextTick(() => {
    if (swiperRef.value && swiperRef.value.swiper) {
      swiperRef.value.swiper.update();
    }
  });
});

/* //@ Watch
 */

watch(useTextStore(), async () => {
  textData.value = await useTextStore().$state.wpText[0].content.rendered;
  const divElements = Array.from(
    new DOMParser().parseFromString(textData.value, "text/html").querySelectorAll("div")
  );
  const innerTextList = divElements.map((div) => div.innerText);
  textList.value = innerTextList;
});

watch(useDataTypeStore(), async () => {
  // console.log(dataType);
  // console.log(udts.firstDate);
  // console.log(udts.selectedDate);

  firstDate.value = udts.firstDate;
  lastDate.value = udts.lastDate;
  selectedDate.value = udts.selectedDate;

  accuracyData.value = [
    ["Name", "Accuracy"],
    ["Accuracy", { v: selectedData.value.accuracy, f: "90%" }],
    ["Rest", { v: 100 - 100 * (selectedData.value.accuracy / 100), f: "10%" }],
  ];

  chartData.value = [
    ["Type", "KWH"], // Add a new column for colors
    ["Elnät", selectedData.value.energyKWh / 2], // Use color1 for the first slice
    ["Vätegas", selectedData.value.energyKWh / 5], // Use color2 for the second slice
    ["Batteri", selectedData.value.energyKWh / 5], // Use color3 for the third slice
  ];

  if (selectedData.value.energyKWh == 0.0) {
    chartData.value = [
      ["Type", "KWH"], // Add a new column for colors
      ["No energy", 0.00001], // Use color1 for the first slice
    ];
  }
});

// Change the data when i pick a date
watch(selectedDate, () => {
  udts.selectedDate = selectedDate.value;

  if (dataType === "daily") {
    selectedData.value = dailyData.value.find((data) => data.date === selectedDate.value);
    goToSlide(getIndexFromDate(selectedDate.value));
  } else {
    console.error("DataType not found");
  }
});

/* //@ Functions
 */

/* //! Swift
 */

function getRef(swiperInstance) {
  swiperRef.value = swiperInstance;
}

function getIndexFromDate(date) {
  return dailyData.value.findIndex((data) => data.date === date);
}

const goToSlide = (index) => {
  swiperRef.value.slideTo(index);
};

function next() {
  swiperRef.value.slideNext(); // should work
}

function prev() {
  swiperRef.value.slidePrev(); // should work
}

/* //@ Other*
 */

function removeYear(date) {
  // 2024-01-01 -> 01-01
  return date.split("-").slice(1).join("-");
}

function convertDate(date) {
  if (!date) {
    return ""; // or handle the case where date is undefined/null
  }
  const months = [
    "Januari",
    "Februari",
    "Mär",
    "April",
    "Maj",
    "Juni",
    "Juli",
    "Augusti",
    "September",
    "Oktober",
    "November",
    "December",
  ];
  const year = date.split("-")[0];
  const day = date.split("-")[2];
  return `${year} ${months[parseInt(date.split("-")[1]) - 1]} ${day}`;
}

// function removeDashesFromDate(date) {
//     // all dashes
//     return date.split('-').join(' ');
// }

function replaceDashesWithDot(date) {
  // all dashes
  return date.split("-").join(".");
}

function weatherCodeToIcon(code) {
  if (!code) {
    return ""; // or handle the case where date is undefined/null
  }
  const weatherCode = weatherCodes[0][code];
  return weatherCode.day.image;
}

/* chart*/
const chartData = ref([
  ["Type", "KWH"], // Add a new column for colors
  ["Elnät", 100], // Use color1 for the first slice
  ["Vätegas", 20], // Use color2 for the second slice
  ["Batteri", 20], // Use color3 for the third slice
]);

const chartOptions = ref({
  //    title: "KWH",
  titleTextStyle: { alignment: "center" },
  legend: { position: "left", alignment: "center" },
  //   chartArea: {left: 0},

  backgroundColor: { fill: "transparent" },
  fontName: "Poppins",
  fontSize: 15,
  height: 200,
  pieSliceText: "value",
  pieStartAngle: 100,
  // Energy color, Hydrogen color, Battery color
  colors: ["#5f9ea0", "#d9ead3", "#f9dc5c", "#f3b49f", "#f6c7b6"],
});

const chartType = ref("PieChart");

const accuracyData = ref([
  ["Name", "Accuracy"],
  ["Accuracy", { v: selectedData.accuracy, f: "90%" }],
  ["Rest", { v: 0.1, f: "10%" }],
]);
const accuracyOptions = ref({
  pieHole: 0.85,
  chartArea: { width: "80%", height: "80%" },
  height: 100,
  pieStartAngle: 0,
  pieSliceText: "value",
  backgroundColor: { fill: "transparent" },
  pieSliceTextStyle: {
    color: "black",
  },
  legend: "none",
  pieSliceBorderColor: "transparent",
  slices: {
    0: { color: "green", textStyle: { color: "transparent" } },
    1: { color: "transparent", textStyle: { color: "transparent" } },
  },
});

const accuracyType = ref("PieChart");
</script>

<template>
  <div class="container">
    <p class="w-100 dateTop text-muted">
      {{ convertDate(selectedData.date) }} <br />
      {{ selectedData.age }}
    </p>

    <!--   :scrollbar="{ hide: true, dragSize: '50%', draggable: true, snapOnRelease: true }" -->
    <!-- Clickable sliders -->
    <swiper
      ref="{swiperRef}"
      :slidesPerView="20"
      :spaceBetween="0"
      :centeredSlides="true"
      :mousewheel="true"
      :pagination="false"
      :modules="modules"
      @slideChange="
        selectedSlide = $event.activeIndex;
        selectedDate = dailyData[$event.activeIndex].date;
      "
      @swiper="getRef"
      class="mySwiper"
    >
      <template v-for="(data, index) in dailyData" :key="data.date">
        <!-- if not active then notActiveSlide class -->
        <swiper-slide
          class="mySlide d-flex align-items-end justify-content-center"
          :class="{
            activeSlide: index === selectedSlide,
            notActiveSlide: index !== selectedSlide,
          }"
          :id="data.date"
        >
          <div
            class="mySlideData d-flex align-items-end justify-content-center rounded"
            :style="{
              backgroundColor: `hsl(${Math.floor(Math.random() * 360)}, 20%, 80%)`,
              height: `${data.energyKWh * 3}px`,
            }"
          >
            <p class="mySliderDate text-center">
              {{ replaceDashesWithDot(removeYear(data.date)) }}
            </p>
          </div>
        </swiper-slide>
      </template>
    </swiper>

    <div class="d-flex w-100 justify-content-center">
      <button @click="prev()" class="append-buttons btn" style="font-size: 1.5rem">
        <
      </button>
      <buton @click="next()" class="append-buttons btn" style="font-size: 1.5rem"
        >></buton
      >
    </div>
    <!-- {{ selectedSlide }}
{{ selectedDate }}
{{ dailyData[1] }} -->

    <!-- or ul.my-slider > li -->

    <div class="">
      <div class="mainBox mt-1">
        <div class="row w-100 d-flex justify-content-between mx-auto g-4">
          <div
            class="rounded col-md-3 p-3 infoBox d-flex justify-content-center align-content-center"
          >
            <div class="d-flex flex-column justify-content-center align-content-center">
              <img
                class="weatherImage rounded mx-auto"
                :src="weatherCodeToIcon(selectedData.weather)"
                alt=""
              />
              <p class="card-text weatherText text-center mt-3">
                {{ selectedData.temperature }}°C
              </p>
            </div>
          </div>

          <div
            class="rounded col-md-3 p-3 infoBox d-flex justify-content-center align-content-center"
          >
            <div class="d-flex flex-column justify-content-center align-content-center">
              <p class="w-100 text-center" style="font-size: 2rem; margin-bottom: 0.5rem">
                ⚡
              </p>
              <p class="card-text text-center mt-4" style="margin-bottom: -1rem">
                {{ selectedData.energyKWh }}KWH
              </p>
            </div>
          </div>

          <div class="rounded col-md-3 px-3 infoBox">
            <p class="card-text text-center accuracyNumber">
              {{ selectedData.accuracy }}%
            </p>
            <GChart
              class="accuracyChart"
              :type="accuracyType"
              :data="accuracyData"
              :options="accuracyOptions"
            ></GChart>
            <p class="text-center">Accuracy</p>
          </div>

          <div class="row mx-auto">
            <div class="col-md-6 p-3">
              <!-- When all the data is available -->
              <!-- <p class="pieTitle">KWH</p> -->
              <GChart
                class="shareChart"
                :type="chartType"
                :data="chartData"
                :options="chartOptions"
              ></GChart>
            </div>

            <div class="col-md-6 p-5">
              <h1>Description</h1>
              <br /><br />
              <!-- From wordpress add text with integrated data -->
              <p>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Rem officia
                eligendi, nulla facere eveniet provident.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- {{ selectedData }} -->
  <!-- {{ textList }} -->
</template>

<style lang="scss">
$main-color: #416661;
$secondary-color: #004140;
$third-color: #343434;
$text-color: #f8f7f6;

.dateTop {
  height: 0;
  z-index: 100;
}

.mySwiper {
  height: 20rem;
}

.mySwiper::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: linear-gradient(
    90deg,
    rgba(255, 255, 255, 1) 0%,
    rgba(0, 0, 0, 0) 20%
  );
  z-index: 10;
  pointer-events: none;
}

.mySwiper::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: linear-gradient(
    -90deg,
    rgba(255, 255, 255, 1) 0%,
    rgba(0, 0, 0, 0) 20%
  );
  z-index: 10;
  /* Dont interact */
  pointer-events: none;
}

.mySlideData {
  min-height: 10%;
  max-height: 100%;
  margin-left: 0.5rem;
  margin-right: 0.5rem;
  margin-bottom: 4rem;
  width: 100%;
}

/* media width */
@media screen and (max-width: 1150px) {
  .dataTypeSelect {
    width: 100%;
  }

  .dateSelectDaily {
    width: 100%;
  }

  .mySwiper {
    height: 18rem;
  }

  .mySlideData {
    width: 50%;
  }

  .mySliderDate {
    opacity: 0;
  }

  .mySlideData {
    margin-bottom: 1rem;
  }
}

.mySliderDate {
  margin-bottom: -3rem;
  text-wrap: nowrap;
  text-align: center;
}

.mySlide {
  width: 5% !important;
  user-select: none;
}

.activeSlide {
  /* Apply your desired styles to highlight the active slide */
  border-radius: 0.2rem;
}

.notActiveSlide {
  opacity: 0.3;
}

/* Data */
.accuracyNumber {
  font-size: 1.4rem;
  color: green;
  translate: 2px 50px;
  height: 0;
  margin-left: auto;
  margin-right: auto;
}

.accuracyChart {
  margin-left: auto;
  margin-right: auto;
}

.weatherImage {
  width: 5rem;
  height: 5rem;
  // background-color: $main-color;
}

.infoBox {
  background-color: $text-color;
}

.shareChart {
  margin-top: 2rem;
}
</style>
