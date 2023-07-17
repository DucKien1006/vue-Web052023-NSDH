<template>
    <div class="input-field" :style="{ width: props.width }">
        <label class="input-lable" v-if="props.label">{{ props.label }}
            <span class="isRequired" v-if="props.required">*</span>
        </label>
        <div :style="{ width: props.width, height: props.height }"
            :class="['input-wrapper', props.isValid ? 'isError' : '']">
            <div class="input-with-search" v-if="isSearch"></div>
            <input ref="tagInput" v-model="valueInput" :placeholder="props.placeholder" @input="updateInput"
                @blur="handleOnBlur" class="input-text" :tabindex="props.tabIndex" @keydown="onKeyDown"
                :disabled="props.disable" :style="{ textAlign: props.textAlign }" :maxlength="props.maxLength" />
            <div class="disable-input" v-if="props.disable"></div>
        </div>
        <span class="input-error-message" v-if="props.isValid" @mouseover="() => (isValidHover = true)">{{
                    props.errorMessage }}</span>
    </div>
</template>

<script setup>
import { computed, ref, defineEmits, defineProps, watch } from "vue";
import Enum from "@/utils/enum.js";

const emits = defineEmits(["update:modelValue", "handleBlurInput"]);
const props = defineProps({
    width: {
        type: String,
        default: "100%",
    },
    height: {
        type: String,
        default: "28px",
    },
    textAlign: {
        type: String,
        default: "left",
    },
    //Có validate không
    isValid: {
        type: Boolean,
        default: false,
    },
    modelValue: {
        type: String,
        default: "",
    },
    //Có icon tìm kiếm không
    isSearch: {
        type: Boolean,
        default: false,
    },
    //Có nhãn tương ứng không
    label: {
        type: String,
        default: "",
    },
    //Trường này có bắt buộc phải nhập hay không
    required: {
        type: Boolean,
        default: false,
    },
    //Có placeholder hay không
    placeholder: {
        type: String,
        default: "",
    },
    //Có được focus hay không
    focus: {
        type: Boolean,
        default: false,
    },
    //Tabindex
    tabIndex: {
        type: Number,
    },
    //Nếu có validate thì thông báo lỗi đó là gì
    errorMessage: {
        type: String,
        default: "",
    },
    onlyNumber: {
        type: Boolean,
        default: false,
    },
    disable: {
        type: Boolean,
        default: false,
    },
    maxLength: {
        type: Number,
        default: 255,
    },
});

/**
 * Theo dõi sự thay đổi ủa model value để thực hiện validate
 */
watch(
    () => props.modelValue,
    (newVal) => {
        if (newVal) {
            isError.value = false;
        }
    }
);

/**
 * Biến thể hiện trạng thái validate
 */
const isError = ref(false);
const valueInput = computed({
    get: () => props.modelValue,
    set: (value) => emits("update:modelValue", value),
});

watch(valueInput.value, (newVal) => {
    // Thực hiện validate dữ liệu
    if (props.isValid) {
        if (!newVal) {
            isError.value = true;
        } else {
            isError.value = false;
        }
    }
});

const updateInput = (e) => {
    emits("update:modelValue", e.target.value);
};

/**
 * Xử lý sự kiện blur ra khỏi input
 * Author: NDKien - (23/06/2023)
 */
const handleOnBlur = () => {
    emits("handleBlurInput");
};

const isValidHover = ref(false);

const tagInput = ref(null);
watch(
    () => props.focus,
    () => {
        if (props.focus) {
            //console.log("Day la focus");
            tagInput.value.focus();
        }
    }
);

/**
 * Xử lý nếu input chỉ cho phép nhập số
 * @param {*} event
 */
const onKeyDown = (event) => {
    if (props.onlyNumber == true) {
        if (
            event.keyCode !== Enum.KeyCode.TAB &&
            event.keyCode !== Enum.KeyCode.LEFT &&
            event.keyCode !== Enum.KeyCode.RIGHT &&
            event.keyCode !== Enum.KeyCode.BACKSAPCE
        ) {
            // Ngăn ngừa các ký tự không phải số
            if (!/^[0-9]*$/.test(event.key)) {
                event.preventDefault();
            }
        }
    }
};
</script>

<style scoped>
@import url("@/assets/css/common/input.css");

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
