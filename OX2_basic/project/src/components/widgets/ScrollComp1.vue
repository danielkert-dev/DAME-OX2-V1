<script setup>
import { onMounted, ref } from 'vue';

onMounted(() => {
    const dateRowWidth = document.querySelector(".date-row").offsetWidth;
    console.log(dateRowWidth);
    const dateRowCenter = dateRowWidth / 2;
    console.log(dateRowCenter);
    document.querySelector(".date-row").scrollTo(dateRowCenter, 0);
})

</script>

<template>
    <br>
    <div class="date-selector"> 
        <div class="date-row-wrapper">
            <div class="date-row rounded">
                <div v-for="i in 100" :key="i">
                    <div class="date-node mx-2 my-2">
                        <div style="height: 10rem" class="d-flex align-items-end">
                            <div class="border rounded m-2" :style="{
                                height: Math.random() * 10 + 'rem',
                                backgroundColor: 'hsl(' + Math.random() * 360 + ', 20%, 80%)'
                            }" style="width: 5rem">
                            </div>
                        </div>
                        <div class="date-num">
                            {{ i }}. {{ i + 1 }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <br>
    <div class="info-row row">
        <div class="col-6 card p-4 mx-2 row">
            <div class="col-12">
                <div class="d-flex">
                <h2>Energy production</h2>
                <svg xmlns="http://www.w3.org/2000/svg" class="m-2 icon icon-tabler icon-tabler-solar-panel" width="32" height="32" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
  <path d="M4.28 14h15.44a1 1 0 0 0 .97 -1.243l-1.5 -6a1 1 0 0 0 -.97 -.757h-12.44a1 1 0 0 0 -.97 .757l-1.5 6a1 1 0 0 0 .97 1.243z" />
  <path d="M4 10h16" />
  <path d="M10 6l-1 8" />
  <path d="M14 6l1 8" />
  <path d="M12 14v4" />
  <path d="M7 18h10" />
</svg>
</div>
                <br>
                <p>
                    <b>123 KW/h</b> vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae
                    consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur
                </p>
            </div>
            <div class="row">
                <div class="col-6">
                    <h2>Hydrogen</h2>
                    <br>
                    <p>
                        <b>32% 🚨</b><br>Lorustis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae
                        consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur
                    </p>
                </div>
                <div class="col-6">
                    <h2>Energy supply</h2>
                    <br>
                    <p>
                        <b>100% 🔋</b><br><br>Lorustis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae
                        consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur
                    </p>
                </div>
            </div>
        </div>

        <div class="col-6 row">
            <div class="col-6">
                <div class="card p-4 mx-2 mb-4">
                    <h2>Weather</h2>
                    <br>
                    <p>⛅</p>
                    <p>Wind: 10 m/s</p>
                    <p>Temperature: 10 °C</p>
                </div>
                <div class="card p-4 mx-2">
                    <h2>Data</h2>
                    <br>
                    <p>Bla bla bla</p>
                    <p>Bla bla bla</p>
                    <p>Bla bla bla</p>
                    <p>Bla bla bla</p>
                </div>
            </div>

            <div class="col-6">
                <div class="card p-4 h-100">
                    <h2>Other</h2>
                    <br>
                    <p>Bla bla bla</p>
                    <p>Bla bla bla</p>
                    <p>Bla bla bla</p>
                    <p>Bla bla bla</p>
                    <p>Bla bla bla</p>
                    <p>Bla bla bla</p>
                    <p>Bla bla bla</p>
                    <p>Bla bla bla</p>
                    <p>Bla bla bla</p>
                    <p>Bla bla bla</p>

                </div>
            </div>

        </div>

    </div>
</template>

<style scoped lang="scss">
$color: hsl(0, 0%, 80%);
$fadeColor: rgba(255, 255, 255, 1);
$fadeWidth: 5rem;

.date-row-wrapper {
    position: relative;
    height: 12rem;

    &::before,
    &::after {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        width: $fadeWidth;
        pointer-events: none;
        z-index: 2;
    }

    &::before {
        left: 0;
        background: linear-gradient(to right, $fadeColor, transparent);
    }

    &::after {
        right: 0;
        background: linear-gradient(to left, $fadeColor, transparent);
    }
}

.date-selector::before {
    content: '2024';
    text-align: center;
    position: absolute;
    margin-top: -1.8rem;
    left: calc(50% - 2rem);
    border: .15rem solid $color;
    border-radius: .5rem;
    height: 14rem;
    width: 4rem;
    z-index: 1;
}

.date-row {
    height: 12rem;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    overflow-y: hidden;
    overflow-x: scroll;
}

.date-node {
    height: 9rem;
    width: 3rem;
}

.date-num {
    text-align: center;
    font-size: .8rem;
}

::-webkit-scrollbar {
    display: none;
}

.info-row {
    height: 30rem;
}
</style>