import { init } from '../../src/purity.js';
export const { mount, rerender, getState, setState } = init({
    items: [],
    input: '',
});
