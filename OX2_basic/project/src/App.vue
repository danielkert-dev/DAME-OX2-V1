<script setup>
import {useWpAPIStore} from './stores/WpAPIStore.js'
import {useWeatherAPIStore} from './stores/WeatherAPIStore.js'
import NavComp from './components/global/NavComp.vue';
import DataComp from './components/widgets/DataComp.vue';
import NodeComp from './components/widgets/NodeComp.vue';
import { onMounted, ref, nextTick, watch } from 'vue';

const wpAPI = useWpAPIStore();
const weatherAPI = useWeatherAPIStore();
const postData = ref([]);
const categoriesID = {
  "sv": 31,
  "en": 9
}
const nodes = ref([]);
const selectedNode = ref([]);
const weatherData = ref([]);
const selectedLanguage = ref('en');


onMounted(async () => {
  await fetchData();


  const container = document.querySelector('.date-container');
  const observer = new ResizeObserver(updateCenteredNode);
  observer.observe(container);
});

const removePreTags = (content) => {
  const preRegex = /<pre.*?>(.*?)<\/pre>/s;
  const match = content.match(preRegex);
  return match ? JSON.parse(match[1]) : [];
};

const updateCenteredNode = () => {
  const container = document.querySelector('.date-container');
  const nodeElements = document.querySelectorAll('.node');

  const containerCenter = container.scrollLeft + container.offsetWidth / 2;

  nodeElements.forEach(nodeElement => {
  const nodeLeft = nodeElement.offsetLeft;
  const nodeRight = nodeLeft + nodeElement.offsetWidth;

  const tolerance = window.innerWidth / 2 * .22; // Adjust as needed
  if (nodeLeft - tolerance <= containerCenter && nodeRight >= containerCenter) {
    selectedNode.value = nodes.value.find(node => node.date === nodeElement.id);
  } 
});
};

watch(() => postData.value, () => {
  const container = document.querySelector('.date-container');
  container.addEventListener('scroll', updateCenteredNode);
});

const handleLanguageChange = (event) => {
  selectedLanguage.value = event.target.value;
  // Perform additional actions if needed
  fetchData();

}

const fetchData = async () => {
  postData.value = await wpAPI.get('posts/?categories=' + categoriesID[selectedLanguage.value] + '&per_page=100', {});
  console.log('API Response:', postData.value);
  const post = postData.value.data.find(post => post.title.rendered === 'forecast-dummy-data-1');
  if (post) {
    nodes.value = removePreTags(post.content.rendered);
  }

  weatherData.value = await weatherAPI.get('', {});

  await nextTick();
  updateCenteredNode();
  console.log('posts:', postData.value);
};


</script>

<template>

<div class="container">
  <nav class="nav navbar">
    <div class="">
      <h1>OX2 Forecast</h1>
      <h5 class="text-muted ">Möckelö</h5>
    </div>

    <select class="form-select" style="width: 5rem;" @change="handleLanguageChange">
      <option value="en" :selected="selectedLanguage === 'en'">En</option>
      <option value="sw" :selected="selectedLanguage === 'sw'">Sw</option>
      <!-- Add more options for other languages if needed -->
    </select>
  </nav>
  <!-- {{ selectedLanguage }} -->
  <NavComp @handleLanguageChange="handleLanguageChange" :selectedLanguage="selectedLanguage"/>
  <NodeComp :nodes="nodes" :selectedNode="selectedNode" :postData="postData" />
  <DataComp :weatherData="weatherData" :selectedNode="selectedNode" />


</div> 
</template>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500&display=swap');

body {
  font-family: 'Poppins', sans-serif;
}



</style>