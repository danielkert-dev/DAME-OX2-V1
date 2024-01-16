<script setup>
import WpAPIComp from '../components/global/WpAPIComp.vue';
import { useTextStore } from '../stores/TextStore.js';
import { useDataStore } from '../stores/DataStore.js';
import { weatherCodes } from '../components/WeatherCodesComp.js';
import { onMounted, ref, watch, computed, nextTick} from 'vue';
import { GChart } from "vue-google-charts";
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination, Scrollbar } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';


const modules = [Pagination,  Scrollbar];


/* //@ Init
 */

useTextStore().setText();

const dataType = ref('daily');
const dailyData = ref('');
const weeklyData = ref('')
const selectedData = ref('')
const selectedDate = ref('')
const firstDate = ref('')
const lastDate = ref('')
const textData = ref('')
const textList = ref([]);

const selectedSlide = ref('');

const swiperRef = ref(null);

/* //@ On mounted
 */
onMounted(async () => {
    const today = new Date().toISOString().slice(0, 10);
    await useDataStore().setData();
    dailyData.value = await useDataStore().$state.dataOutput;
    weeklyData.value = await useDataStore().$state.dataWeeklyOutput;
    selectedData.value = dailyData.value.find(
        (data) => data.date === today
    );
    selectedDate.value = today;

    firstDate.value = dailyData.value[0].date;
    lastDate.value = dailyData.value[dailyData.value.length - 1].date;

    goToSlide(getIndexFromDate(today));
    // window.addEventListener('resize', () => {getCenter();});
    // console.log(dailyData.value);
    // console.log(weeklyData.value);


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
    const divElements = Array.from(new DOMParser().parseFromString(textData.value, 'text/html').querySelectorAll('div'));
    const innerTextList = divElements.map((div) => div.innerText);
    textList.value = innerTextList;
});


// When chaning day or week it changes the data
watch(dataType, () => {
    selectedDate.value = new Date().toISOString().slice(0, 10);

    if (dataType.value === 'daily') {
        selectedData.value = dailyData.value.find((data) => data.date === selectedDate.value)
        goToSlide(getIndexFromDate(selectedDate.value));
    } else if (dataType.value === 'weekly') {
        selectedData.value = weeklyData.value.find((data) => data.date === selectedDate.value);
        goToSlide(getIndexFromDate(selectedDate.value));
    } else {
        console.error('DataType not found');
    }
});

// Change the data when i pick a date
watch(selectedDate, () => {
    if (dataType.value === 'daily') {
        selectedData.value = dailyData.value.find((data) => data.date === selectedDate.value);
        goToSlide(getIndexFromDate(selectedDate.value));
    } else if (dataType.value === 'weekly') {
        selectedData.value = weeklyData.value.find((data) => data.date === selectedDate.value);
        goToSlide(getIndexFromDate(selectedDate.value));
    } else {
        console.error('DataType not found');
    }
});

// watch window width

// watch(selectedSlide, (newValue) => {

// });

/* //@ Functions
 */

 
/* //! Swift
 */

function getRef (swiperInstance) {
  swiperRef.value = swiperInstance
}

function getIndexFromDate(date) {
  return dailyData.value.findIndex((data) => data.date === date);
}

const goToSlide = (index) => {
  swiperRef.value.slideTo(index);
};

function next () {
  swiperRef.value.slideNext() // should work
}

function prev () {
  swiperRef.value.slidePrev() // should work
}




/* //@ Other* 
*/

function removeYear(date) {
    // 2024-01-01 -> 01-01
    return date.split('-').slice(1).join('-');
}

function convertDate(date) {
    if (!date) {
    return ''; // or handle the case where date is undefined/null
  }
  const months = ['Januari', 'Februari', 'Mär', 'April', 'Maj', 'Juni', 'Juli', 'Augusti', 'September', 'Oktober', 'November', 'December'];
  const year = date.split('-')[0];
  const day = date.split('-')[2];
  return `${year} ${months[parseInt(date.split('-')[1]) - 1]} ${day}`;
}

function removeDashesFromDate(date) {
    // all dashes
    return date.split('-').join(' ');
}

function replaceDashesWithDot(date) {
    // all dashes
    return date.split('-').join('.');
}

function weatherCodeToIcon(code) {
    if (!code) {
    return ''; // or handle the case where date is undefined/null
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
  title: "",
  legend: { position: "bottom" },
  fontName:'Poppins',
  fontSize: 15,
  pieStartAngle: 100,
  colors: ['#e0440e', '#e6693e', '#ec8f6e', '#f3b49f', '#f6c7b6']
});

const chartType = ref("PieChart");


</script>

