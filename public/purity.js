const clearFalsy = (x) => x === undefined || x === null || x === false ? '' : x;
const joinIfArray = (x) => Array.isArray(x) ? x.join('') : x;
const PURITY_KEYWORD = 'purity';
const DATA_PURITY_FLAG = `data-${PURITY_KEYWORD}_flag`;
export const init = (initialState) => {
    let state = initialState;
    const parseHTML = (html) => {
        const virtualDocument = new DOMParser().parseFromString(html, 'text/html');
        const nodesMap = new Map();
        for (const node of virtualDocument.querySelectorAll('[id]')) {
            let shallow = node.cloneNode(true);
            for (let innerNode of shallow.querySelectorAll('[id]')) {
                innerNode.outerHTML = `<!-- ${innerNode.tagName}#${innerNode.id} -->`;
            }
            console.log('shallow--->', shallow.outerHTML);
            for (let innerNode of shallow.querySelectorAll(`[${DATA_PURITY_FLAG}]`)) {
                console.log('         |-->', innerNode.outerHTML);
                for (const key in innerNode.dataset) {
                    if (key.startsWith(PURITY_KEYWORD)) {
                        innerNode.removeAttribute(`data-${key}`);
                    }
                }
            }
            nodesMap.set(node.id, { node, shallow });
        }
        return nodesMap;
    };
    let rootComponent;
    let domNodesMap;
    function mount(f) {
        rootComponent = f;
        domNodesMap = parseHTML(rootComponent());
        const rootId = domNodesMap.keys().next().value;
        const root = document.getElementById(rootId);
        const rootNode = domNodesMap.get(rootId)?.node;
        if (root && rootNode) {
            root.replaceWith(rootNode);
        }
        else {
            throw new Error(`Root DOM element's id does not correspond to the defined application root id (${rootId}).`);
        }
    }
    function updateAttributes(element, newNode) {
        for (const { name } of element.attributes) {
            element.removeAttribute(name);
        }
        for (const { name, value } of newNode.node.attributes) {
            element.setAttribute(name, value);
        }
    }
    function rerender() {
        const newNodesMap = parseHTML(rootComponent());
        for (const [id, domNode] of domNodesMap) {
            const newNode = newNodesMap.get(id);
            if (newNode && domNode.shallow.outerHTML !== newNode.shallow.outerHTML) {
                const elementById = document.getElementById(id);
                if (elementById) {
                    updateAttributes(elementById, newNode);
                    if (domNode.shallow.innerHTML !== newNode.shallow.innerHTML) {
                        elementById.innerHTML = newNode.node.innerHTML;
                        console.log(`↻ #${id}`);
                    }
                    else {
                        console.log(`± #${id}`);
                    }
                }
                else {
                    throw new Error(`There is no element in DOM with id ${id}.`);
                }
            }
        }
        domNodesMap = newNodesMap;
    }
    return {
        mount,
        rerender,
        getState: () => state,
        setState(callback) {
            Object.assign(state, callback(state));
            rerender();
        },
    };
};
const ARGS_RE = /__\[(\d+)\]__/gm;
const BOUND_EVENTS_RE = /::(\w+)\s*=\s*__\[(\d+)\]__/gm;
const applyPurityKey = (() => {
    let purityKey = 0;
    let timeout;
    return () => {
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(() => {
            purityKey = 0;
        });
        return purityKey++;
    };
})();
export const render = ([first, ...strings], ...args) => {
    const precomputedString = strings.reduce(($, item, i) => `${$}__[${i}]__${item}`, first);
    const bindEventHandlers = (_, event, index) => {
        const dataName = `data-${PURITY_KEYWORD}_${event}_${applyPurityKey()}`;
        setTimeout(() => {
            let element = document.querySelector(`[${dataName}]`);
            if (element) {
                ;
                element[`on${event}`] = args[index];
                element.removeAttribute(dataName);
            }
        });
        return `${dataName} ${DATA_PURITY_FLAG}`;
    };
    const processArgs = (_, index) => joinIfArray(clearFalsy(args[+index]));
    const stringToRender = precomputedString
        .replace(BOUND_EVENTS_RE, bindEventHandlers)
        .replace(ARGS_RE, processArgs)
        .trim()
        .replace(/\n\s*</g, '<')
        .replace(/>\n\s*/g, '>');
    return stringToRender;
};
