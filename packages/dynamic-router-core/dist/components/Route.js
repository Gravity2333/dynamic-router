import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { useContext, useMemo } from 'react';
import RouterContext from '../contexts/RouterContext';
import { matchPath } from '../utils';
export default function Route({ meta, path, component, render, children, sensitive = false, exact = false, computedMatch, }) {
    var _a;
    const routerContext = useContext(RouterContext);
    const match = computedMatch
        ? computedMatch
        : !!path
            ? matchPath(path, (_a = routerContext === null || routerContext === void 0 ? void 0 : routerContext.location) === null || _a === void 0 ? void 0 : _a.pathname, {
                sensitive,
                exact,
                basename: routerContext.basename,
            })
            : routerContext.match;
    return !!match ? (_jsx(RouteCore, { meta: meta, history: routerContext.history, match: match, location: routerContext.location, render: render, component: component, basename: routerContext.basename, children: children })) : null;
}
function RouteCore({ meta, match, location, history, render, component, children, basename, }) {
    const NewRouterContextValue = useMemo(() => {
        return {
            history,
            match,
            location,
            meta,
            basename,
        };
    }, []);
    const routeInputProps = useMemo(() => {
        return {
            match,
            location,
            meta,
        };
    }, []);
    let renderContext = typeof children === 'function' ? children(routeInputProps) : children;
    if (component) {
        renderContext = React.createElement(component, routeInputProps);
    }
    if (render) {
        renderContext = render(routeInputProps);
    }
    return (_jsx(RouterContext.Provider, { value: NewRouterContextValue, children: renderContext }, Math.random().toString(32).substring(2, 8) + new Date()));
}
