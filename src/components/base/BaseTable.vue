<template>
    <div class="m-content-data-table">
        <table class="m-table">
            <thead>
                <tr class="m-table-row">
                    <!-- Cột checkbox mặc định -->
                    <th v-if="isShowCheck" class="m-table-cell m-checkbox-sticky-left">
                        <div class="col-boolean-type">
                            <Checkbox v-model="isCheckAll" @click="handleClickCheckAll"></Checkbox>
                        </div>
                    </th>

                    <!-- render ra số cột table -->
                    <th v-for="(col, index) in props.listCols" :key="index" class="m-table-cell th-col" :class="{
                                            'padding-right-30':
                                                col.columnAlign == Enum.Align.Right,
                                            'table-sticky': col.isSticky,
                                        }" :style="{
                        left: col.isSticky
                            ? calcPositionLeft(
                                index,
                                props.listCols.map(
                                    (item) => item.columnWidth
                                )
                            )
                            : 'auto',
                        minWidth: `${col.columnWidth}px`,
                        maxWidth: `${col.columnWidth}px`,
                        textAlign: `${FormatData.convertAlign(
                            col.columnAlign
                        )}`,
                    }">
                        <div>
                            {{ col.columnDisplay }}
                            <div class="col-filter" @click="toggleFilterForm($event, col)"></div>
                        </div>
                    </th>
                    <!-- Cột Chức Năng mặc định -->
                    <th class="m-table-cell table-center m-row-option" v-if="isShowFunction">
                        Chức năng
                    </th>
                </tr>
            </thead>
            <!-- Hiệu ứng loading trên bảng -->
            <tbody v-if="props.loader">
                <tr v-for="(item, index) in listDatas.length === 0
                                    ? 3
                                    : listDatas.length" :key="index" class="m-table-row table-loader">
                    <td class="m-table-cell m-checkbox-sticky-left" v-if="isShowCheck">
                        <div class="m-table-loader"></div>
                    </td>
                    <td class="m-table-cell col-loader" v-for="(col, index) in props.listCols" :key="index">
                        <div class="m-table-loader"></div>
                    </td>
                    <td class="m-table-cell m-row-option">
                        <div class="m-table-loader"></div>
                    </td>
                </tr>
            </tbody>
            <!-- Có data thì load data -->
            <tbody v-else-if="props.listDatas.length > 0">
                <tr class="m-table-row" :class="{
                                    'row-selected':
                                        idDataTableRow === listData[keyDataTable] ||
                                        listIdSelected.includes(listData[keyDataTable]),
                                }" v-for="listData in props.listDatas" :key="listData[keyDataTable]"
                    @dblclick="handleUpdateItemRow(listData[keyDataTable])"
                    @click="() => (idDataTableRow = listData[keyDataTable])">
                    <!-- Mặc định cột checkbox -->
                    <td v-if="isShowCheck" class="m-table-cell m-table-cell-checkbox m-checkbox-sticky-left"
                        @dblclick="(e) => e.stopPropagation()" @click="(e) => e.stopPropagation()">
                        <div class="col-boolean-type">
                            <input type="checkbox" v-model="listIdSelected" :value="listData[keyDataTable]"
                                class="ms-input-checkbox" />
                        </div>
                    </td>
                    <!-- Render ra cột dữ liệu table linh động với tiêu đề -->
                    <td v-for="(col, index) in props.listCols" class="m-table-cell"
                        :class="{ 'table-sticky': col.isSticky }" :key="index" :style="{
                                                    left: col.isSticky
                                                        ? calcPositionLeft(
                                                            index,
                                                            props.listCols.map(
                                                                (item) => item.columnWidth
                                                            )
                                                        )
                                                        : 'auto',
                                                    minWidth: `${col.columnWidth}px`,
                                                    maxWidth: `${col.columnWidth}px`,
                                                    textAlign: `${FormatData.convertAlign(
                                                        col.columnAlign
                                                    )}`,
                                                }">
                        <div @mouseover="hoverTooltip" @mouseout="cancelTooltip" class="m-limited-line"
                            v-if="col.dataType != Enum.DataType.BoolType" :class="{
                                                            'line-green':
                                                                col.dataType ==
                                                                Enum.DataType.ImportBoolType &&
                                                                listData[FormatData.lowerFirstLetter(col.columnValue)],
                                                            'line-red':
                                                                col.dataType ==
                                                                Enum.DataType.ImportBoolType &&
                                                                !listData[FormatData.lowerFirstLetter(col.columnValue)],
                                                        }">
                            {{
                                                        displayColumnFormated(
                                                        // listData[FormatData.lowerFirstLetter(col.columnValue)],
                                                        listData[col.columnValue],
                                                        col.dataType
                                                        )
                                                        }}
                        </div>
                        <div class="col-boolean-type" v-if="col.dataType == Enum.DataType.BoolType">
                            <Checkbox v-model="listData[
                                                            FormatData.lowerFirstLetter(
                                                                col.columnValue
                                                            )
                                                        ]
                                                            " :disabled="true">
                            </Checkbox>
                        </div>
                    </td>

                    <!-- Mặc định cột chức năng -->
                    <td v-if="isShowFunction" class="m-table-cell m-row-option" @dblclick="(e) => e.stopPropagation()">
                        <div class="edit-option" @click="handleUpdateItemRow(listData[keyDataTable])">
                            Sửa
                        </div>
                        <div class="edit-select-option" @click="openOptionList($event, listData)">
                            <div class="edit-select-icon"></div>
                        </div>
                    </td>
                </tr>
            </tbody>
            <!-- Không có data thì hiện trạng thái không tìm thấy -->
            <div v-else class="table-no-data">
                <img src="@/assets/icon/bg_report_nodata.svg" />
                <div>Không tìm thấy dữ liệu!</div>
            </div>
        </table>
    </div>
    <!-- Popup chức năng Sửa, Xóa, Nhân bản -->
    <teleport to="body">
        <ul :class="['option-list', isUpList ? 'isUp' : 'isDown']" :style="{ top: `${posOptionY}px`, right: '55px' }"
            v-show="isShowOptionList">
            <li class="option-item" @click="handleReplication">Nhân bản</li>
            <li class="option-item" @click="handleRemoveItem">Xóa</li>
            <li class="option-item">Ngừng sử dụng</li>
        </ul>
        <!-- <TableFilter v-click-outside="() => {
            emits('closeFilter');
            isShowFilter = false;
        }
            " v-if="isShowFilter" :top="top" :left="left" :typeFilter="typeFilter" :nameFilter="textFilter"
            @handle-click-filter="handleClickFilter" @close-filter="() => {
                emits('closeFilter');
                isShowFilter = false;
            }
                "></TableFilter> -->
        <BaseTooltip :isShowTooltip="isShowTooltip" :positionX="posTooltipX" :positionY="posTooltipY"
            :contentTooltip="contentTooltip"></BaseTooltip>
    </teleport>
