<template>
    <div class="m-app-content">
        <div class="m-app-content-header">
            <div class="m-app-content-title">Nhân viên</div>
        </div>
        <div class="m-content-body">
            <div class="m-content-nav">
                <div class="m-content-nav-left">
                    <div class="m-multi-func" :class="{
                                            'disable-multi-func': listIdSelected.length < 2,
                                        }" @click="() => {
                        if (listIdSelected.length > 1)
                            isShowActionMulti = !isShowActionMulti;
                    }
                        ">
                        <span>Thực hiện hàng loạt</span>
                        <div class="icon"></div>
                        <div v-if="listIdSelected.length > 1 && isShowActionMulti
                                                    " class="list-func" v-click-outside="() => (isShowActionMulti = false)">
                            <div class="list-func-item" @click="handleDeleteMulti">
                                Xóa
                            </div>
                            <div class="list-func-item">Gộp</div>
                        </div>
                    </div>
                    <BaseFilterResult :filterResult="filters" @removeAllFilter="() => {
                                            filters.length = 0;
                                            loadData();
                                        }
                                            " @removeFilter="(index) => {
                                filters.splice(index, 1);
                                loadData();
                            }
                                "></BaseFilterResult>
                </div>
                <div class="m-content-nav-right">
                    <Input width="230px" height="28px" placeholder="Tìm theo mã, tên nhân viên" v-model="keyword" isSearch
                        :tabIndex="-1"></Input>
                    <Tippy content="Lấy lại dữ liệu" placement="bottom">
                        <div class="m-refresh" @click="refreshData"></div>
                    </Tippy>
                    <Tippy content="Xuất Excel" placement="bottom">
                        <a :href="'https://localhost:7166/api/v1/Employees/ExportExcel?keyword=' +
                                                    keyword
                                                    " target="_blank" class="m-excel"></a>
                    </Tippy>
                    <Tippy content="Tùy chỉnh giao diện" placement="bottom">
                        <div class="m-setting" @click="openSettingTable"></div>
                    </Tippy>
                    <BaseButtonMore :text="Resources.ButtonText.VI.Insert" :list-action-more="[
                                            {
                                                text: Resources.ButtonText.VI.InsertFromExcel,
                                                click: Enum.ButtonMore.ImportExcel,
                                            },
                                        ]" @click-button="openFormEmloyeeToInsert" @click-more-item="(click) => {
                        if (click === Enum.ButtonMore.ImportExcel)
                            isShowImportExcel = true;
                    }
                        "></BaseButtonMore>
                </div>
            </div>
            <!-- Data table -->
            <BaseTable :listCols="listCols" :listDatas="employees" keyDataTable="employeeId"
                @handleRemoveItem="clickDeleteEmployee" @handleReplication="handleReplication"
                @handleUpdateItemRow="openFormEmloyeeToUpdate" @handleClickFilter="handleClickFilter"
                @handleSetListId="(ids) => (listIdSelected = ids)" :loader="isLoading" :listIdSelected="listIdSelected"
                @closeFilter="() => {
                                    if (filters.length != 0) {
                                        filters.length = 0;
                                        loadData();
                                    }
                                }
                                    ">
            </BaseTable>
            <div class="m-paging">
                <div class="m-paging-left">
                    <span class="pagin-text">Tổng số:</span>
                    <span class="total-record word-medium">{{
                                            totalRecord
                                            }}</span>
                    <span class="pagin-text">bản ghi</span>
                </div>
                <div class="m-paging-right">
                    <BaseCombobox :width="200" :height="28" :data="[
                                            { text: '10 bản ghi trên 1 trang', value: 10 },
                                            { text: '20 bản ghi trên 1 trang', value: 20 },
                                            { text: '30 bản ghi trên 1 trang', value: 30 },
                                            { text: '50 bản ghi trên 1 trang', value: 50 },
                                            { text: '100 bản ghi trên 1 trang', value: 100 },
                                        ]" propValue="value" propName="text" disabled v-model="recordPerPage">
                    </BaseCombobox>
                    <BasePaging :totalRecord="totalRecord" :totalPage="totalPage" v-model="currentPage"></BasePaging>
                </div>
            </div>
        </div>
    </div>
    <!-- Đưa form ra làm con của body -->
    <teleport to="body">
        <EmployeeDetail @closeFormEmployee="() => (isShowFormEmployee = false)" @loadData="refreshData" :formMode="formMode"
            :employeeId="employeeId" :isShow="isShowFormEmployee" :title="titleForm" :showToastMessage="showToastMessage">
        </EmployeeDetail>
        <DialogQuestion :type="typeDialog" :message="messageDialog" v-if="isShowDialogQuestion"
            @okDialogQuesion="okDialogQuesion" @closeDialogQuestion="() => (isShowDialogQuestion = false)"></DialogQuestion>
        <BaseSettingTable v-if="isShowModalSetting" :columnSetting="columnSetting"
            @hideModalSetting="() => (isShowModalSetting = false)" @loadData="refreshData"
            @closeModalSetting="() => (isShowModalSetting = false)"></BaseSettingTable>
        <BaseToastMessage :type="typeToastMessage" :message="contentToastMessage" :isShowToast="isShowToastMessage"
            @hideToastMessage="hideToastMessage"></BaseToastMessage>
        <ImportExcel v-if="isShowImportExcel" @closeImportExcel="() => {
                    isShowImportExcel = false;
                    loadData();
                }
                    "></ImportExcel>
    </teleport>
