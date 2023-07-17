<template>
    <Overlay v-show="isShow">
        <div class="m-popup-wrapper">
            <div class="m-popup-header">
                <div class="m-popup-title">{{ title }}</div>
                <div class="m-popup-checkbox">
                    <input-checkbox label="Là khách hàng" v-model="employee.isCustomer"></input-checkbox>
                    <input-checkbox label="Là nhà cung cấp" v-model="employee.isVendor"></input-checkbox>
                </div>
            </div>
            <div class="m-popup-icon">
                <Tippy content="Giúp (F1)" placement="bottom">
                    <div class="m-btn-question"></div>
                </Tippy>
                <Tippy content="Thoát (ESC)" placement="bottom">
                    <div class="m-btn-close" @click="closeFormEmployee"></div>
                </Tippy>
            </div>
            <div class="m-popup-content">
                <div class="m-popup-employee">
                    <div class="item">
                        <Input ref="focusInput" isTextField label="Mã nhân viên" required width="210px"
                            v-model="employee.employeeCode" :isValid="employeeCodeValid" :errorMessage="Resources.ErrorValidate.VI.employeeCodeNotEmpty
                                                            " :tabIndex="1" :focus="isFocus" @handleBlurInput="() => (isFocus = false)"
                            :max-length="20"></Input>
                    </div>
                    <div class="item">
                        <Input isTextField label="Tên nhân viên" required width="210px" v-model="employee.fullName"
                            :isValid="fullNameValid" :errorMessage="Resources.ErrorValidate.VI.employeeNameNotEmpty
                                                            " :tabIndex="2" :max-length="100"></Input>
                    </div>
                    <div class="item">
                        <input-datepicker label="Ngày sinh" width="210px" v-model="employee.dateOfBirth"
                            :tabIndex="5"></input-datepicker>
                    </div>
                    <div class="item">
                        <InputRadio :label="'Giới tính'" :tabIndex="6" :listItem="[
                                                    { display: 'Nam', value: 0 },
                                                    { display: 'Nữ', value: 1 },
                                                    { display: 'Khác', value: 2 },
                                                ]" v-model="employee.gender" />
                    </div>
                    <div class="item item5">
                        <BaseCombobox label="Đơn vị" required :height="26" :url="Resources.Api.GetDepartment"
                            prop-name="departmentName" prop-value="departmentId" v-model="employee.departmentId"
                            :tab-index="3" :is-error="departmentIdValid" :message-error="Resources.ErrorValidate.VI.unitNotEmpty
                                                            "></BaseCombobox>
                    </div>
                    <div class="item">
                        <Input isTextField label="Số chứng minh" width="210px" v-model="employee.identityNumber"
                            :tabIndex="7" :onlyNumber="true" :max-length="50"></Input>
                    </div>
                    <div class="item">
                        <input-datepicker label="Ngày cấp" width="210px" v-model="employee.identityDate"
                            :tabIndex="8"></input-datepicker>
                    </div>
                    <div class="item item6">
                        <Input label="Chức vụ" width="100%" v-model="employee.positionName" :tabIndex="4"
                            :max-length="100"></Input>
                    </div>
                    <div class="item item7">
                        <Input label="Nơi cấp" width="100%" v-model="employee.identityPlace" :tabIndex="9"
                            :max-length="100"></Input>
                    </div>
                    <div class="item item8">
                        <Input label="Địa chỉ" width="100%" v-model="employee.address" :tabIndex="10"
                            :max-length="255"></Input>
                    </div>

                    <div class="item item10">
                        <Input label="Số điện thoại di động" width="210px" v-model="employee.phoneNumber" :tabIndex="11"
                            :onlyNumber="true" :max-length="50"></Input>
                    </div>
                    <div class="item">
                        <Input label="Số điện thoại cố định" width="210px" v-model="employee.telephoneNumber" :tabIndex="12"
                            :onlyNumber="true" :max-length="50"></Input>
                    </div>
                    <div class="item item9">
                        <Input label="Email" v-model="employee.email" :tabIndex="13" :isValid="emailValid" :errorMessage="Resources.ErrorValidate.VI.emailNotValid
                                                    " :max-length="100"></Input>
                    </div>
                    <div class="item"></div>
                    <div class="item">
                        <Input label="Tài khoản ngân hàng" v-model="employee.bankAccount" :tabIndex="14"
                            :max-length="25"></Input>
                    </div>
                    <div class="item">
                        <Input label="Tên ngân hàng" v-model="employee.bankName" :tabIndex="15" :max-length="255"></Input>
                    </div>
                    <div class="item">
                        <Input label="Chi nhánh" v-model="employee.bankBranch" :tabIndex="16" :max-length="255"></Input>
                    </div>
                </div>
            </div>
            <div class="m-popup-footer">
                <div class="m-popup-footer-left">
                    <Button height="30px" minWidth="50px" text="Hủy" isExtra @click="() => {
                                                emits('closeFormEmployee');
                                            }
                                            " :tabIndex="20" @keydown="(e) => {
                                    if (e.keyCode === Enum.KeyCode.TAB) {
                                        e.preventDefault();
                                        isFocus = true;
                                    }
                                }
                                "></Button>
                </div>
                <div class="m-popup-footer-right">
                    <Tippy content="Cất (Ctrl + S)" placement="bottom">
                        <Button text="Cất" isExtra @click="saveAndClose" height="30px" minWidth="50px"
                            :tabIndex="18"></Button>
                    </Tippy>
                    <Tippy content="Cất và thêm (Ctrl + Shift + S)" placement="bottom">
                        <Button text="Cất và thêm" height="30px" @click="saveAndInsertNew" :tabIndex="19"></Button>
                    </Tippy>
                </div>
            </div>
            <div class="m-loading-form" v-show="isShowLoadingForm">
                <div class="m-loading-rotate"></div>
            </div>
        </div>
    </Overlay>

    <teleport to="body">
        <DialogQuestionAction v-show="isShowDialogCheckDataModify" :message="Resources.MessageDialog.VI.DataChange"
            type="question" @closeDialogQuestion="() => (isShowDialogCheckDataModify = false)"
            @noDialogQuesion="noDialogDataModify" @okDialogQuesion="okDialogDataModify"></DialogQuestionAction>
        <DialogNotification v-show="showDialogNotification"
            @closeDialogNotification="() => (showDialogNotification = false)" :type="typeDialog"
            :message="messageDialogNotifi"></DialogNotification>
    </teleport>
