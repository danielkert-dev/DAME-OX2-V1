<script setup>
/* //@ Imports
    - Wordpress api fetch
    - Language store to change language
    - Text store to access fetch globaly
*/

import { ref, onMounted, computed, watch } from "vue";
import { useWpAPIStore } from "../../stores/WpAPIStore.js";
import { useLanguageStore } from "../../stores/LanguageStore.js";
import { useTextStore } from "../../stores/TextStore.js";
import { useRouter } from "vue-router";
const router = useRouter();

/* //@ Variables 
    - Set path and queries
*/

const endpointPosts = "posts?categories=";

const endpointCategories = computed(() => {
  const language = useLanguageStore().getLanguage();
  const endpointCategoriesPre = "categories?slug=forecasting-";
  if (language === "en") {
    return endpointCategoriesPre + "en";
  } else if (language === "sv") {
    return endpointCategoriesPre + "sv";
  } else {
    return console.error("Language not found");
  }
});

const selectedLanguage = ref(useLanguageStore().getLanguage());
let posts = ref({});
let categories = ref({});

/* //@ Methods
 */

async function setText() {
  try {
    categories.value = await useWpAPIStore().fetchData(endpointCategories.value, "");
    posts.value = await useWpAPIStore().fetchData(
      endpointPosts + categories.value[0].id,
      ""
    );
    setToTextStore();
  } catch (error) {
    console.error(error.message);
  }
}
setText();

watch(
  () => router.currentRoute.value,
  async () => {
    try {
      categories.value = await useWpAPIStore().fetchData(endpointCategories.value, "");
      posts.value = await useWpAPIStore().fetchData(
        endpointPosts + categories.value[0].id,
        ""
      );
      setToTextStore();
    } catch (error) {
      console.error(error.message);
    }
  }
);

/* //@ Watchers
 */

watch(endpointCategories, async (newEndpoint) => {
  try {
    categories.value = await useWpAPIStore().fetchData(newEndpoint, "");
    posts.value = await useWpAPIStore().fetchData(
      endpointPosts + categories.value[0].id,
      ""
    );
    setToTextStore();
  } catch (error) {
    console.error(error.message);
  }
});

/* //@ Functions
 */

function updateLanguage() {
  useLanguageStore().setLanguage(selectedLanguage.value);
}

function setToTextStore() {
  useTextStore().setText(posts.value);
}
</script>

<template>
  <div class="h-100 d-flex flex-wrap justify-content-center align-content-center">
    <select
      class="custom-select lang-select form-select"
      v-model="selectedLanguage"
      @change="updateLanguage"
    >
      <option value="en">En</option>
      <option value="sv">Sv</option>
    </select>
  </div>
</template>

<style scoped lang="scss">
$main-color: #616968;
$secondary-color: #004140;
$third-color: #343434;
$text-color: #f8f7f6;

.lang-select {
  min-width: 5rem;
  display: flex;
  justify-content: center;
  align-content: center;
}

input,
select {
  background-color: $third-color;
  color: $text-color;
  color-scheme: dark;
  border: none;
}

.custom-select {
  background: $third-color
    url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 5'%3e%3cpath fill='white' d='M2 0L0 2h4zm0 5L0 3h4z'/%3e%3c/svg%3e")
    no-repeat right 0.75rem center/8px 10px !important;
}
</style>
