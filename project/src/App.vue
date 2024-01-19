<script setup>
import { RouterView, RouterLink } from "vue-router";
import { Transition } from "vue";
import NavComp from "./components/global/NavComp.vue";
import { useDataTypeStore } from "./stores/DataTypeStore";

const udts = useDataTypeStore();

function resetDataType() {
  udts.dataType = "daily";
}
</script>

<template>
  <NavComp />
  <RouterView />

  <div class="container">
    <footer class="text-center">
      <RouterLink
        to="/"
        class="m-2 text-decoration-none text-muted"
        @click="resetDataType()"
        >Home</RouterLink
      >
      <RouterLink to="/about" class="m-2 text-decoration-none text-muted"
        >About</RouterLink
      >
    </footer>
  </div>
</template>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@500&display=swap");

body {
  // Background opacity
  font-family: "Poppins", sans-serif;
  // overflow: hidden; /* Hide scrollbars */
}

::-webkit-scrollbar {
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #888;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