</template>
<script setup>
import BaseCombobox from "@/components/base/BaseCombobox.vue";
import { Tippy } from "vue-tippy";
import "tippy.js/dist/tippy.css";
import BaseButtonMore from "@/components/base/BaseButtonMore.vue";
import BaseFilterResult from "@/components/base/BaseFilterResult.vue";
import BaseToastMessage from "@/components/base/BaseToastMessage.vue";
import BaseSettingTable from "@/components/base/BaseSettingTable.vue";
import BaseTable from "@/components/base/BaseTable.vue";
import Input from "@/components/base/BaseInput.vue";
import EmployeeDetail from "@/views/cash/employee/EmployeeDetail.vue";
import DialogQuestion from "@/components/dialog/DialogQuestion.vue";
import Resources from "@/utils/resources.js";
import Enum from "@/utils/enum.js";
import { ref, watch, onBeforeMount } from "vue";
import BasePaging from "@/components/base/BasePaging.vue";
import {
    deleteEmployee,
    // getFilterPaging,
    deleteMulti,
    getEmployees,

} from "@/api/employee.js";
import {
    // getColumnTable,
    //  getAllColumn,
} from "@/api/setting";
import FormatData from "@/utils/formatData.js";
const isShowImportExcel = ref(false);
//#region data
const isShowActionMulti = ref(false);
const isShowModalSetting = ref(false);

//#endregion

//#region - Xử lý show dialog question
const isShowDialogQuestion = ref(false);
const typeDialog = ref(null); //Loại dialog
const messageDialog = ref(null); //Nội dung trong dialog
const statusDialogAccept = ref(null); //Hành động khi ấn dialog chấp nhận(Xóa, xóa nhiều...)
/**
 * Hàm xử lý show dialogquestion
 * Author: NDKien
 * @param {*} type
 * @param {*} message
 * @param {*} action
 */
const showDialogQuestion = (type, message, action) => {
    isShowDialogQuestion.value = true;
    typeDialog.value = type;
    messageDialog.value = message;
    statusDialogAccept.value = action;
};
//#endregion

//#region - Xử lý Toastmessage
const isShowToastMessage = ref(false);
const contentToastMessage = ref(null);
const typeToastMessage = ref(null);
const timeout = ref(null);
/**
 * Hàm xử lý show toast mesage
 * @param {*} type
 * @param {*} mesage
 */
const showToastMessage = (type, mesage) => {
    isShowToastMessage.value = true;
    typeToastMessage.value = type;
    contentToastMessage.value = mesage;
    timeout.value = setTimeout(() => {
        isShowToastMessage.value = false;
    }, 5000);
};
const hideToastMessage = () => {
    isShowToastMessage.value = false;
    if (timeout.value) clearTimeout(timeout.value);
};
//#endregion

