<template>
    <div class="m-excel-container">
        <div class="m-excel-header">
            <div class="title-header">Nhập nhân viên từ Excel</div>
            <div class="icon-header">
                <div class="icon-help"></div>
                <div class="icon-exit" @click="() => emits('closeImportExcel')"></div>
            </div>
        </div>
        <div class="m-excel-content">
            <ImportExcelProgress :numberStep="currentStep"></ImportExcelProgress>
            <ImportExcelStepOne v-if="currentStep === 1" @resultStepOne="(data) => (fileInfoImport = data)"
                :error="isErrorFile"></ImportExcelStepOne>
            <ImportExcelStepTwo v-else-if="currentStep === 2" :listColumnsWithHeader="listColumnsWithHeader"
                @updateExcelMaps="(value) => (excelMaps = value)"></ImportExcelStepTwo>
            <ImportExcelStepThree v-else-if="currentStep === 3" :number-pass="numberPass" :number-fail="numberFail"
                :list-cols="listColImport.filter((item) => item.isImportExcel == true)
                    " :list-data="listImport"></ImportExcelStepThree>
            <ImportExcelResult v-else-if="currentStep === 4" :number-success="numberPass" :number-fail="numberFail">
            </ImportExcelResult>
        </div>
        <div class="m-excel-footer">
            <div>
                <BaseButton text="Hủy" height="28px" minWidth="40px" isExtra v-if="currentStep == 1 && currentStep != 4"
                    @click="() => emits('closeImportExcel')"></BaseButton>
                <BaseButton v-else-if="currentStep != 4" text="Quay lại" height="28px" minWidth="40px" isExtra
                    @click="handlePrevStep"></BaseButton>
            </div>
            <div>
                <BaseButton v-if="currentStep < 3" text="Tiếp tục" height="28px" minWidth="40px" @click="handleNextStep">
                </BaseButton>
                <BaseButton v-else-if="currentStep == 3 && listPass.length > 0" text="Nhập dữ liệu" height="28px"
                    minWidth="40px" @click="handleImportExcel"></BaseButton>
                <BaseButton v-else-if="currentStep == 4 || listPass.length == 0" text="Đóng" height="28px" minWidth="40px"
                    @click="() => emits('closeImportExcel')"></BaseButton>
            </div>
        </div>
    </div>
    <teleport to="body">
        <BaseLoadingData v-if="iShowLoading"></BaseLoadingData>
        <DialogNotification v-show="isShowDialog" @closeDialogNotification="() => (isShowDialog = false)" type="error"
            :message="messageDialog"></DialogNotification>
    </teleport>
</template>
<script setup>
/* eslint-disable */
import Enum from "@/utils/enum.js";
import ImportExcelProgress from "@/components/excelcomponents/ImportExcelProgress.vue";
import ImportExcelStepOne from "@/components/excelcomponents/ImportExcelStepOne.vue";
import ImportExcelStepTwo from "@/components/excelcomponents/ImportExcelStepTwo.vue";
import ImportExcelResult from "@/components/excelcomponents/ImportExcelResult.vue";
import BaseButton from "@/components/base/BaseButton.vue";
import { ref, defineEmits } from "vue";
import ImportExcelStepThree from "@/components/excelcomponents/ImportExcelStepThree.vue";
import BaseLoadingData from "@/components/base/BaseLoadingData.vue";
import DialogNotification from "@/components/dialog/DialogNotification.vue";
import Resources from "@/utils/resources";
import {
    getCollumnsByHeader,
    importExcel,
    insertMultiple,
} from "@/api/employee.js";

const emits = defineEmits(["closeImportExcel"]);

const iShowLoading = ref(false);

//Bước hiện tại
const currentStep = ref(Enum.ExcelStep.StepOne);

//Thông tin file lấy ở bước 1
const fileInfoImport = ref({});

//Danh sách mapping các cột trong file excel
const excelMaps = ref([]);
const listColumnsWithHeader = ref([]);

