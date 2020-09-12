import { render } from '../../core.js';
import { useState } from './useState.js';
import { Button } from './Button.js';
export const StatefulCounter = ({ id }) => {
    let count = useState(id)(0);
    const handleClick = e => {
        const { target: { dataset: { counter }, }, } = e;
        count.set({ inc: count.get() + 1, dec: count.get() - 1, reset: 0 }[counter]);
    };
    return render `
    <div id="${id}">
      <pre id="${id}-count">${count.get()}</pre>
      ${Button({ action: 'inc', caption: 'Increment', handleClick })}
      ${Button({ action: 'dec', caption: 'Decrement', handleClick })}
      ${Button({ action: 'reset', caption: 'Reset', handleClick })}
    </div>
  `;
};