</template>
<script setup>
import { Tippy } from "vue-tippy";
import "tippy.js/dist/tippy.css";
import InputCheckbox from "@/components/base/BaseCheckboxInput.vue";
import BaseCombobox from "@/components/base/BaseCombobox.vue";
import {
    ref,
    watch,
    defineProps,
    defineEmits,
    onMounted,
    onUnmounted,
} from "vue";
import Input from "@/components/base/BaseInput.vue";
import Overlay from "@/components/base/BaseOverlay.vue";
import Button from "@/components/base/BaseButton.vue";
import InputRadio from "@/components/base/BaseRadioButton.vue";
import InputDatepicker from "@/components/base/BaseDatepicker.vue";
import Enum from "@/utils/enum.js";
import DialogQuestionAction from "@/components/dialog/DialogQuestionAction.vue";
import DialogNotification from "@/components/dialog/DialogNotification.vue";
import Resources from "@/utils/resources.js";
import {
    getEmployee,
    addEmployee,
    getEmployeeNewCode,
    updateEmployee,
} from "@/api/employee.js";

const emits = defineEmits(["closeFormEmployee"]);
const props = defineProps({
    //Ẩn hiện form detail
    isShow: {
        type: Boolean,
        default: false,
    },
    //Tiêu đề của form
    title: {
        type: String,
        default: "",
    },
    //Chế độ khi mở form
    formMode: {
        type: Number,
    },
    //Id để binding employee lên form
    employeeId: {
        type: String,
        default: "",
    },
    showToastMessage: {
        type: Function,
    },
});

const isShowLoadingForm = ref(false);

//#region - Xử lý show dialog thông báo
const typeDialog = ref(null);
const messageDialogNotifi = ref(null);
const showDialogNotification = ref(false);

/**
 * Hàm show dialog thông báo
 * @param {*} type
 * @param {*} message
 */
const showDialogNotifi = (type, message) => {
    showDialogNotification.value = true;
    typeDialog.value = type;
    messageDialogNotifi.value = message;
};
//#endregion

//#region - Thao tác với form
const isFocus = ref(false);
const focusInput = ref(null);
const formModeEmployee = ref(null);
const oldData = ref("");
const employee = ref({});
const isShowDialogCheckDataModify = ref(false);

/**
 * Hàm reset lại form và lấy mã mới
 * Author: NDKien - (27/06/2023)
 */
const isReset = ref(false);
const resetForm = async () => {
    isReset.value = true;
    employee.value = {};
    employee.value.gender = Enum.Gender.Male;
    employee.value.employeeCode = await getEmployeeNewCode();
    isFocus.value = true;
    formModeEmployee.value = Enum.FormMode.Insert;
    oldData.value = JSON.stringify(employee.value);
    employeeCodeValid.value = false;
    fullNameValid.value = false;
    departmentIdValid.value = false;
    emailValid.value = false;
    isReset.value = false;
};

/**
 * Hàm format dữ liệu ngày tháng
 * Author: NDKien - (22/06/2023)
 */
