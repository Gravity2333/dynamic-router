import React from 'react';
import { useContext } from 'react';
import RouterContext from '../contexts/RouterContext';
import { matchPath } from '../utils';
export default function Switch({ children }) {
    if (!Array.isArray(children)) {
        children = [children];
    }
    const { location, basename } = useContext(RouterContext);
    for (const childComponent of children) {
        const props = childComponent.props;
        const { exact = false, sensitive = false } = props;
        const path = props.from || props.path;
        if (!path)
            return;
        const computedMatch = matchPath(path, location === null || location === void 0 ? void 0 : location.pathname, { exact, sensitive,
            basename,
        });
        if (computedMatch) {
            return React.cloneElement(childComponent, { computedMatch });
        }
    }
    return null;
}
