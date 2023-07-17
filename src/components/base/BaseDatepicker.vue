<template>
    <div class="datepicker-wrapper">
        <label class="datepicker-label" v-if="label">{{ label }}</label>
        <div class="datepicker-box">
            <input class="datepicker-input" :style="{ width: width, height: height }" v-model="date" @input="onInputDate"
                type="date" :tabindex="tabIndex" :disabled="disable" />
            <div class="disable-input" v-if="disable"></div>
        </div>
    </div>
</template>
<script>
import { computed } from "vue";
export default {
    props: {
        label: {
            type: String,
            default: "",
        },
        width: {
            type: String,
            default: "100%",
        },
        height: {
            type: String,
            default: "28px",
        },
        modelValue: {
            type: String,
            default: "",
        },
        tabIndex: {
            type: Number,
        },
        disable: {
            type: Boolean,
            default: false,
        },
    },
    setup(props, { emit }) {
        const date = computed(() => props.modelValue);
        const onInputDate = (e) => {
            emit("update:modelValue", e.target.value);
        };
        return {
            date,
            onInputDate,
        };
    },
};
</script>

<style scoped>
.datepicker-box {
    position: relative;
}

.datepicker-wrapper {
    display: flex;
    flex-direction: column;
    row-gap: 6px;
}

.datepicker-label {
    font-family: MISAFontBold;
    font-size: 13px;
}

.datepicker-input {
    color: var(--border-color);
    border: 1px solid var(--border-color);
    border-radius: 3px;
    outline: none;
    padding: 0 8px;
    color: var(--text-color);
    font-size: 13px;
}

.disable-input {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: black;
    opacity: 0.1;
    border-radius: 3px;
}
</style>