const formatEmployee = () => {
    employee.value.dateOfBirth = employee.value.dateOfBirth?.split("T")[0];
    employee.value.identityDate = employee.value.identityDate?.split("T")[0];
};

/**
 * Theo dõi lúc mở form thì thực hiện hành động
 * Author: NDKien - (22/06/2023)
 */
watch(
    () => props.isShow,
    async (newVal) => {
        //Set form mode khi mở form lên
        formModeEmployee.value = props.formMode;
        if (newVal) {
            switch (formModeEmployee.value) {
                //Mở form với chế độ thêm mới
                case Enum.FormMode.Insert:
                    resetForm();
                    break;
                //Mở form với chế độ cập nhật
                case Enum.FormMode.Update:
                    try {
                        employee.value = await getEmployee(props.employeeId);
                        formatEmployee();
                        isFocus.value = true;
                        oldData.value = JSON.stringify(employee.value);
                    } catch (error) {
                        console.log(error);
                    }
                    break;
                //Mở form với chế độ nhân bản
                case Enum.FormMode.Replication:
                    try {
                        formModeEmployee.value = Enum.FormMode.Insert;
                        employee.value = await getEmployee(props.employeeId);
                        employee.value.employeeCode =
                            await getEmployeeNewCode();
                        formatEmployee();
                        isFocus.value = true;
                        oldData.value = JSON.stringify(employee.value);
                    } catch (error) {
                        console.log(error);
                    }
                    break;
            }
        } else {
            isFocus.value = false;
        }
    }
);

/**
 * Hàm xử lý khi ấn vào nút Hủy trên form
 * Author: NDKien - (22/06/2023)
 */
const closeFormEmployee = () => {
    //Lấy dữ liệu mới xem có thay đổi không
    const newData = JSON.stringify(employee.value);
    //Kiểm tra xem dữ liệu có thay đổi không
    if (oldData.value === newData) {
        // Nếu dữ liệu không thay đổi thì thực hiện đóng form
        emits("closeFormEmployee");
    } else {
        isShowDialogCheckDataModify.value = true;
    }
};

/**
 * Hàm validate khi ấn cất form
 * Author: NDKien - (27/06/2023)
 */
const fullNameValid = ref(false);
const employeeCodeValid = ref(false);
const departmentIdValid = ref(false);
const emailValid = ref(false);
const listMessage = [];
//Theo dõi validate mã nhân viên
watch(
    () => employee.value.employeeCode,
    (newVal) => {
        if (!isReset.value) {
            if (!newVal) {
                employeeCodeValid.value = true;
            } else {
                employeeCodeValid.value = false;
            }
        }
    }
);
//Theo dõi validate tên nhân viên
watch(
    () => employee.value.fullName,
    (newVal) => {
        if (!isReset.value) {
            if (!newVal) {
                fullNameValid.value = true;
            } else {
                fullNameValid.value = false;
            }
        }
    }
);
//Theo dõi validate Tên phòng ban
watch(
    () => employee.value.departmentId,
    (newVal) => {
        if (!isReset.value) {
            if (!newVal) {
                departmentIdValid.value = true;
            } else {
                departmentIdValid.value = false;
            }
        }
    }
);
const validate = () => {
    listMessage.length = 0;
    //Validate mã nhân viên
    if (!employee.value.employeeCode) {
        listMessage.push(Resources.ErrorValidate.VI.employeeCodeNotEmpty);
        employeeCodeValid.value = true;
    }

    //Validate tên nhân viên
    if (!employee.value.fullName) {
        listMessage.push(Resources.ErrorValidate.VI.employeeNameNotEmpty);
        fullNameValid.value = true;
    }

    //Validate đơn vị
    if (!employee.value.departmentId) {
        listMessage.push(Resources.ErrorValidate.VI.employeeDepartmentName);
        departmentIdValid.value = true;
    }

    //Validate email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (employee.value.email && !emailRegex.test(employee.value.email)) {
        listMessage.push(Resources.ErrorValidate.VI.emailNotValid);
        emailValid.value = true;
    } else {
        emailValid.value = false;
    }

    if (listMessage.length === 0) {
        return true;
    } else {
        return false;
    }
    //return true;
};

/**
 * Hàm bắt sự kiện nút cất và thêm
 * Author: NDKien - (27/06/2023)
 */
