export function getLocalStorage(key, defaultValue) {
    const saved = localStorage.getItem(key);

    if (saved === null) {
        return defaultValue;
    }

    return JSON.parse(saved);
}

export function setLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}