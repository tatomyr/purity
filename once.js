export const makeOnce = () => {
    let lastCalledKey;
    return (key, query) => {
        if (lastCalledKey !== key) {
            lastCalledKey = key;
            setTimeout(query);
        }
    };
};