const saveAndInsertNew = async () => {
    //Thực hiện validate trước khi ấn cất và thêm mới
    const isValidate = validate();
    if (!isValidate) {
        showDialogNotifi(Resources.TypeDialog.Error, listMessage[0]);
    } else {
        //Kiểm tra chế độ form mode
        switch (formModeEmployee.value) {
            case Enum.FormMode.Insert:
                try {
                    //Thực hiện thêm mới và reset form
                    isShowLoadingForm.value = true;
                    await addEmployee(employee.value);
                    props.showToastMessage(
                        Resources.ToastMessageType.Success,
                        Resources.MessageToast.VI.InsertSuccess
                    );
                    emits("loadData");
                    resetForm();
                    isShowLoadingForm.value = false;
                } catch (error) {
                    //Đưa ra thông báo nếu thêm mới lỗi
                    showDialogNotifi(
                        Resources.TypeDialog.Error,
                        error.response.data.userMsg
                    );
                    isShowLoadingForm.value = false;
                }
                break;
            case Enum.FormMode.Update:
                try {
                    //Thực hiện cập nhật và reset form
                    isShowLoadingForm.value = true;
                    await updateEmployee(employee.value);
                    emits("loadData");
                    resetForm();
                    isShowLoadingForm.value = false;
                } catch (error) {
                    //Đưa ra thông báo nếu cập nhật lỗi
                    showDialogNotifi(
                        Resources.TypeDialog.Error,
                        error.response.data.userMsg
                    );
                    isShowLoadingForm.value = false;
                    console.log(error);
                }
                break;
        }
    }
};

/**
 * Hàm xử lý khi ấn nút cất
 * Author: NDKien - (27/06/2023)
 */
const saveAndClose = async () => {
    //Thực hiện validate khi ấn Cất
    const isValidate = validate();
    if (!isValidate) {
        showDialogNotifi(Resources.TypeDialog.Error, listMessage[0]);
    } else {
        switch (formModeEmployee.value) {
            case Enum.FormMode.Insert:
                try {
                    //Thực hiện thêm mới
                    isShowLoadingForm.value = true;
                    await addEmployee(employee.value);
                    emits("loadData");
                    emits("closeFormEmployee");
                    isShowLoadingForm.value = false;
                    props.showToastMessage(
                        Resources.ToastMessageType.Success,
                        Resources.MessageToast.VI.InsertSuccess
                    );
                } catch (error) {
                    //Đưa ra thông báo nếu thêm mới có lỗi
                    showDialogNotifi(
                        Resources.TypeDialog.Error,
                        error.response.data.userMsg
                    );
                    isShowLoadingForm.value = false;
                }
                break;
            case Enum.FormMode.Update:
                try {
                    //Thực hiện cập nhật
                    isShowLoadingForm.value = true;
                    await updateEmployee(employee.value);
                    emits("loadData");
                    emits("closeFormEmployee");
                    isShowLoadingForm.value = false;
                } catch (error) {
                    //Đưa ra thông báo nếu cập nhật có lỗi
                    showDialogNotifi(
                        Resources.TypeDialog.Error,
                        error.response.data.userMsg
                    );
                    isShowLoadingForm.value = false;
                    console.log(error);
                }
                break;
        }
    }
};

/**
 * Hàm xử lý ấn nút Không của dialog khi dữ liệu thay đổi
 * Author: NDKien - (27/06/2023)
 */
const noDialogDataModify = () => {
    isShowDialogCheckDataModify.value = false;
    emits("closeFormEmployee");
};

/**
 * Hàm xử lý khi ấn nút Có trên dialog
 * Author: NDKien - (27/06/2023)
 */
const okDialogDataModify = () => {
    isShowDialogCheckDataModify.value = false;
    saveAndClose();
};
//#endregion

//#region - Xử lý phím tắt
/**
 * Hàm xử lý phím tắt thao tác trên form
 * Author: NDKien - (26/06/2023)
 * @param {Event} event
 */
const handleKey = (event) => {
    //Ấn tổ hợp CTRL + SHIFT + S để cất và thêm
    if (event.keyCode === Enum.KeyCode.S && event.ctrlKey && event.shiftKey) {
        saveAndInsertNew();
    }
    //Ấn tổ hợp CTRL + S để cất
    else if (event.keyCode === Enum.KeyCode.S && event.ctrlKey) {
        event.preventDefault();
        saveAndClose();
    }
    //Ấn ESC để thoát
    else if (event.keyCode === Enum.KeyCode.ESC) {
        closeFormEmployee();
    }
};

//Thêm và xóa sự kiện lắng nghe các phím tắt
onMounted(() => window.addEventListener("keydown", handleKey));
onUnmounted(() => window.removeEventListener("keydown", handleKey));
//#endregion
</script>

<style scoped>
@import url("@/assets/css/components/employeedetail.css");

.m-loading-form {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.08);
}

.m-loading-rotate {
    position: absolute;
    top: 48%;
    left: 48%;
    background: url("@/assets/icon/loading.svg") no-repeat;
    background-size: cover;
    width: 40px;
    height: 40px;
    transform: translate(-50%, -50%);
    animation: rote 1.2s ease-in-out infinite;
}

@keyframes rote {
    0% {
        transform: rotate(0);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>