//Số bản ghi thỏa mãn
const numberPass = ref(null);

//Số bản ghi bị lỗi
const numberFail = ref(null);

//Danh sách tất cả bản ghi đọc trong trong file excel
const listImport = ref([]);

//Danh sách những bản ghi thoa mãn điều kiện để import
const listPass = ref([]);

const isErrorFile = ref(false);
const validateFile = () => {
    if (Object.keys(fileInfoImport.value).length === 0) {
        isErrorFile.value = true;
        return false;
    } else {
        isErrorFile.value = false;
        return true;
    }
};

/**
 * Hàm xử lý next các bước
 * Author: NDKien - (28/06/2023)
 */
const messageDialog = ref("");
const isShowDialog = ref(false);
const handleNextStep = async () => {
    //Chuẩn bị dữ liệu cho bước 2
    if (currentStep.value == 1) {
        if (validateFile()) {
            listColumnsWithHeader.value = await getCollumnsByHeader(
                fileInfoImport.value.file,
                Number(fileInfoImport.value.sheetSelected),
                fileInfoImport.value.rowHeader
            );
            //currentStep.value++;
        } else {
            messageDialog.value = Resources.ErrorValidate.VI.importNoFile;
            isShowDialog.value = true;
        }
    }

    //Next đến bước tiếp theo
    currentStep.value = validateFile()
        ? currentStep.value + 1
        : currentStep.value;

    //Xử lý bước 3
    if (currentStep.value == 3) {
        iShowLoading.value = true;
        //Tạo file excel cần đọc
        const formdata = new FormData();
        formdata.append("file", fileInfoImport.value.file);

        //Đọc dữ liệu từ file, thực hiện validate
        const data = await importExcel(
            formdata,
            JSON.stringify(excelMaps.value)
        );
        //Danh sách bản ghi đọc từ file
        listImport.value = data.listImport;

        //Danh sách thỏa mãn điều kiện
        listPass.value = data.listPass;

        //Số bản ghi thỏa mãn
        numberPass.value = data.listPass.length;

        //Số bản ghi lỗi
        numberFail.value = data.listImport.length - data.listPass.length;
        iShowLoading.value = false;
    }

    console.log("Bươc", currentStep.value);
};
/**
 * Hàm xử lý quay lại bước cũ
 */
const handlePrevStep = () => {
    currentStep.value--;
};
/**
 * Hàm xử lý nhập khẩu(Bước cuối)
 */
const handleImportExcel = async () => {
    currentStep.value++;
    const result = await insertMultiple(listPass.value);
    console.log(result);
};