//#region - Xử lý load dữ liệu và phân trang
const isLoading = ref(false);
const employees = ref([]);
const totalRecord = ref(null);
const currentPage = ref(1);
const keyword = ref("");
const recordPerPage = ref(10);
const totalPage = ref(null);
const debounce = ref(null);
const listCols = ref([
    //Mã-Tên-Giới tính-Ngày sinh-Số cmnd-Chức danh-Tên đơn vị-số tk-tên ngân hàng-chi nhanh tk ngân hàng-trạng thái
    {
        columnValue: "EmployeeCode",
        columnName: "Mã nhân viên",
        columnDisplay: "Mã nhân viên",
        columnWidth: 160,
        columnAlign: 0,
        dataType: 1,
        isShow: true,
        isSticky: true,
        columnOrder: 1,
        isDefault: true
    },
    {
        columnValue: "FullName",
        columnName: "Tên nhân viên",
        columnDisplay: "Tên nhân viên",
        columnWidth: 160,
        columnAlign: 0,
        dataType: 1,
        isShow: true,
        isSticky: true,
        columnOrder: 2,
        isDefault: true
    },
    {
        columnValue: "Gender",
        columnName: "Giới tính",
        columnDisplay: "Giới tính",
        columnWidth: 100,
        columnAlign: 0,
        dataType: 1,
        isShow: true,
        isSticky: true,
        columnOrder: 3,
        isDefault: true
    },
    {
        columnValue: "DateOfBirth",
        columnName: "Ngày sinh",
        columnDisplay: "Ngày sinh",
        columnWidth: 100,
        columnAlign: 2,
        dataType: 2,
        isShow: true,
        isSticky: false,
        columnOrder: 4,
        isDefault: true
    },
    {
        columnValue: "IdentityNumber",
        columnName: "Số chứng minh",
        columnDisplay: "Số chứng minh",
        columnWidth: 150,
        columnAlign: 0,
        dataType: 1,
        isShow: true,
        isSticky: false,
        columnOrder: 5,
        isDefault: false
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
        isDefault: false
    },
]);
/**
 * Hàm load dữ liệu nhân viên ra bảng
 * Author: NDKien - (23/06/2023)
 */
const loadData = async () => {
    try {

        // listCols.value = await getColumnTable();
        isLoading.value = true;
        // const dataPaging = await getFilterPaging(
        //     recordPerPage.value,
        //     currentPage.value,
        //     keyword.value,
        //     filters.value
        // ); //Thực hiện lấy dữ liệu phân trang, tìm kiếm


        employees.value = await getEmployees(); // lấy dsach nhân viên theo api mẫu
        // employees.value = dataPaging.data; //Danh sách phân trang tìm kiếm
        // totalRecord.value = dataPaging.totalRecord; //Tổng số bản ghi thỏa mãn điều kiện lọc
        // totalPage.value = Math.ceil(totalRecord.value / recordPerPage.value); //Tổng số trang
        setTimeout(() => {
            isLoading.value = false;
        }, 300);
    } catch (error) {
        showToastMessage(
            Resources.ToastMessageType.Error,
            Resources.MessageToast.VI.NetworkError
        );
    }
};

//Load dữ liệu lúc đầu
onBeforeMount(() => {
    loadData();
});

//Hàm load lại dữ liệu
const refreshData = () => {
    loadData();
};

// Theo dõi recordPerPage và curentPage để thực hiện phân trang
watch(recordPerPage, (newVal) => {
    totalPage.value = Math.ceil(totalRecord.value / newVal);
    currentPage.value = 1;
    loadData();
});

//Theo dõi trang hiện tại nếu thay đổi thì call Api
watch(currentPage, () => {
    loadData();
});

//Theo dõi từ khóa tìm kiếm nếu có nhập và thay đổi thì call Api
watch(keyword, () => {
    //Nếu thời gian nhỏ hơn 0.5s thì không cho gọi api(Người dùng nhập liên tục)
    if (debounce.value) {
        clearTimeout(debounce.value);
    }
    //Ngừng nhập sau 0.5s thì gọi api
    debounce.value = setTimeout(() => {
        currentPage.value = 1;
        loadData();
    }, 500);
});

const filters = ref([]);
/**
 * Hàm xử lý lọc theo từng cột
 * Author: NDKien - (10/06/2023)
 * @param {*} filter - một object chứa thông tin lọc
 */
const handleClickFilter = (filter) => {
    //Tìm kiếm nếu cột đang lọc có trong danh sách lọc thì xóa và lọc theo giá trị với(Một cột chỉ có 1 điều kiện lọc)
    const index = filters.value.findIndex(
        (value) => value.columnName === filter.columnName
    );
    //Nếu điều kiện đó tồn tại trước đó rồi thì xóa và push điều kiện mới
    if (index !== -1) {
        filters.value.splice(index, 1);
    }
    //Thêm điều kiện lộ vào danh sách lọc
    filters.value.push(filter);
    loadData();
};
//#endregion

//#region - Xử lý giao diện
const columnSetting = ref([]);
// const openSettingTable = async () => {
//     columnSetting.value = await getAllColumn();
//     isShowModalSetting.value = true;
// };
//#endregion

//#region - Thao tác với form(Mở form để thêm, sửa)
const isShowFormEmployee = ref(false);
const formMode = ref(null);
const employeeId = ref(null);
const titleForm = ref(null);

/**
 * Hàm xử lý ấn nút mở form để thêm mới
 * Author: NDKien - (26/06/2023)
 */
const openFormEmloyeeToInsert = () => {
    titleForm.value = Resources.FormTitle.VI.InsertTitle;
    isShowFormEmployee.value = true;
    formMode.value = Enum.FormMode.Insert;
};

