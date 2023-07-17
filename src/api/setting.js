import axiosAPI from "./config.js";

const getAllColumn = () => {
  return axiosAPI.get("/Settings");
}

const updateMultiColumn = (list) => {
  return axiosAPI.put(`/Settings/Multi`, list);
}

const getColumnTable = () => {
  return axiosAPI.get("/Settings/ColumnTable");
}

export {
  getAllColumn,
  updateMultiColumn,
  getColumnTable
}