</template>
<script setup>
// import TableFilter from "@/components/filters/TableFilter.vue";
import { ref, defineEmits, defineProps, watch } from "vue";
import FormatData from "@/utils/formatData.js";
import Checkbox from "@/components/base/BaseCheckboxInput.vue";
import Enum from "@/utils/enum.js";
import BaseTooltip from "@/components/base/BaseTooltip.vue";

const emits = defineEmits([
    "handleRemoveItem",
    "handleReplication",
    "handleUpdateItemRow",
    "handleHoverEl",
    "handleCancelTooltip",
    "handleSetListId",
    "closeFilter",
]);
const props = defineProps({
    //Danh sách dữ liệu
    listDatas: {
        type: Array,
        default: () => [],
    },
    //Danh sách các cột
    listCols: {
        type: Array,
        default: () => [],
    },
    //Khóa chính của bảng
    keyDataTable: {
        type: String,
        default: null,
    },
    //Mảng chứa id xóa nhiều
    listIdSelected: {
        type: Array,
    },
    //Hiệu ứng loading trong bảng
    loader: {
        type: Boolean,
        default: false,
    },
    //Có hiển thị cột checkbox không
    isShowCheck: {
        type: Boolean,
        default: true,
    },
    //Có hiển thị cột chức năng không
    isShowFunction: {
        type: Boolean,
        default: true,
    },
});

//Biến thể hiện trạng thái ẩn hiện chức năng Xóa, Nhân bản
const isShowOptionList = ref(false);

//Biến thể hiện trạng thái ở trên hay dưới của chức năng Xóa, Nhân bản
const isUpList = ref(false);

//Biến lưu giá trị position Y của chức năng Xóa, Nhân bản
const posOptionY = ref(null);

//Biến lưu id của một dòng dữ liệu trên bảng
const idDataTableRow = ref(null);

//Biến lưu dữ liệu của 1 dòng
const rowData = ref({});

//Biến show form lọc theo từng cột
const isShowFilter = ref(false);

//Loại input để lọc, ví dụ text, date, gender
const typeFilter = ref(1);

/**
 * Hàm thực hiện format dữ liệu trước khi đưa vào bảng
 * Author: NDKien - (25/06/2023)
 * @param {String} displayName
 * @param {Enum} dataType
 */
