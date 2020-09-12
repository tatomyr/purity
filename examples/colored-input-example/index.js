import { init, render } from '../../core.js';
const { mount, getState, setState } = init({
    color: 'black',
});
const handleInput = (e) => {
    setState(() => ({ color: e.target.value }));
};
const Root = () => render `
  <div id="root">
    <input
      id="color"
      style="color: ${getState().color};"
      ::input=${handleInput}
    />
  </div>
`;
mount(Root);
