<script setup>
import { onMounted, ref, watch, computed, nextTick } from "vue";

import { useRouter } from "vue-router";
const router = useRouter();
import { useDataTypeStore } from "../../stores/DataTypeStore";
import WpAPIComp from "../../components/global/WpAPIComp.vue";

const udts = useDataTypeStore();
const dataType = ref(udts.dataType);
const firstDate = ref(udts.firstDate);
const lastDate = ref(udts.lastDate);
const selectedDate = ref(udts.selectedDate);

function goToView(dataType) {
  if (dataType === "daily") {
    router.push({ name: "main" });
  } else if (dataType === "monthly") {
    router.push({ name: "monthly" });
  } else if (dataType === "yearly") {
    router.push({ name: "yearly" });
  } else {
    console.error("Invalid data type");
  }
}

/* //@watch
 */

watch(useDataTypeStore(), async () => {
  // console.log(dataType);
  // console.log(udts.firstDate);
  // console.log(udts.selectedDate);

  firstDate.value = udts.firstDate;
  lastDate.value = udts.lastDate;
  selectedDate.value = udts.selectedDate;
});

watch(selectedDate, () => {
  udts.selectedDate = selectedDate.value;
});

// Sets the date of dataType to the current route (Needed to display in nav)
watch(
  () => router.currentRoute.value,
  () => {
    console.log(router.currentRoute.value.name);
    if (router.currentRoute.value.name === "main") {
      dataType.value = "daily";
    } else {
      dataType.value = router.currentRoute.value.name;
    }
  }
);
</script>

<template>
  <nav class="d-flex navbar">
    <div class="ms-2">
      <h4 class="mt-2">
        <img
          style="margin-top: -0.2rem"
          width="45"
          src="https://www.datanom.ax/~kjell/ox2/wp-content/uploads/2024/01/OX2_logo_white-1.png"
        />
        Forecast
      </h4>
      <p class="text-light">Möckelö</p>
    </div>

    <div
      class="d-flex flex-wrap justify-content-center align-content-center"
      v-if="router.currentRoute.value.name !== 'about'"
    >
      <select
        v-model="dataType"
        class="custom-select dark-mode form-select dataTypeSelect m-1"
        style="width: 8rem; height: fit-content"
        @change="goToView(dataType)"
      >
        <option value="daily" :selected="dataType === 'daily'">Daily</option>
        <option value="monthly" :selected="dataType === 'monthly'">Monthly</option>
        <option value="yearly" :selected="dataType === 'yearly'">Yearly</option>
      </select>

      <div v-if="dataType === 'daily'">
        <!-- Diable date selectedData before first date after last date -->
        <input
          type="date"
          v-model="selectedDate"
          :min="firstDate"
          :max="lastDate"
          class="m-1 dark-mode form-control dateSelectDaily d-flex flex-wrap justify-content-center align-content-center"
          style="width: 10rem; height: fit-content"
        />
      </div>

      <div v-if="dataType === 'monthly'">
        <div
          class="d-flex flex-wrap justify-content-center align-content-center"
          v-if="router.currentRoute.value.name !== 'about'"
        >
          <select
            style="width: 8rem; height: fit-content"
            class="custom-select dark-mode form-control dateSelectMonthly mt-1"
          >
            <option>Januari</option>
            <option>Februari</option>
          </select>
        </div>
      </div>
    </div>

    <div class="">
      <WpAPIComp />
    </div>
  </nav>
</template>

<style scoped lang="scss">
$main-color: #616968;
$secondary-color: #004140;
$third-color: #343434;
$text-color: #f8f7f6;

nav {
  width: 100vw;
  background-color: $main-color !important;
  color: $text-color !important;
}

input,
select {
  background-color: $third-color;
  color: $text-color;
  color-scheme: dark;
  border: none;
}

select:focus,
select:active,
input:focus,
input:active {
  background-color: $third-color;
  color: $text-color;
  border: none;
}

.custom-select {
  background: $third-color
    url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 5'%3e%3cpath fill='white' d='M2 0L0 2h4zm0 5L0 3h4z'/%3e%3c/svg%3e")
    no-repeat right 0.75rem center/8px 10px !important;
}
</style>
