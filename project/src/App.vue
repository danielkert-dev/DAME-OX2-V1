<script setup>
import { RouterView, RouterLink } from 'vue-router'
import NavComp from './components/global/NavComp.vue'
import { useDataTypeStore } from './stores/DataTypeStore';

const udts = useDataTypeStore();

function resetDataType() {
    udts.dataType = 'daily';
}

</script>

<template>
    <NavComp/>
    <!-- transition name="fade" -->

    <RouterView />

    <div class="container">
    <footer class="text-center pt-2">
        <RouterLink to="/" class="m-2 text-decoration-none text-muted" @click="resetDataType()">Home</RouterLink>
        <RouterLink to="/about" class="m-2 text-decoration-none text-muted">About</RouterLink>
    </footer>
    </div>
</template>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500&display=swap');

body {
    // Background opacity
    font-family: 'Poppins', sans-serif;
}

</style>
