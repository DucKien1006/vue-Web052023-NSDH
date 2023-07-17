<template>
    <div class="m-combobox-container">
        <label v-if="label">{{ label }}
            <span style="color: red" v-if="required">*</span>
        </label>
        <div class="m-combobox-wrapper" :class="{ 'is-error': props.isError }" :style="{ width: `${props.width}px` }">
            <!-- Input nhập tìm kiếm -->
            <input ref="inputTag" type="text" class="m-combobox-input" :disabled="props.disabled" :style="{
                width: `${props.width - 32}px`,
                height: `${props.height}px`,
            }" v-model="textInput" @input="onSearchInput" @keydown="onKeyDownInput" :tabindex="props.tabIndex" />
            <!-- Button xổ ra list item -->
            <div class="m-combobox-button" :style="{ height: `${props.height}px` }" @click="toggleComboboxList">
                <div class="m-combobox-icon" :class="isShowListData ? 'rotate-icon-180' : 'rotate-icon-0'
                    "></div>
            </div>
            <!-- List data của combobox -->
            <div class="m-combobox-data" :class="isUp ? 'is-up' : 'is-down'" :style="{
                maxHeight: `${props.height * 5 + 10}px`,
            }" v-show="isShowListData">
                <a class="m-combobox-item" :class="{ 'm-item-selected': index == indexItemSelected }"
                    :style="{ minHeight: `${props.height}px` }" v-for="(item, index) in dataFilter" :key="index"
                    @click="onSelectItem(item, index)" v-show="dataList.length > 0 || dataFilter.length != 0">{{
                        props.propName ? item[props.propName] : item }}</a>
                <a v-show="dataList.length == 0 || dataFilter.length == 0" class="m-combobox-item m-no-data"
                    :style="{ minHeight: `${props.height}px` }">Không có dữ liệu hiển thị!</a>
            </div>
        </div>
        <span class="error-message" v-if="props.isError">{{
            props.messageError
        }}</span>
    </div>
</template>
<script setup>
/* eslint-disable */
import {
    defineProps,
    ref,
    onBeforeMount,
    defineEmits,
    watch,
    computed,
} from "vue";
import Enum from "@/utils/enum.js";
import axios from "axios";

const emits = defineEmits(["update:modelValue"]);

