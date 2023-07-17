<template>
    <div class="m-toast-message" :class="type" v-show="props.isShowToast">
        <div class="m-toast-icon"></div>
        <div class="m-toast-body">
            <!-- <span class="m-toast-title">{{ props.title }}&nbsp;</span> -->
            <span class="m-toast-description">{{ props.message }}</span>
        </div>
        <div class="m-btn-toast" @click="() => {
                emits('hideToastMessage');
            }
            "></div>
    </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";
const emits = defineEmits(["hideToastMessage"]);
const props = defineProps({
    /**
     * Loại thông báo
     */
    type: {
        type: String,
        default: "infor",
    },
    /**
     * Nội dung thông báo
     */
    message: {
        type: String,
        default: "",
    },
    isShowToast: {
        type: Boolean,
        default: false,
    },
});
</script>

<style scoped>
.m-toast-message {
    position: fixed;
    min-width: max-content;
    height: 60px;
    display: flex;
    align-items: center;
    border-radius: 6px;
    background-color: var(--white-color);
    top: 5%;
    right: 24px;
    animation: fideIn linear 0.4s;
    padding: 0 16px;
    box-shadow: 0 3px 20px rgba(0, 0, 0, 0.078);
    z-index: 1111;
}

@keyframes fideIn {
    0% {
        transform: translateX(calc(100% + 32px));
    }

    70% {
        transform: translateX(-10%);
    }

    100% {
        transform: translateX(0);
    }
}

.m-toast-body {
    flex: 1;
    padding: 0 20px 0 8px;
}

.m-toast-title {
    font-family: MisaFontBold;
    font-size: 14px;
}

.m-toast-description {
    margin-left: 8px;
    color: #1f1f1f;
    font-size: 14px;
}

.m-toast-action a {
    color: var(--action-color);
    font-family: MisaFontMedium;
    font-size: 14px;
}

/* Các loại toast-message */
.success {
    border: 1px solid #2ba01cbd;
}

.success .m-toast-icon {
    background: url("@/assets/icon/Sprites.4b10a131.svg") no-repeat -990px -462px;
    width: 36px;
    height: 36px;
    opacity: 0.8;
}

.infor {
    border: 1px solid #0075c0;
}

.infor .m-toast-icon {
    background: url("@/assets/icon/Sprites.4b10a131.svg") no-repeat -672px -462px;
    width: 36px;
    height: 36px;
}

/* .warning .m-toast-title {
    color: #f49342;
}
.warning .m-toast-icon {
    background: url("@/assets/icon/warning-icon-20.svg");
    width: 20px;
    height: 20px;
} */

.error {
    border: 1px solid rgba(255, 119, 119, 0.715);
}

.error .m-toast-icon {
    background: url("@/assets/icon/Sprites.4b10a131.svg") no-repeat -752px -462px;
    width: 36px;
    height: 36px;
}

.m-btn-toast {
    width: 16px;
    height: 16px;
    background-image: url("@/assets/icon/close.svg");
    background-size: cover;
    cursor: pointer;
}</style>
