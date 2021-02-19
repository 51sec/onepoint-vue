export function getItem(k) {
    return localStorage.getItem(k) || "";
}

export function setItem(k, v) {
    if (v) {
        return localStorage.setItem(k, v)
    } else {
        return localStorage.removeItem(k)
    }
}