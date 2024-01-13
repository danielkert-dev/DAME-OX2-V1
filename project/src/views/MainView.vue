<script setup>
import WpAPIComp from '../components/global/WpAPIComp.vue';
import { useTextStore } from '../stores/TextStore.js';
import { useDataStore } from '../stores/DataStore.js';

useDataStore().setData();

</script>

<template>


<WpAPIComp/>


<!-- {{  console.log(useDataStore().$state) }} -->
<div v-for="text in useDataStore().$state">
    <!-- Display json -->
    {{ text }}
</div>


{{ useTextStore().$state.wpText }}

</template>
