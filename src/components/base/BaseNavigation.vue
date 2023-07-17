<template>
    <div class="m-nav-major">
        <ul class="m-list-nav">
            <router-link class="m-list-nav-item" :to="item.link" v-for="(item, index) in listNavigation.filter(
                (item) => item.isDisplay
            )" :key="index">
                {{ item.text }}
            </router-link>
        </ul>
        <div class="m-nav-setting" @click.self="() => {
                isShowSetting = !isShowSetting;
            }
            ">
            <div class="m-nav-setting-box" v-show="isShowSetting">
                <div class="title">Thiết lập hiển thị</div>
                <div>
                    <draggable :list="listNavigation" :disabled="false" @start="dragging = true" @end="dragging = false">
                        <template #item="{ element }">
                            <div class="nav-setting-item">
                                <div class="drag-icon"></div>
                                <BaseCheckboxInput v-model="element.isDisplay"></BaseCheckboxInput>
                                <div class="nav-setting-name">
                                    {{ element.text }}
                                </div>
                            </div>
                        </template>
                    </draggable>
                </div>
                <div class="m-setting-acvanced">
                    <div class="acvanced-icon"></div>
                    <div class="acvanced-text">Thiết lập nâng cao</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { defineProps, toRef, ref, watch } from "vue";
import BaseCheckboxInput from "./BaseCheckboxInput.vue";
import draggable from "vuedraggable";
const props = defineProps({
    navigation: {
        type: Array,
        default: () => [],
    },
});
//Chuyển props về biến ref
const listNavigation = toRef(props, "navigation");
const isShowSetting = ref(false);
/**
 * Hàm click vào bên
 * Author: NDKien - (24/06/2023)
 * @param {Event} e
 */
const clickOutSide = (e) => {
    if (
        !e.target.classList.contains("m-nav-setting-box") &&
        !e.target.classList.contains("m-nav-setting") &&
        !e.target.classList.contains("nav-setting-item") &&
        !e.target.classList.contains("drag-icon") &&
        !e.target.classList.contains("m-input-checkbox") &&
        !e.target.classList.contains("nav-setting-name") &&
        !e.target.classList.contains("title") &&
        !e.target.classList.contains("m-setting-acvanced")
    ) {
        isShowSetting.value = false;
    }
};

/**
 * Author: NDKien - (24/06/2023)
 */
watch(isShowSetting, () => {
    if (isShowSetting.value) {
        document.addEventListener("click", clickOutSide);
    } else {
        document.removeEventListener("click", clickOutSide);
    }
});
</script>
<style scoped>
.m-nav-major {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #d4d7dc;
}

.m-list-nav {
    display: flex;
    column-gap: 10px;
}

.m-list-nav-item {
    padding: 4px 20px 8px;
    cursor: pointer;
    color: #111;
}

.router-link-exact-active {
    border-top-right-radius: 6px;
    border-top-left-radius: 6px;
    font: 13px MISAFontBold;
    background-color: #f2ebbf;
    border: 1px solid #d4d7dc;
    position: relative;
}

.router-link-exact-active::after {
    content: "";
    width: 100%;
    height: 4px;
    position: absolute;
    bottom: -1px;
    left: 0;
    background-color: var(--primary-color);
}

.active {
    border-top-right-radius: 6px;
    border-top-left-radius: 6px;
    font: 13px MISAFontBold;
    background-color: #f2ebbf;
    border: 1px solid #d4d7dc;
    position: relative;
}

.active::after {
    content: "";
    width: 100%;
    height: 4px;
    position: absolute;
    bottom: -1px;
    left: 0;
    background-color: var(--primary-color);
}

.m-nav-setting {
    background: url("@/assets/icon/Sprites.4b10a131.svg") no-repeat -2478px -560px;
    width: 19px;
    height: 15px;
    cursor: pointer;
    position: relative;
}

/* .m-nav-setting:hover {
    background: url("@/assets/icon/Sprites.4b10a131.svg") no-repeat -2519px -560px;
} */

.m-nav-setting-box {
    position: absolute;
    width: 300px;
    right: 0;
    top: calc(100% + 4px);
    background-color: #fff;
    padding: 12px 16px;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    row-gap: 16px;
}

.m-nav-setting-box .title {
    font-size: 18px;
}

.nav-setting-item {
    display: flex;
    column-gap: 12px;
    align-items: center;
    padding: 16px 0;
    border-bottom: 1px solid #d4d7dc;
}

.nav-setting-item:last-child {
    border: none;
}

.nav-setting-item .drag-icon {
    background: url("@/assets/icon/Sprites.4b10a131.svg") no-repeat -419px -363px;
    width: 10px;
    height: 10px;
}

.nav-setting-name {
    font: 13px MISAFontMedium;
}

.m-setting-acvanced {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    column-gap: 10px;
    padding-bottom: 6px;
}

.acvanced-icon {
    background: url("@/assets/icon/Sprites.4b10a131.svg") no-repeat -1280px -311px;
    width: 16px;
    height: 17px;
}

.acvanced-text {
    color: #0075c0;
}
</style>