const displayColumnFormated = (displayName, dataType) => {
    switch (dataType) {
        case Enum.DataType.StringType:
            return displayName;
        case Enum.DataType.GenderType:
            return FormatData.convertGender(Number(displayName));
        case Enum.DataType.DateType:
            return FormatData.formatDate(displayName);
        case Enum.DataType.MoneyType:
            return FormatData.formatMoney(displayName);
        case Enum.DataType.BoolType:
            return displayName ? "x" : "";
        // case Enum.DataType.ImportBoolType:
        //     if (displayName) {
        //         return "Hợp lệ!";
        //     } else {
        //         return "Không hợp lệ!";
        //     }
    }
};

/**
 * Hàm thực hiện chức năng đóng mở chức năng Xóa, Nhân bản
 * Author: NDKien - (24/06/2023)
 * @param {Object} event
 * @param {String} id
 */
const openOptionList = (event, data) => {
    //isShowOptionList.value = !isShowOptionList.value;
    if (
        !isShowOptionList.value ||
        idDataTableRow.value !== data[props.keyDataTable]
    ) {
        //Lấy ra vị trí của nút more vừa ấn
        const posY = event.target.getBoundingClientRect().top;
        //Gán id của dòng dữ liệu bằng id vừa click
        rowData.value = data;
        idDataTableRow.value = data[props.keyDataTable];
        isShowOptionList.value = true;
        //Hiển thị phía dưới row của chức năng Xóa, Nhân bản
        if (event.clientY < 505) {
            isUpList.value = false;
            posOptionY.value = posY + 18;
        } else {
            //Hiển thị phía trên row của chức năng Xóa, Nhân bản
            isUpList.value = true;
            posOptionY.value = posY - 112;
        }
    } else isShowOptionList.value = false;
};

/**
 * Hàm click vào bên ngoài đóng chức năng Xóa, Nhân bản
 * Author: NDKien - (24/06/2023)
 * @param {Event} e
 */
const clickOutSide = (e) => {
    if (
        !e.target.classList.contains("option-item") &&
        !e.target.classList.contains("option-list") &&
        !e.target.classList.contains("edit-select-option") &&
        !e.target.classList.contains("edit-select-icon")
    ) {
        isShowOptionList.value = false;
    }
};

/**
 * Theo dõi biến isShowOptionList để click ouside đóng chức năng Xóa, Nhân bản
 * Author: NDKien - (24/06/2023)
 */
watch(isShowOptionList, () => {
    if (isShowOptionList.value) {
        document.addEventListener("click", clickOutSide);
    } else {
        document.removeEventListener("click", clickOutSide);
    }
});

/**
 * Khi ấn vào chức năng xóa
 */
const handleRemoveItem = () => {
    isShowOptionList.value = false;
    emits("handleRemoveItem", rowData.value);
};

const handleReplication = () => {
    isShowOptionList.value = false;
    emits("handleReplication", rowData.value);
};

/**
 * Khi ấn dblclick và row hoặc nút sửa
 */
const handleUpdateItemRow = (id) => {
    emits("handleUpdateItemRow", id);
};

//#region Xử lý lọc theo cột
const top = ref(null);
const left = ref(null);
const nameFilter = ref(null);
const textFilter = ref(null);
/**
 * Hàm xử lý mở form lọc
 * Author: NDKien - 10/06/2023
 * @param {*} e
 * @param {*} col
 */
const toggleFilterForm = (e, col) => {
    if (!isShowFilter.value || col.columnValue !== nameFilter.value) {
        //Loại input hiển thị trong form lọc
        typeFilter.value = col.dataType;
        //Lấy text hiển thị lọc theo cột nào
        textFilter.value = col.columnDisplay;
        //Lấy ra tên cột cần lọc
        nameFilter.value = col.columnValue;
        //Set vị trí khi hiển thị
        top.value = e.target.getBoundingClientRect().top + 27;
        left.value = e.target.getBoundingClientRect().left - 326;
        isShowFilter.value = true;
    } else {
        isShowFilter.value = false;
    }
};

/**
 * Hàm xử lý lọc theo cột, Emit ra ngoài để xử lý gọi API
 * Author: NDKien - (10/06/2023)
 * @param {*} value
 * @param {*} option
 */
// const handleClickFilter = (value, option) => {
//     isShowFilter.value = false;
//     //Dữ liệu lọc
//     const filter = {
//         option: option,
//         columnValue: value,
//         columnName: nameFilter.value,
//         columnDisplay: textFilter.value,
//         columnDataType: typeFilter.value,
//     };
//     switch (nameFilter.value) {
//         case "Gender":
//             filter.option = Enum.FilterCondition.Equal;
//             break;
//     }
//     emits("handleClickFilter", filter);
// };
//#endregion

