<template>
    <div
        v-show="isShowTooltip"
        class="tooltip"
        :style="{ top: positionY + 'px', left: positionX + 'px' }"
    >
        <span>{{ contentTooltip }}</span>
    </div>
</template>

<script>
export default {
    props: {
        contentTooltip: {
            type: String,
            default: "",
        },
        isShowTooltip: {
            type: Boolean,
        },
        positionX: {
            type: Number,
        },
        positionY: {
            type: Number,
        },
    },
    computed: {
        //Vị trí chiều ngang hiển thị
        TooltipX() {
            return this.positionX;
        },
        //Vị chí chiều dọc
        TooltipY() {
            return this.positionY + 100;
        },
    },
};
</script>

<style scoped>
.tooltip {
    box-sizing: border-box;
    background-color: #4b4c51;
    border-radius: 2px;
    display: flex;
    align-items: center;
    position: absolute;
    bottom: 0;
    z-index: 100;
    justify-content: center;
    left: 0;
    transform: translate(-50%, 100%);
    padding: 2px 8px;
    min-height: fit-content;
}
.tooltip span {
    font-family: MISAFont;
    font-size: 12px;
    font-weight: 200px;
    display: block;
    color: #fff;
    width: max-content;
}
</style>
