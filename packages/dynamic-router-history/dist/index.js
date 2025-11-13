import EventCenter from './EventCenter';
import generateUniqueKey from './generateUniqueKey';
export var Action;
(function (Action) {
    Action["POP"] = "POP";
    Action["PUSH"] = "PUSH";
    Action["REPLACE"] = "REPLACE";
})(Action || (Action = {}));
const ON_HASH_CHANGE = 'onhashchange';
const POP_STATE = 'popstate';
const BEFORE_UNLOAD = 'beforeunload';
function readOnly(obj) {
    return Object.freeze(obj);
}
function warning(message) {
    console.error(message);
}
function handleBeforeUnload(e) {
    e.preventDefault();
    e.returnValue = '';
}
function createPath({ pathname = '/', search = '', hash = '', }) {
    let pathStr = pathname;
    if (search) {
        if (search === null || search === void 0 ? void 0 : search.startsWith('?')) {
            pathStr += search;
        }
        else {
            pathStr += `?${search}`;
        }
    }
    if (hash) {
        if (hash === null || hash === void 0 ? void 0 : hash.startsWith('#')) {
            pathStr += hash;
        }
        else {
            pathStr += `#${hash}`;
        }
    }
    return pathStr;
}
function parsePath(pathStr) {
    const pathObj = { pathname: '/', hash: '', search: '' };
    const hashIndex = pathStr.indexOf('#');
    if (hashIndex >= 0) {
        pathObj.hash = pathStr.slice(hashIndex);
        pathStr = pathStr.slice(0, hashIndex);
    }
    const searchIndex = pathStr.indexOf('?');
    if (searchIndex >= 0) {
        pathObj.search = pathStr.slice(searchIndex);
        pathStr = pathStr.slice(0, searchIndex);
    }
    pathObj.pathname = pathStr;
    return pathObj;
}
export function createBrowserHistory({ window = document.defaultView, basename = '', } = {}) {
    const globalHistory = window.history;
    function getCurrentLocationAndIndex() {
        const { pathname, hash, search } = window.location;
        const { state } = globalHistory;
        const formattedPathname = ((pathname === null || pathname === void 0 ? void 0 : pathname.startsWith(basename)) ? pathname.slice(basename.length) : pathname);
        return [
            readOnly({
                pathname: (formattedPathname === null || formattedPathname === void 0 ? void 0 : formattedPathname.startsWith('/')) ? formattedPathname : '/' + formattedPathname,
                hash,
                search,
                state: (state === null || state === void 0 ? void 0 : state.usr) || null,
                key: (state === null || state === void 0 ? void 0 : state.key) || 'default',
            }),
            state === null || state === void 0 ? void 0 : state.idx,
        ];
    }
    const listener = new EventCenter();
    const blocker = new EventCenter();
    let [location, index] = getCurrentLocationAndIndex();
    let action = Action.POP;
    if (index === void 0) {
        index = 0;
        globalHistory.replaceState(Object.assign(Object.assign({}, globalHistory.state), { idx: index }), '');
    }
    function createHref(to) {
        return basename + (typeof to === 'string' ? to : createPath(to));
    }
    function getNextLocation(to, state) {
        const nextPath = typeof to === 'string' ? parsePath(to) : to;
        return readOnly(Object.assign(Object.assign({ pathname: window.location.pathname, search: '', hash: '' }, nextPath), { state, key: generateUniqueKey() }));
    }
    function allowTx(transition) {
        return !blocker.length || blocker.call(transition) || false;
    }
    function applyTx(nextAction) {
        action = nextAction;
        [location, index] = getCurrentLocationAndIndex();
        listener.call({ location, action });
    }
    function getHistoryStateAndUrl(nextLocation, nextIndex) {
        return [
            readOnly({
                usr: nextLocation.state,
                key: nextLocation.key,
                idx: nextIndex,
            }),
            createHref(nextLocation),
        ];
    }
    function push(to, state) {
        const nextLocation = getNextLocation(to, state);
        const retry = () => {
            push(to, state);
        };
        if (allowTx({ location: nextLocation, action: Action.PUSH, retry })) {
            const [historyState, url] = getHistoryStateAndUrl(nextLocation, index + 1);
            globalHistory.pushState(historyState, '', url);
            applyTx(Action.PUSH);
        }
    }
    function replace(to, state) {
        const nextLocation = getNextLocation(to, state);
        const retry = () => {
            push(to, state);
        };
        if (allowTx({ location: nextLocation, action: Action.REPLACE, retry })) {
            const [historyState, url] = getHistoryStateAndUrl(nextLocation, index + 1);
            globalHistory.replaceState(historyState, '', url);
            applyTx(Action.REPLACE);
        }
    }
    function go(delta) {
        globalHistory.go(delta);
    }
    let blockTx = null;
    window.addEventListener(POP_STATE, () => {
        if (blockTx) {
            blocker.call(blockTx);
            blockTx = null;
        }
        else {
            if (blocker.length > 0) {
                const [nextLocation, nextIndex] = getCurrentLocationAndIndex();
                if (nextIndex !== void 0) {
                    const backDelta = index - nextIndex;
                    blockTx = {
                        location: nextLocation,
                        action: Action.POP,
                        retry: () => {
                            go(-backDelta);
                        },
                    };
                    go(backDelta);
                }
                else {
                    warning('请不要直接使用pushState / replaceState 操作路由！');
                }
            }
            else {
                applyTx(Action.POP);
            }
        }
    });
    return {
        basename,
        action,
        location,
        createHref,
        push,
        replace,
        go,
        forward: () => {
            go(1);
        },
        goBack: () => {
            go(-1);
        },
        listen: (fn) => {
            return listener.listen(fn);
        },
        block: (fn) => {
            const unblock = blocker.listen(fn);
            if ((blocker === null || blocker === void 0 ? void 0 : blocker.length) > 0) {
                window.addEventListener(BEFORE_UNLOAD, handleBeforeUnload);
            }
            return () => {
                unblock();
                if (blocker.length === 0) {
                    window.removeEventListener(BEFORE_UNLOAD, handleBeforeUnload);
                }
            };
        },
    };
}
export function createHashHistory({ window = document.defaultView, basename = '', } = {}) {
    const globalHistory = window.history;
    function getCurrentLocationAndIndex() {
        const hashStr = window.location.hash;
        const state = globalHistory.state;
        const { pathname, search, hash } = parsePath(hashStr.slice(1));
        const formattedPathname = ((pathname === null || pathname === void 0 ? void 0 : pathname.startsWith(basename)) ? pathname.slice(basename.length) : pathname);
        return [
            readOnly({
                pathname: (formattedPathname === null || formattedPathname === void 0 ? void 0 : formattedPathname.startsWith('/')) ? formattedPathname : '/' + formattedPathname,
                search,
                hash,
                state: state === null || state === void 0 ? void 0 : state.usr,
                key: state === null || state === void 0 ? void 0 : state.key,
            }),
            state === null || state === void 0 ? void 0 : state.idx,
        ];
    }
    function getNextLocation(to, state) {
        const nextPath = typeof to === 'string' ? parsePath(to) : to;
        return readOnly(Object.assign(Object.assign({ pathname: window.location.pathname, search: '', hash: '' }, nextPath), { state, key: generateUniqueKey() }));
    }
    function getBaseHref() {
        const base = document.querySelector('base');
        let baseHref = '';
        if (base && base.href) {
            const url = window.location.href;
            const hashIndex = url.indexOf('#');
            baseHref = hashIndex >= 0 ? url.slice(0, hashIndex) : url;
        }
        return '';
    }
    function createHref(to) {
        return getBaseHref() + '#' + basename + (typeof to === 'string' ? to : createPath(to));
    }
    function getHistoryStateAndUrl(location, index) {
        return [
            readOnly({
                usr: location.search,
                key: location.key,
                idx: index,
            }),
            createHref(location),
        ];
    }
    function allowTx(tx) {
        return !(blocker === null || blocker === void 0 ? void 0 : blocker.length) || (blocker.call(tx), false);
    }
    function applyTx(nextAction) {
        action = nextAction;
        [location, index] = getCurrentLocationAndIndex();
        listener.call({ location, action });
    }
    let action = Action.POP;
    let [location, index] = getCurrentLocationAndIndex();
    const listener = new EventCenter();
    const blocker = new EventCenter();
    if (index === void 0) {
        index = 0;
        globalHistory.replaceState(Object.assign(Object.assign({}, globalHistory.state), { idx: index }), '');
    }
    function push(to, state) {
        const nextLocation = getNextLocation(to, state);
        function retry() {
            push(to, state);
        }
        if (allowTx({ location: nextLocation, action: Action.PUSH, retry })) {
            const [nextHistoryState, url] = getHistoryStateAndUrl(nextLocation, index + 1);
            globalHistory.pushState(nextHistoryState, '', url);
            applyTx(Action.PUSH);
        }
    }
    function replace(to, state) {
        const nextLocation = getNextLocation(to, state);
        function retry() {
            push(to, state);
        }
        if (allowTx({ location: nextLocation, action: Action.REPLACE, retry })) {
            const [nextHistoryState, url] = getHistoryStateAndUrl(nextLocation, index + 1);
            globalHistory.replaceState(nextHistoryState, '', url);
            applyTx(Action.REPLACE);
        }
    }
    function go(delta) {
        globalHistory.go(delta);
    }
    let blockTx = null;
    window.addEventListener(POP_STATE, () => {
        if (blockTx) {
            blocker.call(blockTx);
            blockTx = null;
        }
        else {
            if (blocker.length) {
                const [nextLocation, nextIndex] = getCurrentLocationAndIndex();
                if (nextIndex !== void 0) {
                    const steps = index - nextIndex;
                    function retry() {
                        go(-steps);
                    }
                    blockTx = {
                        location: nextLocation,
                        action: Action.POP,
                        retry,
                    };
                    go(steps);
                }
                else {
                    warning('请不要绕过history调用 pushState/replaceState');
                }
            }
            else {
                applyTx(Action.POP);
            }
        }
    });
    return {
        basename,
        action,
        location,
        push,
        replace,
        createHref,
        go,
        goBack: () => {
            go(-1);
        },
        forward: () => {
            go(1);
        },
        listen: (fn) => {
            return listener.listen(fn);
        },
        block: (fn) => {
            const unblock = blocker.listen(fn);
            if (blocker.length > 0) {
                window.addEventListener(BEFORE_UNLOAD, handleBeforeUnload);
            }
            return () => {
                unblock();
                if (blocker.length === 0) {
                    window.removeEventListener(BEFORE_UNLOAD, handleBeforeUnload);
                }
            };
        },
    };
}
