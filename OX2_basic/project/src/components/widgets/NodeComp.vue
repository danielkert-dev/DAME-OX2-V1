<script setup>
import { computed, onMounted, nextTick, watch } from 'vue';
import {weatherColor, weatherIcon} from '../data/WeatherComp.js';

const props = defineProps({
    nodes: { type: Array, required: true },
    selectedNode: { type: Object, required: true },
    postData: { type: Object, required: true }
});
const nodes = computed(() => props.nodes);
const selectedNode = computed(() => props.selectedNode);


onMounted(async () => {

    await nextTick();
    setTimeout(() => {
        scrollToToday();
    },500)

});




const removeYear = (date) => {
  // Example 19-01-2024 to 19-01
  return date.split('-').slice(0, 2).join('-');
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

</script>
<template>

<div v-if="selectedNode" class="selected-node-info">
    <h3>{{ selectedNode.date }}</h3>
    {{ selectedNode.weather }}<br>
    {{ selectedNode.energyproduced }}
    {{ selectedNode.type }}
    {{ selectedNode.age }}
</div>

<!-- {{ postData.data }} -->
<div class="date-container my-5" style=" overflow-x: scroll; overflow-y: hidden;">
<div class="date-box d-flex flex-row justify-content-center mb-2" style="margin-left: 100rem; margin-right: 100rem; width: 100rem;">
<div v-for="node in nodes" :key="node" class="node-loop">
  <div class="node p-2 border rounded m-2 d-flex" :id="node.date" :style="{ 
    height: node.energyproduced * 1.8 + 'rem',
    backgroundColor: weatherColor(node.weather)}">
    <!-- Center the date, align to bottom -->
  <p style="white-space: nowrap; 
  margin-left: -.6rem; 
  margin-bottom: -1.8rem;
  align-self: flex-end;
  font-size: 0.6rem;
  ">{{ removeYear(node.date) }}</p> 
   <!-- {{ node.weather }}<br> -->
   <!-- {{ node.energyproduced }} -->
   </div>
  </div>
</div>
</div>

</template>

<style lang="scss" scoped>

$color: hsl(0, 0%, 80%);
$fadeColor: rgba(255, 255, 255, 1);
$fadeWidth: 5rem;

.selected-node-info {
  position: absolute;
  scale: .6;
  margin-left: -1.85rem;
  margin-top: -1rem;
  opacity: .8;
}
.date-container::before {
  content: 'I';
  position: absolute;
  top: 22.5rem;
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
</style>../data/WeatherComp.js