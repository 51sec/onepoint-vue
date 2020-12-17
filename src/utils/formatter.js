export function formatDate(t=null){
    if (t === null) return "";
    let oDate = new Date(t);
    if ('Invalid Date' === oDate.toString()) {
        return "";
    }
    let oYear = oDate.getFullYear(),
        oMonth = oDate.getMonth() < 9 ? "0" + (oDate.getMonth() + 1) : (oDate.getMonth() + 1),
        oDay = oDate.getDate() < 10 ? "0" + oDate.getDate() : oDate.getDate(),
        oHour = oDate.getHours() < 10 ? "0" + oDate.getHours() : oDate.getHours(),
        oMinute = oDate.getMinutes() < 10 ? "0" + oDate.getMinutes() : oDate.getMinutes(),
        oSecond = oDate.getSeconds() < 10 ? "0" + oDate.getSeconds() : oDate.getSeconds();
    return oYear + '-' + oMonth + '-' + oDay + " " + oHour + ":" + oMinute + ":" + oSecond;
}
export function formatSize(size=0) {
    if (size === null) {
        return "";
    }
    let count = 0;
    while (size >= 1024) {
        size /= 1024;
        count++;
    }
    size = size.toFixed(2);
    size += [' B', ' KB', ' MB', ' GB', ' TB'][count];
    return size;
}