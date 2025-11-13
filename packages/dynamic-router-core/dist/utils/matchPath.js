import { pathToRegexp } from 'path-to-regexp';
export function matchPath(path, pathname, options = { sensitive: false, exact: false }) {
    const { sensitive = false, exact: end = false, basename = '' } = options;
    pathname = (pathname === null || pathname === void 0 ? void 0 : pathname.startsWith(basename)) ? pathname.slice(basename.length) : pathname;
    if (path === '*') {
        return {
            url: pathname,
            path,
            isExact: !!end,
            params: {},
        };
    }
    const { regexp, keys } = pathToRegexp(path, {
        sensitive,
        end,
    });
    const captures = regexp.exec(pathname);
    if (!captures)
        return null;
    const [url, ...rest] = captures;
    return {
        url,
        path,
        isExact: !!end,
        params: keys.reduce((currentParams, { name }, index) => {
            currentParams[name] = rest[index];
            return currentParams;
        }, {}),
    };
}
