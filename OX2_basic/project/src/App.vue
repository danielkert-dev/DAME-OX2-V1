<script setup>
import ScrollComp from './components/widgets/ScrollComp.vue';
import {useWpAPIStore} from './stores/WpAPIStore.js'
import { onMounted, ref } from 'vue';

const wpAPI = useWpAPIStore();
const post1 = ref([]);

onMounted(async () => {
  post1.value = await wpAPI.get('posts', {});
});

console.log(post1.value);

</script>

<template>


<div class="container">
  <br>
<nav class="nav navbar">
  <div class="">
<h1>OX2 Forecast</h1>
<h5 class="text-muted ">Möckelö</h5>
</div>

<input class="form-control" type="text" :placeholder="'Search... ' + new Date().toJSON().slice(0, 10) " aria-label="Search" style="width: 50%;">

<select class="form-select" style="width: 10%;">
  <option value="" selected>English</option>
  <option value="">Swedish</option>
  <option value="">Finnish</option>
</select>
</nav>

<ScrollComp/>



</div>

</template>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500&display=swap');

body {
  font-family: 'Poppins', sans-serif;
}

</style>