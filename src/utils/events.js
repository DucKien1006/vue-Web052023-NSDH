import Enum from "./enum.js";

const { KeyCode } = Enum;

/**
 * Hàm xử lý sự kiện khi ấn vào các phím và tổ hợp phím
 * @param {*} event
 * @param {*} handleEscEvent
 * @param {*} handleCtrlShiftS
 * @param {*} handleCtrlF8Event
 * @param {*} handleCtrlF9Event
 */
function handleKeyboardEvent(
    event,
    handleEscEvent,
    handleCtrlShiftS,
    handleCtrlF8Event,
    handleCtrlF9Event
) {
    try {
        //Khi ấn ESC
        if (event.keyCode === Enum.KeyCode.ESC) {
            handleEscEvent(event);
        }
        //Khi ấn tổ hợp CTRL + F9
        if (event.keyCode === KeyCode.S && event.ctrlKey && event.shiftKey) {
            handleCtrlShiftS(event);
        }
        //Khi ấn tổ hợp CTRL + F8
        if (event.keyCode === KeyCode.S && event.ctrlKey) {
            event.preventDefault();
            handleCtrlF8Event(event);
        }
        //Khi ấn tổ hợp CTRL + SHIFT + S
        if (event.keyCode === KeyCode.F9 && event.ctrlKey) {
            handleCtrlF9Event(event);
        }
    } catch (exp) {
        console.log(exp);
    }
}

export default {
    handleKeyboardEvent,
};
