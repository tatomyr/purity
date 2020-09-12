import { init } from '../../../core.js';
export const { mount, getState, setState } = init({
    input: '',
    items: [],
    isLoading: false,
    error: '',
    chosenItems: [],
});
