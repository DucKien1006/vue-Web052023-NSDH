<template>
    <div class="m-app-body">
        <TheHeader></TheHeader>
        <router-view></router-view>
    </div>
</template>
<script setup>
import TheHeader from "./TheHeader.vue";
</script>
<style>
@import url("@/assets/css/main.css");
</style>
