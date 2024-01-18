<script setup>
import { ref, onMounted, watch } from 'vue';
import { useTextStore } from '../stores/TextStore.js';

const textData = ref('')
const textList = ref([]);

onMounted(async () => {
        console.log( await useTextStore().$state)
});

watch(useTextStore(), async () => {
    textData.value = await useTextStore().$state.wpText[0].content.rendered;
    const divElements = Array.from(new DOMParser().parseFromString(textData.value, 'text/html').querySelectorAll('div'));
    const innerTextList = divElements.map((div) => div.innerText);
    textList.value = innerTextList;
});

</script>

<template>
<div class="container">
        <h1 class="text-center m-5">Yearly</h1>

        <div class="text-center m-5 p-5 border">

        <h4>Text 1 : {{ textList[0] }}</h4>
        <h4>Text 2 : {{ textList[1] }}</h4>
        <h4>Text 3 : {{ textList[2] }}</h4>

        {{ textData }}
        </div>
</div>
</template>