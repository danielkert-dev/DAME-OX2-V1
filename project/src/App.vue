<script setup>
import { RouterView, RouterLink } from 'vue-router'
</script>

<template>
    <RouterView />

    <div class="container">
    <footer class="text-center m-5 p-5">
        <RouterLink to="/" class="m-2 text-decoration-none text-muted">Home</RouterLink>
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