/**
 * Hàm xử lý khi ấn dblclick và sửa trên row table
 * Author: NDKien - (26/06/2023)
 * @param {String} id
 */
const openFormEmloyeeToUpdate = (id) => {
    titleForm.value = Resources.FormTitle.VI.EditTitle;
    isShowFormEmployee.value = true;
    employeeId.value = id;
    formMode.value = Enum.FormMode.Update;
};
//#endregion

//#region - Xóa, xóa nhiều nhân viên

//Danh sách id xóa nhiều
const listIdSelected = ref([]);

/**
 * Hàm xử lý khi xóa tất cả ở trang cuối xong thì sẽ lùi về 1 trang
 * Author: NDKien - (27/06/2023)
 * @param {*} ids - danh sách id lựu chọn xóa
 */
const setPagePosition = (ids) => {
    try {
        const currentIds = employees.value.map((item) => item["employeeId"]);
        //Nếu tồn tại tức là xóa hết tất cả bản ghi ở trang cuối => lùi trang hiện tại về 1 trang
        const idExists = currentIds.every((item) => ids.includes(item));
        if (
            currentPage.value == totalPage.value &&
            idExists &&
            currentPage.value != 1
        ) {
            currentPage.value = currentPage.value - 1;
        }
    } catch (ex) {
        console.log(ex);
    }
};
/**
 * Hàm xử lý xóa một nhân viên
 * Author: NDKien - (27/06/2023)
 */
const deleteOneEmployee = async () => {
    if (employeeId.value) {
        try {
            await deleteEmployee(employeeId.value);
            showToastMessage(
                Resources.ToastMessageType.Success,
                Resources.MessageToast.VI.DeleteSuccess
            );
            setPagePosition([employeeId.value]);
            loadData();
        } catch (error) {
            showToastMessage(
                Resources.ToastMessageType.Error,
                Resources.MessageToast.VI.DeleteError
            );
        }
    } else {
        showToastMessage(
            Resources.ToastMessageType.Error,
            Resources.MessageToast.VI.DeleteNoChoose
        );
    }
};

/**
 * Hàm xử lý xóa nhiều nhân viên
 * Author: NDKien - (27/06/2023)
 */
const deleteMultiEmployee = async () => {
    if (listIdSelected.value) {
        try {
            await deleteMulti(listIdSelected.value);
            showToastMessage(
                Resources.ToastMessageType.Success,
                FormatData.formatString(
                    Resources.MessageToast.VI.DeleteMultiSuccess,
                    listIdSelected.value.length
                )
            );
            setPagePosition(listIdSelected.value);
            loadData();
        } catch {
            showToastMessage(
                Resources.ToastMessageType.Error,
                Resources.MessageToast.VI.DeleteError
            );
        }
        listIdSelected.value = [];
    } else {
        showToastMessage(
            Resources.ToastMessageType.Error,
            Resources.MessageToast.VI.DeleteNoChoose
        );
    }
};

/**
 * Hàm xử lý khi ấn vào nút xác nhận của dialog quesion
 * Author: NDKien - (27/06/2023)
 */
const okDialogQuesion = () => {
    isShowDialogQuestion.value = false;
    switch (statusDialogAccept.value) {
        case Enum.StatusDialogAccept.DeleteOne:
            deleteOneEmployee();
            break;
        case Enum.StatusDialogAccept.DeleteMulti:
            deleteMultiEmployee();
            break;
    }
};

/**
 * Hàm show dialog xóa một nhân viên
 * Author: NDKien - (26/06/2023)
 */
const clickDeleteEmployee = (employee) => {
    employeeId.value = employee.employeeId;
    showDialogQuestion(
        Resources.TypeDialog.Warning,
        FormatData.formatString(
            Resources.MessageDialog.VI.ConfirmDelete,
            employee.employeeCode
        ),
        Enum.StatusDialogAccept.DeleteOne
    );
};

const handleReplication = (employee) => {
    titleForm.value = Resources.FormTitle.VI.InsertTitle;
    isShowFormEmployee.value = true;
    employeeId.value = employee.employeeId;
    formMode.value = Enum.FormMode.Replication;
};

/**
 * Hàm show dialog xóa nhiều nhân viên
 * Author: NDKien - (26/06/2023)
 */
const handleDeleteMulti = () => {
    showDialogQuestion(
        Resources.TypeDialog.Warning,
        Resources.MessageDialog.VI.DeleteMulti,
        Enum.StatusDialogAccept.DeleteMulti
    );
};
//#endregion
</script>
<style scoped>
@import url("@/assets/css/layout/content.css");
</style>
