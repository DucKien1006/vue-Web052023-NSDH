import { createApp } from "vue";
import App from "./App.vue";
import store from "./stores/store.js";
import VueTippy from "vue-tippy";
import { clickOutside } from "./directives/clickoutside.js";
import router from "@/router/index";

createApp(App)
    .directive("click-outside", clickOutside)
    .use(store)
    .use(VueTippy)
    .use(router)
    .mount("#app");
