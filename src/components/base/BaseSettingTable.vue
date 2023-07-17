<template>
    <BaseOverlay>
        <div class="m-modal-setting">
            <div class="m-modal-setting-header">
                <div class="m-modal-title">Tùy chỉnh giao diện</div>
                <div class="m-modal-setting-icon">
                    <div class="m-btn-question"></div>
                    <div value="Thoát (ESC)" class="m-btn-close" @click="() => emits('hideModalSetting')"></div>
                </div>
            </div>
            <div class="m-modal-search">
                <BaseInput width="220px" placeholder="Nhập từ khóa tìm kiếm" isSearch v-model="searchColumn"></BaseInput>
                <div class="m-edit-column" @click="() => (isEditColumn = !isEditColumn)">
                    Sửa tên cột và hiển thị độ rộng
                </div>
            </div>
            <div class="m-modal-body">
                <table class="m-table">
                    <thead>
                        <tr class="m-table-row">
                            <th class="m-table-cell m-setting-checkbox">
                                <div>
                                    <BaseCheckbox v-model="isCheck"></BaseCheckbox>
                                </div>
                            </th>

                            <th v-for="(item, index) in listColsSetting" :key="index" :style="{
                                                            minWidth: `${item.width}px`,
                                                            textAlign: `${item.align}`,
                                                        }" class="m-table-cell th-col" v-show="isEditColumn || index < 1">
                                {{ item.columnName }}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(row, index) in listRows" :key="index" class="m-table-row" :class="{
                                                    'row-selected':
                                                        nameColumn === row['columnValue'],
                                                }" @click="() => (nameColumn = row['columnValue'])">
                            <td class="m-table-cell m-setting-checkbox has-checkbox">
                                <BaseCheckbox v-model="row.isShow" :checkAll="isCheck"></BaseCheckbox>
                            </td>

                            <td v-for="(item, index) in listColsSetting" :key="index" :style="{
                                                            minWidth: `${item.width}px`,
                                                            textAlign: `${item.align}`,
                                                        }" v-show="isEditColumn || index < 1" class="m-table-cell" :class="{
                                'has-checkbox': index == 3,
                            }">
                                <!-- Cột đầu giữ nguyên -->
                                <div v-if="index == 0">
                                    {{ row[item.name] }}
                                </div>

                                <!-- 2 cột ở giữa set độ rộng và tên hiển thị -->
                                <div v-if="nameColumn !== row['columnValue'] &&
                                                                    index > 0 &&
                                                                    index < 3
                                                                    ">
                                    {{ row[item.name] }}
                                </div>
                                <BaseInput height="28px" v-else-if="index == 1" v-model="row[item.name]"></BaseInput>
                                <BaseInput height="28px" v-else-if="index == 2" v-model="row[item.name]" :onlyNumber="true">
                                </BaseInput>

                                <!-- Cột cuối cố định cột hay không -->
                                <BaseCheckbox v-if="index == 3" v-model="row[item.name]"></BaseCheckbox>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <span class="show-more" @click="showMoreColumn" v-if="!searchColumn">
                    {{ isShowMore ? "Ẩn bớt" : "Hiển thị thêm" }}
                </span>
            </div>
            <div class="m-modal-setting-footer">
                <BaseButton text="Hủy" isExtra height="30px" minWidth="50px" @click="() => emits('hideModalSetting')">
                </BaseButton>
                <div class="m-setting-footer-rigth">
                    <BaseButton text="Lấy mẫu ngầm định" isExtra height="30px" @click="getSettingDefault"></BaseButton>
                    <BaseButton text="Cất" height="30px" minWidth="50px" @click="handleSaveSetting"></BaseButton>
                </div>
            </div>
        </div>
    </BaseOverlay>
</template>
<script setup>
import BaseOverlay from "./BaseOverlay.vue";
import BaseCheckbox from "./BaseCheckboxInput.vue";
import BaseButton from "./BaseButton.vue";
import BaseInput from "./BaseInput.vue";
import { defineEmits, ref, defineProps, watch } from "vue";
import { updateMultiColumn } from "@/api/setting.js";

const emits = defineEmits([
    "hideModalSetting",
    "loadData",
    "closeModalSetting",
]);
const props = defineProps({
    columnSetting: {
        type: Array,
        default: () => [],
    },
});

const listRows = ref([]);
const isShowMore = ref(false);
const isCheck = ref(false);

const isEditColumn = ref(false);
const nameColumn = ref(null);

