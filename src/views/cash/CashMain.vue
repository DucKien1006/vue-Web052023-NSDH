<template>
    <div class="container">
        <BaseNavigation :navigation="listNavigation"></BaseNavigation>
        <router-view></router-view>
    </div>
</template>

<script setup>
import { ref } from "vue";
import BaseNavigation from "@/components/base/BaseNavigation.vue";
const listNavigation = ref([
    {
        text: "Quy trình",
        link: "/cash/major",
        isDisplay: true,
    },
    {
        text: "Báo cáo",
        link: "/",
        isDisplay: true,
    },
    {
        text: "Dự báo dòng tiền",
        link: "/nhanvien",
        isDisplay: true,
    },
    {
        text: "Thu, chi tiền",
        link: "/",
        isDisplay: true,
    },
    {
        text: "Kiểm kê",
        link: "/",
        isDisplay: true,
    },
]);
</script>

<style scoped>
.container {
    padding: 16px;
}
</style>
