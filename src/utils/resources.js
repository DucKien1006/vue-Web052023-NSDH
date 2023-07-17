export default {
    //Lỗi khi validate trả về
    ErrorValidate: {
        VI: {
            employeeCodeNotEmpty: "Mã không được để trống!",
            employeeCodeLength: "Mã nhân viên không vượt quá 20 kí tự!",
            employeeCodeInvalid: "Mã nhân viên không đúng định dạng!",
            employeeCodeIsDuplicated: "Mã nhân viên đã tồn tại",
            employeeNameNotEmpty: "Tên không được để trống!",
            employeeNameInvalid: "Tên nhân viên không đúng định dạng!",
            employeeDepartmentName: "Tên đơn vị không được phép để trống!",
            employeeDateOfBirth: "Ngày sinh không đươc lớn hơn ngày hiện tại!",
            employeeIdentityDate: "Ngày cấp không  đươc lớn hơn ngày hiện tại!",
            employeeEmail: "Email phải đúng định dạng!",
            identityIsNumber: "Số chứng minh nhân dân phải là số!",
            fieldNotNull: "Thông tin này không được để trống!",
            unitNotEmpty: "Đơn vị không được để trống!",
            emailNotValid: "Email không đúng định dạng!",
            importNoFile: "Bạn chưa chọn tệp dữ liệu. Vui lòng kiểm tra lại."
        },
        EN: {},
    },
    //Các thông báo của dialog
    MessageDialog: {
        VI: {
            DeleteMulti: "Bạn có thực sự muốn xoá những nhân viên đã chọn không?",
            diaglogNotifyQuestion: "Vui lòng chọn mã nhân viên cần xóa!",
            ConfirmDelete:
                "Bạn có thực sự muốn xóa nhân viên <{0}> không?",
            diaglogNotifyConfirmEdit:
                "Bạn có muốn cập nhật thông tin nhân viên này?",
            DeleteSuccess: "Xóa nhân viên hoàn tất!",
            DataChange: "Dữ liệu đã bị thay đổi, bạn có muốn cất không?",
        },
        EN: {},
    },
    //Các thông báo của toast message
    MessageToast: {
        VI: {
            InsertSuccess: "Thêm mới nhân viên thành công.",
            InsertError: "Thêm mới thất bại, vui lòng kiểm tra lại.",
            MessageToastEditSuccess: "Cập nhật thông tin thành công",
            MessageToastEditError:
                "Cập nhật thông tin thất bại, vui lòng kiểm tra lại.",
            DeleteSuccess: "Xóa nhân viên thành công.",
            DeleteMultiSuccess: `Đã xóa thành công {0} nhân viên.`,
            DeleteError: "Xóa thất bại, vui lòng kiểm tra lại.",
            MessageToastLoadDataError: "Lỗi tải dữ liệu, vui lòng thử lại",
            SystemError: "Có lỗi xảy ra, vui lòng liên hệ quản trị viên!",
            DeleteNoChoose: "Không có nhân viên nào được chọn!",
            NetworkError: "Vui lòng kiểm tra lại kết nối của bạn!",
        },
        EN: {},
    },
    ToastMessageType: {
        Infor: "infor",
        Error: "error",
        Quesion: "quesion",
        Warning: "warning",
        Success: "success",
    },
    // Tiêu đề của thông báo
    TitleStatus: {
        VI: {
            StatusSuccess: "Thành công!",
            StatusInformation: "Thông báo!",
            StatusWarning: "Cảnh báo!",
            StatusError: "Có lỗi!",
            DeleteEmployee: "Xóa nhân viên",
            EditEmployee: "Cập nhật thông tin",
            ValidateError: "Dữ liệu không hợp lệ!",
        },
    },
    // Icon của mỗi loại thông báo
    MessageToastIcons: {
        Success: "m-check-icon",
        Information: "m-info-icon",
        Error: "m-error-icon",
        Warning: "m-warning-icon",
    },
    Error: {
        VI: {
            ErrorInsert: "Có lỗi khi thêm nhân viên, vui lòng kiểm tra lại!",
            ErrorUpdate:
                "Có lỗi khi cập nhật nhân viên, vui lòng kiểm tra lại!",
            ErrorDelete: "Có lỗi khi xóa nhân viên, vui lòng kiểm tra lại!",
        },
    },
    FormTitle: {
        VI: {
            InsertTitle: "Thêm mới nhân viên",
            EditTitle: "Sửa thông tin nhân viên",
        },
    },
    TitleColumnName: {
        VI: {
            EmployeeCode: "Mã nhân viên",
            Fullname: "Tên nhân viên",
            DateOfBirth: "Ngày sinh",
            Address: "Địa chỉ",
            Gender: "Giới tính",
            IdentityNumber: "Số chứng minh",
            IdentityDate: "Ngày cấp",
            IndentityPlace: "Nơi cấp",
            Salary: "Lương thỏa thuận",
            PositionName: "Chức danh",
            DepartmentName: "Đơn vị",
            TelephoneNumber: "ĐT di động",
            PhoneNumber: "ĐT cố định",
            BankAccount: "TK ngân hàng",
            BankName: "Tên ngân hàng",
            BankBranch: "Chi nhánh ngân hàng",
            IsCustomer: "Là khách hàng",
            IsEmployee: "Là nhà cung cấp",
            CreatedBy: "Người tạo",
            CreatedDate: "Ngày tạo",
            ModifiedBy: "Người sửa",
            ModifiedDate: "Ngày sửa",
        },
    },
    TypeDialog: {
        Infor: "infor",
        Error: "error",
        Quesion: "quesion",
        Warning: "warning",
    },
    ContentTooltip: {
        VI: {
            SaveAndInsert: "Cất và thêm (Ctrl + Shift + S)",
            Save: "Cất (Ctrl + F8)",
            Help: "Giúp (F1)",
            Exit: "Thoát (ESC)",
        },
    },
    TextButton: {
        VI: {
            SaveAndInsert: "Cất và thêm",
            Save: "Cất",
        },
    },
    SuggestExcel: {
        VI: {
            DownloadBasic: "Tải tệp mẫu cơ bản để nhập những thông tin cơ bản.",
            DownloadAcv: "Tải tệp mẫu đầy đủ để nhập tất cả các thông tin.",
            SetupAfter:
                "Các thiết lập trong quá trình nhập sẽ được lưu để sử dụng trong các lần tiếp sau.",
            InsertMethod:
                "Dữ liệu trên tệp mà chưa có trong hệ thống sẽ được thêm mới vào. Dữ liệu mà đã có trên hệ thống sẽ không được cập nhật vào.",
            UpdateMethod:
                "Dữ liệu trên tệp mà chưa có trong hệ thống sẽ được thêm mới vào. Dữ liệu mà đã có trên hệ thống sẽ được cập nhật vào.",
        },
    },
    UploadFile: {
        VI: {
            DragOrClick: "Kéo/thả tệp vào đây hoặc bấm vào đây",
        },
    },
    GenderName: {
        VI: {
            Male: "Nam",
            Female: "Nữ",
            Other: "Khác"
        }
    },
    EmployeeDetail: {
        VI: {
            EmployeeCode: "Mã nhân viên",
            FullName: "Tên nhân viên"
        }
    },
    ButtonText: {
        VI: {
            Insert: "Thêm",
            InsertNew: "Thêm mới",
            SaveAndInsert: "Cất và thêm",
            Save: "Cất",
            InsertFromExcel: "Nhập từ Excel"
        }
    },
    Api: {
        // GetDepartment: "https://localhost:7166/api/Departments"
        GetDepartment: "https://cukcuk.manhnv.net/api/v1/Departments"
    }
};
