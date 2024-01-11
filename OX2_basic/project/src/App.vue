<script setup>
import {useWpAPIStore} from './stores/WpAPIStore.js'
import { onMounted, ref, nextTick, watch } from 'vue';

const wpAPI = useWpAPIStore();
const postData = ref([]);
const categoriesID = {
  "sv": 31,
  "en": 9
}

const nodes = ref([]);
const selectedNode = ref([]);


onMounted(async () => {
  postData.value = await wpAPI.get('posts/?categories=' + categoriesID.en + '&per_page=100', {});
  console.log(postData.value.data.find( post => post.title.rendered === 'forecast-dummy-data-1' ).content.rendered);
  const post = postData.value.data.find(post => post.title.rendered === 'forecast-dummy-data-1');
  if (post) {
    nodes.value = removePreTags(post.content.rendered);
  }

  await nextTick();
  updateCenteredNode();
  const container = document.querySelector('.date-container');
  if (container) {
    // Make sure the container is scrollable by checking if the scroll width
    // is greater than the client width
    if (container.scrollWidth > container.clientWidth) {
      container.addEventListener('scroll', () => console.log('scroll'));
    } else {
      console.error('The .date-container is not scrollable');
    }
  } else {
    console.error('The .date-container element does not exist');
  }

  scrollToToday();
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

  const tolerance = 200; // Adjust as needed
  if (nodeLeft - tolerance <= containerCenter && nodeRight >= containerCenter) {
    selectedNode.value = nodes.value.find(node => node.date === nodeElement.id);
  }
});
};

const scrollToToday = () => {
  const today = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).replace(/\//g, '-');
  
  const container = document.querySelector('.date-container');
  const element = document.getElementById(today);

  if (element && container) {
    const containerRect = container.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();

    // Calculate the scroll position to center the element
    const scrollLeft = elementRect.left - containerRect.left - containerRect.width / 2 + elementRect.width / 2;

    container.scrollTo({
      left: scrollLeft,
      behavior: 'smooth'
    });
  } else {
    console.warn('Element or container not found for today:', today);
  }
};


watch(() => postData.value, () => {
  const container = document.querySelector('.date-container');
  container.addEventListener('scroll', updateCenteredNode);
});

const weatherColor = (name) => {
  if (name === 'overcast') {
    return '#A9A9A9'; // Dark gray color for overcast
  } else if (name === 'mostly-cloudy') {
    return '#C0C0C0'; // Silver color for mostly cloudy
  } else if (name === 'snowfall') {
    return '#FFFFFF'; // White color for snowfall
  } else if (name === 'cloudy') {
    return '#808080'; // Gray color for cloudy
  }
};

const removeYear = (date) => {
  // Example 19-01-2024 to 19-01
  return date.split('-').slice(0, 2).join('-');
};

</script>

<template>


<div class="container">
  <br>
<nav class="nav navbar">
  <div class="">
<h1>OX2 Forecast</h1>
<h5 class="text-muted ">Möckelö</h5>
</div>

<!-- <input class="form-control" type="text" :placeholder="'Search... ' + new Date().toJSON().slice(0, 10) " aria-label="Search" style="width: 50%;"> -->

<select class="form-select" style="width: 10%;">
  <option value="" selected>English</option>
  <option value="">Swedish</option>
  <option value="">Finnish</option>
</select>
</nav>

<!-- {{ postData.data }} -->
<div class="date-container" style=" overflow-x: scroll; overflow-y: hidden;">
<div class="date-box d-flex flex-row justify-content-center mb-2" style="margin-left: 20rem; margin-right: 20rem; width: 100%;">
<div v-for="node in nodes" :key="node" class="node-loop">
  <div class="node p-2 border rounded m-2 d-flex" :id="node.date" :style="{ 
    height: node.energyproduced * 30 + 'rem',
    backgroundColor: weatherColor(node.weather)}">
    <!-- Center the date, align to bottom -->
  <p style="white-space: nowrap; 
  margin-left: -1rem; 
  margin-bottom: -1.8rem;
  align-self: flex-end;
  font-size: 0.8rem;
  ">{{ removeYear(node.date) }}</p> 
   <!-- {{ node.weather }}<br> -->
   <!-- {{ node.energyproduced }} -->
   </div>
  </div>
</div>
</div>

<div v-if="selectedNode" class="selected-node-info my-5 p-4 border rounded">
    <h3>Selected Node Date: {{ selectedNode.date }}</h3>
    {{ selectedNode.weather }}<br>
    {{ selectedNode.energyproduced }}
  </div>

<div v-for="post in postData.data" :key="post.id">
      <!-- Accessing properties of each post object -->
      <!-- <h3>ID: {{ post.id }}</h3>
      <p>Date: {{ post.date }}</p> -->
      <p v-html="post.content.rendered "></p>
      <!-- Add more properties as needed -->
    </div>

</div> 
</template>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500&display=swap');

body {
  font-family: 'Poppins', sans-serif;
}

.date-container::before {
  content: 'I';
  position: absolute;
  top: 6.5rem;
  left: 50%;
}

.node-loop {
  display: flex;
  align-items: end;
}

.node {
  max-height: 10rem;
  width: 1.5rem;
}

::-webkit-scrollbar {
    display: none;
}

</style>