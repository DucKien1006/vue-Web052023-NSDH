<template>
    <div class="m-btn-insert">
        <button class="btn-insert-one" @click="() => emits('clickButton')">
            {{ props.text }}
        </button>
        <button
            class="btn-insert-more"
            @click="() => (isShowMoreAction = !isShowMoreAction)"
        ></button>
        <ul
            class="list-action"
            v-if="isShowMoreAction"
            v-click-outside:btn-insert-more="() => (isShowMoreAction = false)"
        >
            <li
                class="list-action-item"
                v-for="(item, index) in props.listActionMore"
                :key="index"
                @click="handleClickItem(item.click)"
            >
                {{ item.text }}
            </li>
        </ul>
    </div>
</template>
<script setup>
import { defineProps, defineEmits, ref } from "vue";
//Định nghĩa props
const props = defineProps({
    text: {
        type: String,
    },
    listActionMore: {
        type: Array,
    },
});

//Định nghĩa emit khi click và từng item
const emits = defineEmits(["clickButton", "clickMoreItem"]);

const isShowMoreAction = ref(false);

//Xử lý sự kiện khi click vào item more
const handleClickItem = (itemClick) => {
    isShowMoreAction.value = false;
    emits("clickMoreItem", itemClick);
};
</script>
<style scoped>
.m-btn-insert {
    display: flex;
    position: relative;
}
.btn-insert-one {
    border-radius: 30px 0 0 30px;
    padding-left: 16px;
    padding-right: 10px;
    position: relative;
    font-family: MISAFontMedium;
    font-size: 13px;
}
.btn-insert-one::before {
    position: absolute;
    right: -1px;
    top: 50%;
    transform: translateY(-50%);
    content: "";
    height: 60%;
    width: 1.5px;
    background-color: #fff;
    z-index: 10;
}
.btn-insert-more {
    border-radius: 0 30px 30px 0;
    align-items: center;
    justify-content: center;
    padding-right: 12px;
    background: url(http://localhost:8080/img/Sprites.4b10a131.547ed5fa.svg)
        no-repeat -841px -353px;
    width: 34px;
}
.btn-insert-one,
.btn-insert-more {
    height: 28px;
    outline: none;
    border: none;
    background-color: var(--primary-color);
    color: #fff;
    cursor: pointer;
    position: relative;
}
.btn-insert-one:hover,
.btn-insert-more:hover {
    background-color: var(--primary-hover-color);
    color: var(--white-color);
}

.list-action {
    position: absolute;
    background-color: #fff;
    border: 1px solid #babec5;
    color: #131313;
    right: 0;
    min-width: max-content;
    top: calc(100% + 4px);
    border-radius: 3px;
    z-index: 1000;
    padding: 3px 0;
    animation: up linear 0.1s;
}
.list-action-item {
    user-select: none;
    padding: 4px 8px;
    cursor: pointer;
    font-size: 13px;
    font-family: MISAFont;
}
.list-action-item:hover {
    color: var(--primary-color);
    background-color: #d2d3d6;
}
</style>