//#region Xử lý checkbox
const listIdSelected = ref([]);
const isCheckAll = ref(false);
/**
 * Hàm xử lý check tất cả
 * Author: NDKien - ()
 */
const handleClickCheckAll = () => {
    isCheckAll.value = !isCheckAll.value;
    //Nếu là chọn tất cả thì thêm tất cả id vào listIdSelected
    if (isCheckAll.value) {
        props.listDatas.forEach((item) => {
            if (!listIdSelected.value.includes(item[props.keyDataTable]))
                listIdSelected.value.push(item[props.keyDataTable]);
        });
    }
    //Nếu bỏ chọn tất cả thì chỉ xóa những id ở trang hiện tại thôi
    else {
        //Lấy ra danh sách id ở trang hiện tại
        const currentIds = props.listDatas.map(
            (item) => item[props.keyDataTable]
        );
        //Thực hiện xóa những id có ở trang hiện tại
        listIdSelected.value = listIdSelected.value.filter(
            (item) => !currentIds.includes(item)
        );
    }
};

/**
 * Hàm set trạng thái ô checkall
 * Author: NDKien - (04/06/2023)
 */
const setActiveCheckAll = () => {
    //Lấy ra danh sách id ở trang hiện tại
    const currentIds = props.listDatas.map((item) => item[props.keyDataTable]);

    //Kiểm tra nếu {currentIds} có trong list id đã chọn thì active ô checkall
    const idExists = currentIds.every((item) =>
        listIdSelected.value.includes(item)
    );
    if (idExists && currentIds.length > 0) {
        isCheckAll.value = true;
    } else {
        isCheckAll.value = false;
    }
};

//Theo dõi listDatas và listIdSelected thay đổi để set checkall và cập nhật list id ra bên ngoài component cha
watch(
    () => props.listDatas,
    () => {
        setActiveCheckAll();
    },
    { deep: true }
);
watch(
    listIdSelected,
    () => {
        debugger
        setActiveCheckAll();
        emits("handleSetListId", listIdSelected.value);
    },
    { deep: true }
);

//Theo dõi danh sách id từ bên ngoài, nếu thay đổi khi xóa(mảng rỗng) => Cập nhật ở bên trong
watch(
    () => props.listIdSelected,
    (newVal) => {
        if (newVal.length === 0) {
            listIdSelected.value.length = 0;
        }
    }
);
//#endregion

/**
 * Hàm tính toán vị trí left để thực hiện cố định cột
 * NDKien - (28/06/2023)
 * @param {*} end
 * @param {*} array
 */
const calcPositionLeft = (end, array) => {
    if (end != 0) {
        const left = array.reduce((acc, curr, index) => {
            if (index <= end - 1) {
                return acc + curr;
            } else {
                return acc;
            }
        }, 0);
        return `${left + 50}px`;
    } else {
        return "50px";
    }
};

//#region - Xử lý tooltip
const isShowTooltip = ref(false);
const posTooltipX = ref(null);
const posTooltipY = ref(null);
const contentTooltip = ref(null);
/**
 * Hàm hiện tooltip khi hover vào nội dung trong bảng
 * Create by: NDKien - (04/06/2023)
 * @param {*} event
 */
const hoverTooltip = (event) => {
    contentTooltip.value = event.target.innerText;
    if (contentTooltip.value !== "") {
        posTooltipX.value = event.clientX;
        posTooltipY.value = event.clientY;
        isShowTooltip.value = true;
    } else {
        isShowTooltip.value = false;
    }
};
/**
 * Hàm đóng tooltip khi hover ra ngoài nội dụng
 * Create by: NDKien - (04/06/2023)
 */
const cancelTooltip = () => {
    isShowTooltip.value = false;
};
//#endregion
</script>

<style scoped>
@import url("@/assets/css/components/table.css");

.table-loader .col-loader {
    position: relative !important;
}

.m-table-loader {
    position: absolute;
    top: 50%;
    left: 50%;
    height: 40%;
    transform: translate(-50%, -50%);
    width: 80%;
    animation: loader linear 0.8s infinite;
}

.col-boolean-type {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;
}

@keyframes loader {
    0% {
        background-color: #eee;
    }

    50% {
        background-color: #cfcfcf;
    }

    100% {
        background-color: #eee;
    }
}

.table-sticky {
    position: sticky;
    top: 0;
    z-index: 1;
}

.padding-right-30 {
    padding-right: 30px;
}

.line-green {
    color: var(--primary-color);
}

.line-red {
    color: red;
}

.m-limited-line {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 1;
    white-space: normal;
}
</style>
