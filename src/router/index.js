import EmployeePage from "@/views/cash/employee/EmployeePage.vue";
import HomePage from "@/views/home/HomePage.vue";
import CashMain from "@/views/cash/CashMain.vue";
import EmployeeMajorVue from "@/views/majors/EmployeeMajor.vue";
import { createRouter, createWebHistory } from "vue-router";

const routers = [
    {
        path: "/home",
        component: HomePage,
        beforeEnter(to, from, next) {
            document.title = "Tổng quan";
            next();
        },
    },
    {
        path: "/nhanvien",
        component: EmployeePage,
        beforeEnter(to, from, next) {
            document.title = "Nhân viên";
            next();
        },
    },
    {
        path: "/cash",
        component: CashMain
    },
    {
        path: "/cash/major",
        component: EmployeeMajorVue
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes: routers,
});

export default router;
