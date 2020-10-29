export const pipe = (...funcs) => x => funcs.reduce(($, f) => f($), x);
