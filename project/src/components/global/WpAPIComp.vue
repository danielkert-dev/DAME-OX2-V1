<script setup>

/* Imports
    - Wordpress api fetch
    - Language store to change language
    - Text store to access fetch globaly
*/

import { ref, onMounted, computed, watch } from 'vue';
import { useWpAPIStore } from '../../stores/WpAPIStore.js';
import { useLanguageStore } from '../../stores/LanguageStore.js';
import { useTextStore } from '../../stores/TextStore.js';


/* Variables 
    - Set path and queries
*/

const endpointPosts = 'posts?categories=';

const endpointCategories = computed(() => {
  const language = useLanguageStore().getLanguage();
  const endpointCategoriesPre = 'categories?slug=forecasting-';
  if (language === 'en') {
    return endpointCategoriesPre+'en';
  } else if (language === 'sv') {
    return endpointCategoriesPre+'sv';
  } else {
      return console.error('Language not found');
  }
});

const selectedLanguage = ref(useLanguageStore().getLanguage());
let posts = ref({});
let categories = ref({});

/* Methods */

onMounted(async () => {
  try {
    categories.value = await useWpAPIStore().fetchData(endpointCategories.value, '');
    posts.value = await useWpAPIStore().fetchData(endpointPosts+categories.value[0].id, '');
    setToTextStore();
  } catch (error) {
    console.error(error.message);
  }
});

/* Watchers */

watch(endpointCategories, async (newEndpoint) => {
  try {
    categories.value = await useWpAPIStore().fetchData(newEndpoint, '');
    posts.value = await useWpAPIStore().fetchData(endpointPosts+categories.value[0].id, '');
    setToTextStore();
  } catch (error) {
    console.error(error.message);
  }
});

/* Functions */

function updateLanguage() {
  useLanguageStore().setLanguage(selectedLanguage.value);
}

function setToTextStore() {
  useTextStore().setText(posts.value);
}

</script>

<template>
  <select v-model="selectedLanguage" @change="updateLanguage">
    <option value="en">en</option>
    <option value="sv">sv</option>
  </select>

</template>