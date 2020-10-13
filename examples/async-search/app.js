import { init } from '../../src/purity.js';
export const { mount, getState, setState } = init({
    input: '',
    items: [],
    isLoading: false,
    error: '',
    chosenItems: [],
});
