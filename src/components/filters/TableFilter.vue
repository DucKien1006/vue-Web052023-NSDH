<template>
    <div class="drop__box__func_Filter" :style="{ top: `${props.top}px`, left: `${props.left}px` }" ref="drop_box_filter">
        <div class="drop__box__func_Filter_listItem">
            <div class="drop__box__func_Filter_listItem_item">
                <div class="drop__box__func_Filter_listItem_item_icon"></div>
                <span>Cố định cột này</span>
            </div>
            <div class="drop__box__func_Filter_listItem_item item_list_two">
                <div class="drop__box__func_Filter_listItem_item_left">
                    <span>Lọc theo {{ nameFilter }}</span>
                </div>
                <BaseDropdown v-if="props.typeFilter !== Enum.DataType.GenderType &&
                    props.typeFilter !== Enum.DataType.BoolType
                    " :isTextChange="true" propKey="key" propValue="value" v-model:value="option"
                    :items="options" :isShowContent="true"></BaseDropdown>
            </div>
            <div class="drop__box__func_Filter_listItem_item_input">
                <BaseInput v-if="props.typeFilter === Enum.DataType.StringType ||
                    props.typeFilter === Enum.DataType.MoneyType
                    " height="30px" type="text" placeholder="Nhập giá trị lọc" v-model="valueFilter"
                    :focus="isFocus" @handleBlurInput="() => (isFocus = false)" :tabIndex="1" :disable="isDiable">
                </BaseInput>
                <BaseDatepicker v-else-if="props.typeFilter === Enum.DataType.DateType" height="30px" v-model="valueFilter"
                    :tabIndex="1" :disable="isDiable"></BaseDatepicker>
                <BaseCombobox v-else-if="props.typeFilter === Enum.DataType.GenderType" :height="30" :data="gender"
                    propValue="value" propName="text" v-model="valueFilter" :tabIndex="1"></BaseCombobox>
                <!-- <BaseRadioButton
                    v-if="props.typeFilter === Enum.DataType.BoolType"
                    :listItem="[
                        { display: 'Có', value: `0` },
                        { display: 'Không', value: '1' },
                    ]"
                    v-model="valueFilter"
                ></BaseRadioButton> -->
            </div>
            <div class="drop__box__func_Filter_listItem_item">
                <BaseButton isExtra text="Bỏ lọc" height="28px" minWidth="60px" :tabIndex="3" @keydown="(e) => {
                        if (e.keyCode === Enum.KeyCode.TAB) {
                            e.preventDefault();
                            isFocus = true;
                        }
                    }
                    " @click="() => {
            emits('closeFilter');
        }
        "></BaseButton>
                <BaseButton text="Lọc" height="28px" minWidth="40px" @click="handleClickFilter" :tabIndex="2"></BaseButton>
            </div>
        </div>
    </div>
</template>
<script setup>
import Enum from "@/utils/enum.js";
import { ref, defineProps, defineEmits, watch } from "vue";
import BaseDatepicker from "@/components/base/BaseDatepicker.vue";
import BaseCombobox from "@/components/base/BaseCombobox.vue";
import BaseInput from "@/components/base/BaseInput.vue";
import BaseButton from "@/components/base/BaseButton.vue";
import BaseDropdown from "@/components/base/BaseDropdown.vue";
//import BaseRadioButton from "../base/BaseRadioButton.vue";
import { useStore } from "vuex";
import Resources from "@/utils/resources";
const store = useStore();

const emits = defineEmits(["handleClickFilter", "closeFilter"]);

const props = defineProps({
    //Vị trị hiển thị theo chiều cao
    top: {
        type: Number,
    },
    //Vị trí hiển thị theo chiều đứng
    left: {
        type: Number,
    },
    //Lọc theo tên cột nào(VD: Cột tên nhân viên)
    nameFilter: {
        type: String,
        default: "",
    },
    //Kiểu dữ liệu lọc tùy từng loại cột(VD: Giới tính-> Combobox, Tên -> Tnput...)
    typeFilter: {
        type: Number,
        default: 1,
    },
});
const isFocus = ref(false);

