<template>
    <div class="m-filter-result">
        <div class="m-filter-result-item" v-for="(item, index) in props.filterResult" :key="index">
            <span>
                {{
                    formatFilterDisplay(
                        item.columnDisplay,
                        item.option,
                        item.columnValue,
                        item.columnDataType
                    )
                }}
            </span>
            <div @click="() => emits('removeFilter', index)"></div>
        </div>
        <div class="delete-filter" v-if="props.filterResult.length > 0" @click="() => emits('removeAllFilter')">
            Xóa điều kiện lọc
        </div>
    </div>
</template>
<script setup>
/* eslint-disable */
import Enum from "@/utils/enum.js";
import { useStore } from "vuex";
const store = useStore();
import { defineProps, defineEmits } from "vue";
import Resources from "@/utils/resources";
import FormatData from "@/utils/formatData";

const emits = defineEmits(["removeAllFilter", "removeFilter"]);
const props = defineProps({
    //Mảng kết quả lọc: [{columnName: "Mã nhân viên", columnValue: "Hùng"}]
    filterResult: {
        type: Array,
        default: () => [],
    },
});

const filterCondition = store.state.employee.filterCondition;
/**
 * Hàm format lại kiểu hiển thị kết quả lọc theo cột
 * Author: NDKien - (12/06/2023)
 * @param {*} display
 * @param {*} option
 * @param {*} value
 * @param {*} type
 */
const formatFilterDisplay = (display, option, value, type) => {
    //Lấy ra tên hiển thị theo đều kiện lọc(Chứa, bằng...)
    const displayOption = filterCondition.filter(
        (condition) => condition.key == option
    )[0].value;
    if (
        option == Enum.FilterCondition.Null ||
        option == Enum.FilterCondition.NotNull
    ) {
        return `${display} ${displayOption}`;
    } else {
        if (type == Enum.DataType.GenderType)
            switch (Number(value)) {
                case Enum.Gender.Male:
                    value = Resources.GenderName.VI.Male;
                    break;
                case Enum.Gender.Female:
                    value = Resources.GenderName.VI.Female;
                    break;
                case Enum.Gender.Other:
                    value = Resources.GenderName.VI.Other;
                    break;
            }
        else if (type == Enum.DataType.DateType) {
            value = FormatData.formatDate(value);
        }
        return `${display} ${displayOption.toLowerCase()} "${value}"`;
    }
};
</script>
<style scoped>
.m-filter-result {
    display: flex;
    flex-wrap: wrap;
    column-gap: 10px;
    max-width: 600px;
}

.m-filter-result-item {
    display: flex;
    align-items: center;
    column-gap: 6px;
}

.m-filter-result-item span {
    display: block;
    color: #0075c0;
}

.m-filter-result-item div {
    background: url("@/assets/icon/Sprites.4b10a131.svg") no-repeat -80px -312px;
    width: 16px;
    height: 16px;
    min-width: 16px;
    min-height: 16px;
    cursor: pointer;
}

.delete-filter {
    user-select: none;
    color: #0075c0;
    cursor: pointer;
}

.delete-filter:hover {
    text-decoration: underline;
}
</style>
