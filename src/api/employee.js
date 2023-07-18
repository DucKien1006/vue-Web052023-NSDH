import axiosAPI from "./config.js";

/**
 * Lấy tất cả nhân viên
 * @returns danh sách nhân viên
 */
const getEmployees = () => {
    return axiosAPI.get("/Employees");
};

/**
 * Lấy nhân viên theo id
 * @param {guid} id
 * @returns một nhân viên
 */
const getEmployee = (id) => {
    return axiosAPI.get(`/Employees/${id}`);
};

/**
 * Thêm một nhân viên
 * @param {employee} employee
 */
const addEmployee = (employee) => {
    return axiosAPI.post("/Employees", employee);
};

const insertMultiple = (employees) => {
    return axiosAPI.post("/Employees/InsertMulti", employees);
}

/**
 * Cập nhật nhân viên
 */
const updateEmployee = (employee) => {
    return axiosAPI.put(`/Employees/${employee.employeeId}`, employee);
};

/**
 * Xóa một nhân viên theo id
 */
const deleteEmployee = (id) => {
    return axiosAPI.delete(`/Employees/${id}`);
};

/**
 * Lấy mã nhân viên mới
 * @returns mã nhân viên mới
 */
const getEmployeeNewCode = () => {
    return axiosAPI.get(`/Employees/next_value`);
};

/**
 * Phân trang, tìm kiếm
 */
const getFilter = (pageSize, pageNumber, keyword) => {
    return axiosAPI.get(
        `/Employees/Filter?pageSize=${pageSize}&pageNumber=${pageNumber}&keyword=${keyword}`
    );
};

/**
 * Lọc, phân trang kết hợp tìm kiếm
 * @param {*} pageSize
 * @param {*} pageNumber
 * @param {*} keyword
 * @param {*} filters
 * @returns
 */
const getFilterPaging = (pageSize, pageNumber, keyword, filters) => {
    return axiosAPI.post(
        `/Employees/FilterPage?pageSize=${pageSize}&pageNumber=${pageNumber}&keyword=${keyword}`,
        filters
    );
};

/**
 * Xóa nhiều nhân viên
 * @param {*} listId
 * @returns
 */
const deleteMulti = (listId) => {
    return axiosAPI.post(`/Employees/Multi`, listId);
};



export {
    getEmployees,
    getEmployee,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployeeNewCode,
    getFilter,
    getFilterPaging,
    deleteMulti,
    insertMultiple
};
