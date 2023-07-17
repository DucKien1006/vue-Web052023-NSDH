<template>
    <div
        @click="() => (isChecked = !isChecked)"
        :class="{ 'misa-checkbox': true, 'misa-checkbox-checked': isChecked }"
    >
        <div></div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            isChecked: false,
        };
    },
    props: {
        stateCheckAll: Boolean,
    },
    //Trạng thái checked của checkbox
    watch: {
        stateCheckAll(newVal) {
            this.isChecked = newVal;
        },
    },
};
</script>

<style scoped>
@keyframes checked {
    from {
        transform: rotate(-90deg);
    }

    to {
        transform: rotate(0deg);
    }
}
@keyframes checkedReverse {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(-90deg);
    }
}
.misa-checkbox {
    width: 18px;
    height: 18px;
    border-radius: 2px;
    border: 1px solid #8d9096;
    cursor: pointer;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: checkedReverse 0.1s ease-in-out;
    background-color: #fff;
}

.misa-checkbox-checked {
    border-color: #35bf22;
    transform: rotate(0deg);
    animation: checked 0.1s ease-in-out;
    background-color: #fff;
}

.misa-checkbox-checked div {
    background: url("@/assets/icon/Sprites.4b10a131.svg") no-repeat -1225px -363px;
    width: 14px;
    height: 11px;
}
</style>
