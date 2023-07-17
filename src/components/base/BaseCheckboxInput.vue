<template>
    <div class="m-checkbox-box">
        <input type="checkbox" v-model="value" :checked="isChecked"
            @change="$emit('update:modelValue', $event.target.checked)" class="m-input-checkbox"
            :class="{ 'm-checkbox-disbale': disabled }" :disabled="disabled" />
        <label class="label-checkbox" v-if="label">{{ label }}</label>
    </div>
</template>

<script>
export default {
    props: {
        label: {
            type: String,
            required: true,
        },
        modelValue: {
            type: Boolean,
            default: false,
        },
        checkAll: {
            type: Boolean,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
    },
    computed: {
        isChecked: {
            get() {
                return this.modelValue;
            },
            set(value) {
                this.$emit("update:modelValue", value);
            },
        },
    },
    watch: {
        checkAll(newVal) {
            this.$emit("update:modelValue", newVal);
        },
    },
};
</script>
<style scoped>
.m-checkbox-box {
    display: flex;
    align-items: center;
    column-gap: 8px;
}

.m-input-checkbox {
    display: block;
    width: 18px;
    height: 18px;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    border: 1px solid #8d9096;
    border-radius: 2px;
    position: relative;
    outline: none;
    background-color: #fff;
    cursor: pointer;
}

.m-input-checkbox::after {
    content: "";
    background: url(@/assets/icon/Sprites.64af8f61.svg) no-repeat -1225px -363px;
    width: 14px;
    height: 11px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: none;
}

.m-input-checkbox:checked {
    border: 1px solid #2ca01c;
    background-color: #fff;
    animation: rotate linear 0.1s;
}

.m-input-checkbox:checked::after {
    display: block;
}

@keyframes rotate {
    from {
        transform: rotate(-90deg);
    }

    to {
        transform: rotate(0deg);
    }
}

.m-checkbox-disbale {
    background-color: #e8e9ec;
    cursor: default;
    border: 1px solid #afafaf;
}

.m-checkbox-disbale::after {
    content: "";
    background: url(@/assets/icon/Sprites.64af8f61.svg) no-repeat -1273px -363px;
    width: 14px;
    height: 11px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: none;
}

.m-checkbox-disbale:checked {
    border: 1px solid #afafaf;
    background-color: #e8e9ec;
    animation: rotate linear 0.1s;
}

.m-checkbox-disbale:checked::after {
    display: block;
}

.label-checkbox {
    font-family: MisaFont;
    font-size: 13px;
}
</style>