const props = defineProps({
    //Chiều cao của combobox
    height: {
        type: Number,
        default: 28,
    },
    //Độ rộng của combobox
    width: {
        type: Number,
    },
    //Link api lấy dữ liệu
    url: {
        type: String,
        default: "",
    },
    //Dữ liệu nhập vào nếu data không lấy từ api
    data: {
        type: Array,
        default: () => [],
    },
    //Giá trị thực
    propValue: {
        type: String,
    },
    //Giá trị hiển thị
    propName: {
        type: String,
    },
    modelValue: {
        type: [String, Boolean, Number],
    },
    tabIndex: {
        type: Number,
        default: -1,
    },
    //Border đỏ để validate
    isError: {
        type: Boolean,
        default: false,
    },
    //Thông báo lỗi. đi kèm với isError
    messageError: {
        type: String,
        default: "",
    },
    label: {
        type: String,
        default: "",
    },
    required: {
        type: Boolean,
        default: false,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
});
//Active item được chọn
const indexItemSelected = ref(null);

//Biến ẩn hiện danh sách
const isShowListData = ref(false);

//Biến lưu data của combobox
const dataList = ref([]);
const dataFilter = ref([]);

//Text hiển thị trong input
const textInput = ref(null);

//Focus vào input
const inputTag = ref(null);
const toggleComboboxList = () => {
    isShowListData.value = !isShowListData.value;
};

/**
 * Hàm xử lý khi click vào item trong combobox
 * Author: NDKien - (30/06/2023)
 */
const onSelectItem = (item, index) => {
    indexItemSelected.value = index; //Set item selected
    textInput.value = item[props.propName]; //Binding text vào input
    emits("update:modelValue", item[props.propValue]); //Cập nhật v-model
    isShowListData.value = false;
};

/**
 * Hàm xử lý khi di chuyển lên xuống tự động chọn item
 * Author: NDKien - (30/06/2023)
 */
const onSelectWhenArrowKey = (item) => {
    try {
        textInput.value = item[props.propName];
        emits("update:modelValue", item[props.propValue]);
    } catch (ex) {
        console.log(ex);
    }
};

/**
 * Hàm xử lý lọc trong combobox
 * Author: NDKien - (30/06/2023)
 * @param {*} e
 */
const onSearchInput = () => {
    try {
        dataFilter.value = dataList.value.filter((item) =>
            item[props.propName]
                .toLowerCase()
                .includes(textInput.value.toLowerCase())
        );
        if (dataFilter.value.length == 0) {
            emits("update:modelValue", "aa");
        }
        isShowListData.value = true;
    } catch (error) {
        console.log(error);
    }
};

/**
 * Xử lý lựa chọn item khi ấn lên, xuống và enter
 * Author: NDKien - (30/06/2023)
 */
const onKeyDownInput = (event) => {
    try {
        const keycode = event.keyCode;
        switch (keycode) {
            case Enum.KeyCode.DOWN:
                if (isShowListData.value && dataFilter.value.length != 0) {
                    //khi ấn xuống set vào vị trí đầu tiên và tạo vòng lặp khi đến item cuối
                    if (
                        indexItemSelected.value == null ||
                        indexItemSelected.value == dataFilter.value.length - 1
                    ) {
                        indexItemSelected.value = 0;
                    } else {
                        indexItemSelected.value++;
                    }
                    //Cập nhật lại giá trị
                    onSelectWhenArrowKey(
                        dataFilter.value[indexItemSelected.value]
                    );
                }
                isShowListData.value = true;
                break;
            case Enum.KeyCode.UP:
                if (isShowListData.value && dataFilter.value.length != 0) {
                    //khi ấn xuống set vào vị trí cuối và tạo vòng lặp khi đến item cuối
                    if (!indexItemSelected.value) {
                        indexItemSelected.value = dataFilter.value.length - 1;
                    } else {
                        indexItemSelected.value--;
                    }
                    onSelectWhenArrowKey(
                        dataFilter.value[indexItemSelected.value]
                    );
                }
                isShowListData.value = true;
                break;
            case Enum.KeyCode.ENTER:
                //Đóng, mở combobox
                isShowListData.value = !isShowListData.value;
                break;
            case Enum.KeyCode.TAB:
                //Đóng combobox lại
                isShowListData.value = false;
                break;
        }
    } catch (ex) {
        console.log(ex);
    }
};

//Nếu datafilter mà thay đổi thì chọn lại item
watch(dataFilter, () => {
    if (dataFilter.value.length !== dataList.value.length)
        indexItemSelected.value = null;
});

/**
 * Hàm binding ngược lại khi component cha truyền v-model vào
 * Author: NDKien - (30/06/2023)
 * @param {*} value
 */
const setTextInputByModelValue = (value) => {
    try {
        let indexSelected = null;
        if (value == null) {
            textInput.value = "";
            indexItemSelected.value = null;
        } else {
            const itemSelected = dataList.value.find((item, index) => {
                if (item[props.propValue] === value) {
                    indexSelected = index;
                    return item[props.propValue] === value;
                }
            });

            if (itemSelected) {
                textInput.value = itemSelected[props.propName];
                indexItemSelected.value = indexSelected;
            } else {
                textInput.value = "";
                indexItemSelected.value = null;
            }
        }
    } catch (ex) {
        console.log(ex);
    }
};

/**
 * Hàm lấy dữ liệu vào combobox
 * Author: NDKien - (30/06/2023)
 */
const loadData = async () => {
    //Nếu có link api thì thực hiện call api
    if (props.url) {
        const response = await axios.get(props.url);
        dataList.value = response.data;
        dataFilter.value = response.data;
    }
    //Nếu không thì nhận data từ bên ngoài
    else if (props.data) {
        dataList.value = props.data;
        dataFilter.value = props.data;
    }
};

/**
 * Lấy dữ liệu cho combobox
 * Author: NDKien - (30/06/2023)
 */
onBeforeMount(() => {
    loadData();
    setTextInputByModelValue(props.modelValue);
});

watch(
    () => props.modelValue,
    (newVal) => {
        setTextInputByModelValue(newVal);
    }
);

/**
 * Hàm xử lý hiển thị trên dưới của list data
 * Author: NDKien - (24/06/2023)
 */
const isUp = ref(false);
const setPositionListData = () => {
    const position = inputTag.value.getBoundingClientRect();
    if (position.y > window.innerHeight - props.height * 6) {
        isUp.value = true;
    }
};

/**
 * Hàm click vào bên ngoài đóng đóng combobox
 * Author: NDKien - (24/06/2023)
 * @param {Event} e
 */
const clickOutSide = (e) => {
    if (
        !e.target.classList.contains("m-combobox-data") &&
        !e.target.classList.contains("m-combobox-icon") &&
        !e.target.classList.contains("m-combobox-button") &&
        !e.target.classList.contains("m-combobox-input") &&
        !e.target.classList.contains("m-combobox-item")
    ) {
        isShowListData.value = false;
    }
};

/**
 * Theo dõi biến isShowListData để thêm sự kiện clickoutside đóng combobox
 * Author: NDKien - (24/06/2023)
 */
watch(isShowListData, () => {
    if (isShowListData.value) {
        //Thêm tiện ích khi mở list ra thì tự động focus vào input
        inputTag.value.focus();
        setPositionListData();
        document.addEventListener("click", clickOutSide);
    } else {
        inputTag.value.blur();
        document.removeEventListener("click", clickOutSide);
    }
});
</script>
<style scoped>
.m-combobox-container {
    position: relative;
    display: flex;
    flex-direction: column;
    row-gap: 6px;
}

.m-combobox-container label {
    font-family: MISAFontBold;
}

.m-combobox-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    border: 1px solid #bbbbbb;
    background-color: #fff;
    border-radius: 3px;
}

