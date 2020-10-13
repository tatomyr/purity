export const debounce = (callback, wait = 100) => {
    let timeout;
    return (...args) => {
        if (timeout) {
            clearTimeout(timeout);
        }
        else if (wait < 0) {
            callback(...args);
        }
        timeout = setTimeout(() => {
            if (wait > 0)
                callback(...args);
            timeout = undefined;
        }, Math.abs(wait));
    };
};