//Lấy danh sách điều kiện lọc tùy theo từng cột
const options = ref([]);
if (props.typeFilter === Enum.DataType.StringType) {
    options.value = store.state.employee.filterCondition.filter(
        (item) =>
            item.accept == Enum.Accept.Both || item.accept == Enum.Accept.Text
    );
} else if (
    props.typeFilter === Enum.DataType.DateType ||
    props.typeFilter === Enum.DataType.MoneyType
) {
    options.value = store.state.employee.filterCondition.filter(
        (item) =>
            item.accept == Enum.Accept.Both || item.accept == Enum.Accept.Date
    );
}

//List gender
const gender = ref([
    {
        text: Resources.GenderName.VI.Male,
        value: Enum.Gender.Male,
    },
    {
        text: Resources.GenderName.VI.Female,
        value: Enum.Gender.Female,
    },
    {
        text: Resources.GenderName.VI.Other,
        value: Enum.Gender.Other,
    },
]);

//Những kiều kiện sẽ không cho nhập vào input, disable input
const listDisable = [Enum.FilterCondition.Null, Enum.FilterCondition.NotNull];
const isDiable = ref(false);

//Giá trị lọc
const valueFilter = ref(null);

//Lọc theo điều kiện nào(Chứa, bằng, trống...), mặc định để chứa
const option = ref(Enum.FilterCondition.Contain);

//Theo dõi nếu điều kiện lọc có trong {listDisable} thì disable ô input nhập liệu
watch(option, (newVal) => {
    if (listDisable.includes(newVal)) {
        isDiable.value = true;
    } else {
        isDiable.value = false;
    }
});

/**
 * Hàm xử lý gửi giá trị và điều kiện lọc khi click button lọc
 * NDKien - (08/06/2023)
 */
const handleClickFilter = () => {
    emits("handleClickFilter", valueFilter.value, option.value);
};
</script>
<style scoped>
.drop__box__func_Filter {
    position: fixed;
    z-index: 5;
    padding: 22px 17px;
    border: 1px solid #babec5;
    background: #fff;
    min-width: 350px;
    max-width: 350px;
    width: -moz-fit-content;
    width: fit-content;
    font-weight: 400;
    font-size: 13px;
    border-radius: 2px;
    box-shadow: 0 3px 20px rgba(0, 0, 0, 0.039);
}

.drop__box__func_Filter_listItem_item {
    display: flex;
    align-items: center;
}

.drop__box__func_Filter_listItem_item:first-child {
    padding-bottom: 14px;
    border-bottom: 1px solid #ebedf0;
}

.drop__box__func_Filter_listItem_item:first-child span {
    margin-left: 6px;
}

.drop__box__func_Filter_listItem_item_icon {
    background: url("@/assets/icon/Sprites.4b10a131.svg") no-repeat -1726px -560px;
    width: 24px;
    height: 24px;
    min-width: 24px;
    min-height: 24px;
}

.item_list_two {
    margin-top: 16px;
    justify-content: space-between;
    font-weight: 600;
    cursor: pointer;
    margin-bottom: 4px;
}

.drop__box__func_Filter_listItem_item_right {
    display: flex;
    align-items: center;
}

.drop__box__func_Filter_listItem_item_right span {
    white-space: nowrap;
    font-family: MISAFont;
    margin-right: 4px;
    line-height: 36px;
    color: #0075c0 !important;
}

.drop__box__func_Filter_listItem_item_right_icon {
    background: url("@/assets/icon/Sprites.4b10a131.svg") no-repeat -178px -362px;
    width: 12px;
    height: 12px;
    min-width: 12px;
    min-height: 12px;
}

.drop__box__func_Filter_listItem_item_input {
    margin-top: 16px;
    margin-bottom: -4px;
}

.drop__box__func_Filter_listItem_item:last-child {
    justify-content: space-between;
    margin-top: 16px;
}

.option-filter {
    display: flex;
    align-items: center;
    column-gap: 6px;
}

.option-filter span {
    display: block;
    color: #0075c0;
}

.option-filter div {
    background: url("@/assets/icon/Sprites.4b10a131.svg") no-repeat -1772px -528px;
    width: 12px;
    height: 7px;
}
</style>