.m-combobox-input {
    display: block;
    outline: none;
    padding: 0 8px;
    border: unset;
    border-radius: 3px;
    font-size: 13px;
    flex: 1;
    color: #1f1f1f;
}

.m-combobox-wrapper:has(.m-combobox-input:focus) {
    border: 1px solid #2ca01c;
}

.m-combobox-button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 32px;
    cursor: pointer;
    border-radius: 0 2px 2px 0;
}

.m-combobox-button:hover {
    background-color: #e0e0e0;
}

.m-combobox-icon {
    background: url(http://localhost:8080/img/Sprites.64af8f61.2ff7618a.svg) no-repeat -560px -359px;
    width: 16px;
    height: 16px;
}

.m-combobox-data {
    position: absolute;
    right: -1px;
    left: -1px;
    display: flex;
    flex-direction: column;
    background-color: #fff;
    border-radius: 3px;
    padding: 4px 0;
    border: 1px solid #bbbbbb;
    overflow: hidden overlay;
    z-index: 10;
}

.m-combobox-data::-webkit-scrollbar {
    width: 10px;
    height: 10px;
}

.m-combobox-data::-webkit-scrollbar-thumb {
    background-color: #c9ccd0d7;
}

.m-combobox-data::-webkit-scrollbar-thumb:hover {
    background-color: #a6a9af;
}

.m-combobox-data::-webkit-scrollbar-track {
    background-color: #f1f1f1;
}

.m-combobox-item {
    height: 32px;
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 0 8px;
    font-size: 13px;
    font-family: MISAFont;
    color: #111;
    user-select: none;
}

.m-no-data {
    justify-content: center;
}

.m-combobox-item:hover {
    background-color: #e0e0e0;
    color: #2ca01c;
}

.m-item-selected {
    background-color: #2ca01c;
    color: #fff;
}

.m-item-selected:hover {
    background-color: #2ca01c;
    color: #fff;
}

.rotate-icon-180 {
    transform: rotate(180deg);
    transition: transform 0.15s linear;
}

.rotate-icon-0 {
    transform: rotate(0deg);
    transition: transform 0.15s linear;
}

.is-error {
    border: 1px solid red !important;
}

.is-error:has(.m-combobox-input:focus) {
    border: 1px solid red;
}

.is-error:hover~.error-message {
    display: inline-block;
}

.error-message {
    display: none;
    background-color: #4d4d4d;
    font-family: MISAFont;
    padding: 4px 10px;
    position: absolute;
    top: 90%;
    left: 50%;
    transform: translateX(-50%);
    min-width: fit-content;
    color: #ffffff;
    z-index: 100;
    font-size: 11px;
    border-radius: 2px;
}

.disable {
    pointer-events: none;
}

.is-up {
    bottom: calc(100% + 4px) !important;
}

.is-down {
    top: calc(100% + 4px) !important;
}
</style>
