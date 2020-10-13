export const delay = (t) => ({
    then: (resolve) => setTimeout(resolve, t),
});