const listColImport = [
    {
        columnValue: "LineNumber",
        columnName: "Dòng số",
        columnDisplay: "Dòng số",
        columnWidth: 160,
        columnAlign: 2,
        dataType: 1,
        isShow: true,
        isSticky: true,
        columnOrder: 1,
        excelWidth: 25,
        isImportExcel: true,
    },
    {
        columnValue: "IsValid",
        columnName: "Trạng thái",
        columnDisplay: "Trạng thái",
        columnWidth: 160,
        columnAlign: 0,
        dataType: 6,
        isShow: true,
        isSticky: false,
        columnOrder: 1,
        excelWidth: 25,
        isImportExcel: true,
    },
    {
        columnValue: "ErrorMessage",
        columnName: "Chi tiết lỗi",
        columnDisplay: "Chi tiết lỗi",
        columnWidth: 250,
        columnAlign: 0,
        dataType: 1,
        isShow: true,
        isSticky: false,
        columnOrder: 1,
        excelWidth: 25,
        isImportExcel: true,
    },
    {
        columnValue: "EmployeeCode",
        columnName: "Mã nhân viên",
        columnDisplay: "Mã nhân viên",
        columnWidth: 160,
        columnAlign: 0,
        dataType: 1,
        isShow: true,
        isSticky: false,
        columnOrder: 1,
        excelWidth: 25,
        isImportExcel: true,
    },
    {
        columnValue: "FullName",
        columnName: "Tên nhân viên",
        columnDisplay: "Tên nhân viên",
        columnWidth: 200,
        columnAlign: 0,
        dataType: 1,
        isShow: true,
        isSticky: false,
        columnOrder: 2,
        excelWidth: 25,
        isImportExcel: true,
    },
    {
        columnValue: "Gender",
        columnName: "Giới tính",
        columnDisplay: "Giới tính",
        columnWidth: 120,
        columnAlign: 0,
        dataType: 4,
        isShow: true,
        isSticky: false,
        columnOrder: 3,
        excelWidth: 15,
        isImportExcel: true,
    },
    {
        columnValue: "DateOfBirth",
        columnName: "Ngày sinh",
        columnDisplay: "Ngày sinh",
        columnWidth: 150,
        columnAlign: 2,
        dataType: 2,
        isShow: true,
        isSticky: false,
        columnOrder: 4,
        excelWidth: 20,
        isImportExcel: true,
    },
    {
        columnValue: "IdentityNumber",
        columnName: "Số chứng minh",
        columnDisplay: "Số chứng minh",
        columnWidth: 200,
        columnAlign: 0,
        dataType: 1,
        isShow: true,
        isSticky: false,
        columnOrder: 5,
        excelWidth: 20,
        isImportExcel: true,
    },
    {
        columnValue: "IdentityDate",
        columnName: "Ngày cấp",
        columnDisplay: "Ngày cấp",
        columnWidth: 150,
        columnAlign: 2,
        dataType: 2,
        isShow: true,
        isSticky: false,
        columnOrder: 6,
        excelWidth: 20,
        isImportExcel: true,
    },
    {
        columnValue: "IdentityPlace",
        columnName: "Nơi cấp",
        columnDisplay: "Nơi cấp",
        columnWidth: 160,
        columnAlign: 0,
        dataType: 1,
        isShow: true,
        isSticky: false,
        columnOrder: 7,
        excelWidth: 25,
        isImportExcel: true,
    },
    {
        columnValue: "PositionName",
        columnName: "Chức danh",
        columnDisplay: "Chức danh",
        columnWidth: 250,
        columnAlign: 0,
        dataType: 1,
        isShow: true,
        isSticky: false,
        columnOrder: 8,
        excelWidth: 30,
        isImportExcel: true,
    },
    {
        columnValue: "DepartmentCode",
        columnName: "Mã đơn vị",
        columnDisplay: "Mã đơn vị",
        columnWidth: 150,
        columnAlign: 0,
        dataType: 1,
        isShow: false,
        isSticky: false,
        columnOrder: 9,
        excelWidth: 25,
        isImportExcel: true,
    },
    {
        columnValue: "DepartmentName",
        columnName: "Tên đơn vị",
        columnDisplay: "Đơn vị",
        columnWidth: 200,
        columnAlign: 0,
        dataType: 1,
        isShow: true,
        isSticky: false,
        columnOrder: 10,
        excelWidth: 30,
        isImportExcel: false,
    },
    {
        columnValue: "BankAccount",
        columnName: "Số tài khoản",
        columnDisplay: "TK ngân hàng",
        columnWidth: 150,
        columnAlign: 0,
        dataType: 1,
        isShow: true,
        isSticky: false,
        columnOrder: 11,
        excelWidth: 40,
        isImportExcel: true,
    },
    {
        columnValue: "BankName",
        columnName: "Tên ngân hàng",
        columnDisplay: "Tên ngân hàng",
        columnWidth: 250,
        columnAlign: 0,
        dataType: 1,
        isShow: true,
        isSticky: false,
        columnOrder: 12,
        excelWidth: 40,
        isImportExcel: true,
    },
    {
        columnValue: "BankBranch",
        columnName: "Chi nhánh ngân hàng",
        columnDisplay: "Chi nhánh ngân hàng",
        columnWidth: 180,
        columnAlign: 0,
        dataType: 1,
        isShow: true,
        isSticky: false,
        columnOrder: 13,
        excelWidth: 40,
        isImportExcel: true,
    },
    {
        columnValue: "Address",
        columnName: "Địa chỉ",
        columnDisplay: "Địa chỉ",
        columnWidth: 200,
        columnAlign: 0,
        dataType: 1,
        isShow: true,
        isSticky: false,
        columnOrder: 14,
        excelWidth: 60,
        isImportExcel: true,
    },
    {
        columnValue: "Email",
        columnName: "Email",
        columnDisplay: "Email",
        columnWidth: 200,
        columnAlign: 0,
        dataType: 1,
        isShow: true,
        isSticky: false,
        columnOrder: 15,
        excelWidth: 30,
        isImportExcel: true,
    },
    {
        columnValue: "PhoneNumber",
        columnName: "ĐT di động",
        columnDisplay: "ĐT di động",
        columnWidth: 150,
        columnAlign: 0,
        dataType: 1,
        isShow: true,
        isSticky: false,
        columnOrder: 16,
        excelWidth: 20,
        isImportExcel: true,
    },
    {
        columnValue: "TelephoneNumber",
        columnName: "ĐT cố định",
        columnDisplay: "ĐT cố định",
        columnWidth: 150,
        columnAlign: 0,
        dataType: 1,
        isShow: true,
        isSticky: false,
        columnOrder: 17,
        excelWidth: 20,
        isImportExcel: true,
    },
    {
        columnValue: "IsCustomer",
        columnName: "Là khách hàng",
        columnDisplay: "Là khách hàng",
        columnWidth: 150,
        columnAlign: 2,
        dataType: 5,
        isShow: false,
        isSticky: false,
        columnOrder: 18,
        excelWidth: 20,
        isImportExcel: true,
    },
    {
        columnValue: "IsVendor",
        columnName: "Là nhà cung cấp",
        columnDisplay: "Là nhà cung cấp",
        columnWidth: 150,
        columnAlign: 2,
        dataType: 5,
        isShow: false,
        isSticky: false,
        columnOrder: 19,
        excelWidth: 20,
        isImportExcel: true,
    },
    {
        columnValue: "Salary",
        columnName: "Lương thỏa thuận",
        columnDisplay: "Lương thỏa thuận",
        columnWidth: 200,
        columnAlign: 1,
        dataType: 3,
        isShow: true,
        isSticky: false,
        columnOrder: 20,
        excelWidth: 20,
        isImportExcel: true,
    },
];
</script>
<style scoped>
.m-excel-container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #fff;
    z-index: 100;
}

