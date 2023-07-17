import Enum from "@/utils/enum.js";

const employee = {
    state: () => {
        return {
            /* Danh sách điều kiện lọc */
            filterCondition: [
                //Điều kiện lọc chung cho cả text và date
                {
                    key: Enum.FilterCondition.Null,
                    value: "(Trống)",
                    accept: Enum.Accept.Both,
                },
                {
                    key: Enum.FilterCondition.NotNull,
                    value: "(Không trống)",
                    accept: Enum.Accept.Both,
                },
                {
                    key: Enum.FilterCondition.Equal,
                    value: "Bằng",
                    accept: Enum.Accept.Both,
                },
                {
                    key: Enum.FilterCondition.Difference,
                    value: "Khác",
                    accept: Enum.Accept.Both,
                },
                //Điều kiện lọc cho text
                {
                    key: Enum.FilterCondition.Contain,
                    value: "Chứa",
                    accept: Enum.Accept.Text,
                },
                {
                    key: Enum.FilterCondition.Start,
                    value: "Bắt đầu với",
                    accept: Enum.Accept.Text,
                },
                {
                    key: Enum.FilterCondition.End,
                    value: "Kết thúc với",
                    accept: Enum.Accept.Text,
                },
                //Điều kiện lọc cho date
                {
                    key: Enum.FilterCondition.Less,
                    value: "Nhỏ hơn",
                    accept: Enum.Accept.Date,
                },
                {
                    key: Enum.FilterCondition.LessOrEqual,
                    value: "Nhỏ hơn hoặc bằng",
                    accept: Enum.Accept.Date,
                },
                {
                    key: Enum.FilterCondition.More,
                    value: "Lớn hơn",
                    accept: Enum.Accept.Date,
                },
                {
                    key: Enum.FilterCondition.MoreOrEqual,
                    value: "Lớn hơn hoặc bằng",
                    accept: Enum.Accept.Date,
                },
            ],
        };
    },
    mutations: {
        setToggleShowColum(state, payload) {
            state.listCols[payload].isShow = !state.listCols[payload].isShow;
        },
    },
    actions: {
        setToggleShowColumAction(context, payload) {
            context.commit("setToggleShowColum", payload);
        },
    },
};

export default employee;