const listColsSetting = ref([
    {
        columnName: "Tên cột dữ liệu",
        name: "columnName",
        width: 280,
        align: "left",
    },
    {
        columnName: "Tên cột trên giao diện",
        name: "columnDisplay",
        width: 200,
        align: "left",
    },
    {
        columnName: "Độ rộng",
        name: "columnWidth",
        width: 130,
        align: "left",
    },
    {
        columnName: "Cố định cột",
        name: "isSticky",
        width: 140,
        align: "center",
    },
]);

listRows.value = props.columnSetting.filter((value, index) => index < 10);

const settingOld = JSON.stringify(listRows.value);

/**
 * Tìm kiếm cột để setting
 * NDKien - (17/06/2023)
 */
const searchColumn = ref(null);
const debounce = ref(null);
watch(searchColumn, () => {
    if (debounce.value) {
        clearTimeout(debounce.value);
    }
    // Ngừng nhập sau 0.5s thì tìm kiếm
    debounce.value = setTimeout(() => {
        const query = searchColumn.value.toLowerCase();
        listRows.value = props.columnSetting.filter(
            (item) => item.columnName.toLowerCase().indexOf(query) >= 0
        );
    }, 500);
});
/**
 * Hàm xử lý ẩn hiện thêm cột cần chỉnh sửa
 * Author: NDKien - (13/06/2023)
 */
const showMoreColumn = () => {
    isShowMore.value = !isShowMore.value;
    if (isShowMore.value) {
        listRows.value = props.columnSetting;
    } else {
        listRows.value = props.columnSetting.filter(
            (value, index) => index < 10
        );
    }
};

/**
 * Hàm xử lý cập nhật setting
 * Author: NDKien - (13/06/2023)
 */
const handleSaveSetting = async () => {
    const settingUpdate = JSON.stringify(listRows.value);
    //Kiểm tra nếu có thay đổi thì mới cập nhật giao diện
    if (settingUpdate != settingOld) {
        await updateMultiColumn(listRows.value);
    }
    emits("closeModalSetting");
    emits("loadData");
};

/**
 * Hàm lấy mẫu ngầm định của tùy chỉnh giao diện
 * Author: NDKien - (13/06/2023)
 */
const getSettingDefault = () => {
    listRows.value = props.columnSetting;
    listRows.value.forEach((item) => {
        item.isShow = item.isDefault;
        item.isSticky = false;
        item.columnDisplay = item.columnName;
    });
};

watch(listRows, () => {
    if (listRows.value.length > 10) {
        isShowMore.value = true;
    } else {
        isShowMore.value = false;
    }
});
</script>
<style scoped>
@import url("@/assets/css/components/table.css");

.m-modal-setting {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    background-color: #fff;
    min-width: 800px;
    max-width: 800px;
    width: 800px;
    border-bottom-left-radius: 4px;
    border-top-left-radius: 4px;
    display: flex;
    flex-direction: column;
    row-gap: 16px;
    animation: scale-up 0.1s linear;
}

@keyframes scale-up {
    0% {
        transform: scale(0.88);
        /* Điểm bắt đầu của animation */
    }

    100% {
        transform: scale(1);
        /* Điểm kết thúc của animation */
    }
}

.has-checkbox {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 36px;
}

.m-table-cell.m-setting-checkbox {
    width: 42px;
}

th.m-setting-checkbox>div {
    display: flex;
    width: 100%;
    justify-content: center;
}

.m-modal-setting-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 16px 0;
}

.m-modal-search {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 16px;
}

.m-edit-column {
    user-select: none;
    cursor: pointer;
    color: #0075c0;
}

.m-modal-title {
    font-size: 24px;
    font-family: MISAFontBold;
}

.m-modal-setting-icon {
    display: flex;
    align-items: center;
    column-gap: 8px;
}

.m-modal-body {
    padding: 0 0 0 16px;
    overflow: hidden overlay;
    flex: 1;
    border-bottom: 4px solid #f4f5f8;
}

.m-modal-body::-webkit-scrollbar {
    width: 10px;
    height: 10px;
}

.m-modal-body::-webkit-scrollbar-thumb {
    background-color: #c9ccd0d7;
}

.m-modal-body::-webkit-scrollbar-thumb:hover {
    background-color: #a6a9af;
}

.m-modal-setting-footer {
    display: flex;
    justify-content: space-between;
    padding: 0 16px 16px;
}

.m-setting-footer-rigth {
    display: flex;
    column-gap: 8px;
}

.show-more {
    display: block;
    margin: 8px 0;
    font-size: 13px;
    font-family: MISAFont;
    color: #0075c0;
    cursor: pointer;
    user-select: none;
    width: fit-content;
}

.m-setting-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    white-space: nowrap;
}
</style>