.m-excel-header {
    width: 100%;
    background-color: #eceef1;
    padding: 16px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 70px;
}

.m-excel-header .title-header {
    font-size: 24px;
    font-family: MISAFontBold;
    padding: 4px 0;
}

.m-excel-header .icon-header {
    display: flex;
    align-items: center;
    column-gap: 12px;
}

.m-excel-header .icon-exit {
    background: url("@/assets/icon/Sprites.4b10a131.svg") no-repeat -147px -147px;
    width: 18px;
    height: 18px;
    cursor: pointer;
}

.m-excel-header .icon-help {
    background: url("@/assets/icon/Sprites.4b10a131.svg") no-repeat -732px -31px;
    width: 22px;
    height: 22px;
}

.m-excel-content {
    width: 100%;
    height: calc(100% - 48px - 70px);
    overflow: hidden overlay;
    scroll-behavior: smooth;
}

.m-excel-content::-webkit-scrollbar {
    width: 10px;
    height: 10px;
}

.m-excel-content::-webkit-scrollbar-thumb {
    background-color: #c9ccd0d7;
}

.m-excel-content::-webkit-scrollbar-thumb:hover {
    background-color: #a6a9af;
}

.m-excel-content::-webkit-scrollbar-track {
    background-color: #f1f1f1;
}

.m-excel-footer {
    width: 100%;
    height: 48px;
    z-index: 101;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
    background-color: #38393d;
}
</style>
