<template>
    <TheOverlay>
        <div class="dialog-wrapper">
            <div class="dialog-content">
                <div class="dialog-icon" :class="type"></div>
                <div class="dialog-message">{{ message }}</div>
            </div>
            <div class="dialog-action">
                <div class="dialog-action-left">
                    <BaseButton text="Hủy" height="28px" minWidth="60px" isExtra @click="closeDialogQuestion" :tabIndex="3">
                    </BaseButton>
                </div>
                <div class="dialog-action-right">
                    <BaseButton text="Không" height="28px" minWidth="60px" isExtra @click="noDialogQuesion" :tabIndex="2">
                    </BaseButton>
                    <BaseButton text="Có" height="28px" minWidth="60px" @click="okDialogQuesion" :tabIndex="1"
                        :focus="true"></BaseButton>
                </div>
            </div>
        </div>
    </TheOverlay>
</template>
<script>
import TheOverlay from "../base/BaseOverlay.vue";
import BaseButton from "../base/BaseButton.vue";
export default {
    components: {
        TheOverlay,
        BaseButton,
    },
    props: {
        type: {
            type: String,
            default: "infor",
        },
        message: {
            type: String,
            default: "",
        },
    },
    setup(props, { emit }) {
        // Khi click và nút hủy
        const closeDialogQuestion = () => {
            emit("closeDialogQuestion");
        };
        // Khi click vào nút không
        const noDialogQuesion = () => {
            emit("noDialogQuesion");
        };
        // Khi click vào nút có
        const okDialogQuesion = () => {
            emit("okDialogQuesion");
        };
        return {
            closeDialogQuestion,
            okDialogQuesion,
            noDialogQuesion,
        };
    },
};
</script>
<style scoped>
.dialog-wrapper {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    padding: 24px 24px 12px 24px;
    border-radius: 3px;
    width: 445px;
}

.dialog-content {
    display: flex;
    align-items: center;
    column-gap: 16px;
    border-bottom: 1px solid #b8bcc3;
    padding-bottom: 16px;
}

.dialog-icon {
    width: 38px;
    height: 38px;
    margin-left: 12px;
}

.warning {
    background: url("@/assets/icon/Sprites.64af8f61.svg") no-repeat -598px -463px;
    width: 36px;
    height: 37px;
}

.infor {
    background: url("@/assets/icon/Sprites.64af8f61.svg") no-repeat -672px -462px;
    width: 36px;
    height: 36px;
}

.question {
    background: url("@/assets/icon/Sprites.64af8f61.svg") no-repeat -832px -462px;
    width: 36px;
    height: 36px;
}

.error {
    background: url("@/assets/icon/Sprites.64af8f61.svg") no-repeat -752px -462px;
    width: 36px;
    height: 36px;
}

.success {
    background: url("@/assets/icon/Sprites.64af8f61.svg") no-repeat -990px -462px;
    width: 36px;
    height: 36px;
}

.dialog-message {
    font-size: 13px;
    font-family: MisaFont;
}

.dialog-action {
    padding-top: 12px;
    display: flex;
    justify-content: space-between;
}

.dialog-action-right {
    display: flex;
    column-gap: 12px;
}
</style>
