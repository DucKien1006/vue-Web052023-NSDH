import Enum from "./enum.js";
class FormatData {
    /**
     * Method này dùng để format lại định dạng ngày tháng năm theo định dạng dd/mm/yyyy
     * Author: NDKien - (17/06/2023)
     */
    static formatDate(date) {
        if (date) {
            date = new Date(date);
            let day = date.getDate();
            day = day < 10 ? "0" + day : day;
            let month = date.getMonth() + 1;
            month = month < 10 ? "0" + month : month;
            return day + "/" + month + "/" + date.getFullYear();
        } else return "";
    }
    static formatDateYYYYMMDD(date) {
        if (date) {
            date = new Date(date);
            let day = date.getDate();
            day = day < 10 ? "0" + day : day;
            let month = date.getMonth() + 1;
            month = month < 10 ? "0" + month : month;
            return date.getFullYear() + "-" + month + "-" + day;
        } else return "";
    }
    /**
     * Method này dùng để format lại tiền tệ
     * Author: NDKien - (17/06/2023)
     */
    static formatMoney(money) {
        if (money) {
            let intPart = Math.trunc(money);
            const floatPart = Number((money - intPart).toFixed(10));
            intPart = "" + intPart;
            if (intPart.length > 3) {
                var mod = intPart.length % 3;
                var output = mod > 0 ? intPart.substring(0, mod) : "";
                for (let i = 0; i < Math.floor(intPart.length / 3); i++) {
                    if (mod == 0 && i == 0)
                        output += intPart.substring(
                            mod + 3 * i,
                            mod + 3 * i + 3
                        );
                    else
                        output +=
                            "." +
                            intPart.substring(mod + 3 * i, mod + 3 * i + 3);
                }
                return floatPart !== 0
                    ? output + "," + (floatPart + "").slice(2)
                    : output;
            } else
                return floatPart !== 0
                    ? intPart + "," + (floatPart + "").slice(2)
                    : intPart;
        } else return "";
    }
    /**
     * Hàm convert giới tính
     * @param {Number} gender
     * @returns {String}
     */
    static convertGender(gender) {
        if (gender !== null) {
            switch (gender) {
                case Enum.Gender.Male:
                    return "Nam";
                case Enum.Gender.Female:
                    return "Nữ";
                case Enum.Gender.Other:
                    return "Khác";
            }
        } else return "";
    }
    static convertAlign(align) {
        if (align !== null) {
            switch (align) {
                case Enum.Align.Left:
                    return "left";
                case Enum.Align.Right:
                    return "right";
                case Enum.Align.Center:
                    return "center";
            }
        }
    }
    static lowerFirstLetter(str) {
        if (str) {
            return str.charAt(0).toLowerCase() + str.slice(1);
        } else {
            return "";
        }
    }
    static formatString(template, ...args) {
        return template.replace(/{(\d+)}/g, (match, number) => {
            return typeof args[number] !== "undefined" ? args[number] : match;
        });
    }
    // static calcLeft(index, width){
    //   if(index===0){
    //     return 0;
    //   }else{
    //     return
    //   }
    // }
}
export default FormatData;