<template>
    <div class="container">
        <nav class="d-flex justify-content-between pt-2">
        <div>
            <h4 class="mt-2">OX2 Forecast</h4>
            <p class="text-muted">Möckelö</p>
        </div>
        <div class="d-flex justify-content-center">
            <div class="d-flex flex-wrap justify-content-center">
            <select v-model="dataType" class="form-select m-2 dataTypeSelect" style="width: 8rem; height: fit-content">
                <option value="daily" selected>Daily</option>
                <option value="monthly" disabled>Monthly</option>
                <option value="yearly" disabled>Yearly</option>
            </select>



            <div v-if="dataType === 'daily'">
                <!-- Diable date selectedData before first date after last date -->
                <input type="date" v-model="selectedDate"
                 :min="firstDate" :max="lastDate"
                 class="form-control m-2 dateSelectDaily" style="width: 10rem; height: fit-content" />
            </div>

            <div v-else-if="dataType === 'weekly'">
                <select v-model="selectedDate" class="form-select m-2" style="width: 16rem; height: fit-content">
                    <option v-for="data in weeklyData" :key="data.date" :value="data.date">
                        {{ data.startDate }} - {{ data.endDate }}
                    </option>
                    </select>
            </div>

        </div>
        </div>
        <div class="">
            <WpAPIComp />
        </div>

        </nav>

        <div class="mt-2 dateInfo text-muted">
                <p class="card-title">{{ convertDate(selectedData.date) }}</p>
                <p class="card-text weatherText">{{ selectedData.temperature}}°C <img class="weatherImage rounded" :src="weatherCodeToIcon(selectedData.weather)" alt="" width="25" height="25"> </p>
                </div>

<!--   :scrollbar="{ hide: true, dragSize: '50%', draggable: true, snapOnRelease: true }" -->
<swiper
  ref='{swiperRef}'
:slidesPerView="20"
  :spaceBetween="0"
  :centeredSlides="true"
  :pagination="false" 
  :modules="modules"
  @slideChange="selectedSlide = $event.activeIndex; selectedDate = dailyData[$event.activeIndex].date;"
  @swiper="getRef"
  class="mySwiper"
>   

      <template v-for="(data, index) in dailyData" :key="data.date">
        <!-- if not active then notActiveSlide class -->
        <swiper-slide class="mySlide d-flex align-items-end justify-content-center" :class="{ activeSlide: index === selectedSlide, notActiveSlide: index !== selectedSlide }"
         :id="data.date">
          <div class="mySlideData  d-flex align-items-end justify-content-center rounded" :style="{ 
            backgroundColor: `hsl(${Math.floor(Math.random() * 360)}, 20%, 80%)`, 
            height: `${(data.energyKWh * 3)}px`,
            }">
            <p class="mySliderDate text-center">{{ replaceDashesWithDot(removeYear(data.date)) }} </p>
          </div>
        </swiper-slide>
      </template>
    </swiper>


    <div class="d-flex w-100 justify-content-center">
    <button @click="prev()" class="append-buttons btn"><</button>
    <button @click="next()" class="append-buttons btn ">></button>
    </div>
<!-- {{ selectedSlide }}
{{ selectedDate }}
{{ dailyData[1] }} -->

<!-- or ul.my-slider > li -->

        <div class="">
            <div class="mainBox">

                <br><br>

                <div class="row w-100 d-flex justify-content-between mx-auto g-4">

                <div class="rounded col-md-3 p-3 infoBox">
                    <p class="w-100 text-center">⚡</p>
                <p class="card-text text-center">{{ selectedData.energyKWh}}KWH</p>
                </div>

                <div class="rounded col-md-3 p-3 infoBox">
                    <p class="w-100 text-center">⛽</p>
                <p class="card-text text-center">Nan Hydrogen</p>
                </div>

                
                <div class="rounded col-md-3 p-3 infoBox">
                    <p class="w-100 text-center">🔋</p>
                <p class="card-text text-center"> 100% Battery</p>
                </div>


                <div class="row">
                    <div class="col-md-6 p-3">
                        <!-- When all the data is available -->
                <GChart
      :type="chartType"
      :data="chartData"
      :options="chartOptions"
    ></GChart>
    </div>

        <div class="col-md-6 p-5">
            <h1>Description</h1>
            <br><br>
            <!-- From wordpress add text with integrated data -->
            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Rem officia eligendi, nulla facere eveniet provident. </p>
        </div>

                </div>

                </div>
                </div>
        </div> 
    </div>


</template>

<style lang="scss">

$main-color : #416661;
$secondary-color : #004140;
$third-color : #343434;
$text-color: #F8F7F6;

.dateInfo {
    font-size: .8rem;
    position: absolute;
    z-index: 4;
    top: 8rem;
    width: 20rem;
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
    background-image: linear-gradient(90deg, rgba(255, 255, 255, 1) 0%, rgba(0, 0, 0, 0) 20%);
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
    background-image: linear-gradient(-90deg, rgba(255, 255, 255, 1) 0%, rgba(0, 0, 0, 0) 20%);
    z-index: 10;
    /* Dont interact */
    pointer-events: none;
}


.mySlideData {
    min-height: 10%;
    max-height: 100%;
    margin-left: .5rem;
    margin-right: .5rem;
    margin-bottom: 4rem;
    width: 100%;
}

/* media width */
@media screen and (max-width: 1150px) {

    .dataTypeSelect {
        width: 100%;
    }

    .dateSelectDaily{
        width: 100%;
    }

    .mySwiper{
        height: 18rem;
    }

    .mySlideData {
        width: 50%;
    }

    .mySliderDate{
        opacity: 0;
    }
}

.mySliderDate{
    margin-bottom: -3rem;
    text-wrap:nowrap;
    text-align: center;
}


.mySlide {
    width: 5% !important; 
    user-select: none;
}

.activeSlide {
  /* Apply your desired styles to highlight the active slide */
  border-radius: .2rem;
}

.notActiveSlide {
    opacity: .3;
}


/* Data */



.mainBox {
}

.infoBox{
    background-color: $text-color;
}

</style>