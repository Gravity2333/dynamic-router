import { pathToRegexp } from 'path-to-regexp';
import { Match, Params } from '../typings';

/**
 * 用 pathToRegexp匹配 path
 * @param path 带匹配的路径
 * @param pathname 当前pathname
 * @param options 配置选项
 * @returns
 */
export function matchPath(
  path: string,
  pathname: string,
  options: {
    sensitive?: boolean;
    exact?: boolean;
    basename?: string;
  } = { sensitive: false, exact: false },
): Match | null {
  /** 解构 options 的属性 */
  const { sensitive = false, exact: end = false, basename = '' } = options;
  pathname = pathname?.startsWith(basename) ? pathname.slice(basename.length) : pathname;
  /** 生成 path的正则表达式 */
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
  /** 匹配url */
  const captures = regexp.exec(pathname);

  if (!captures) return null;

  const [url, ...rest] = captures;

  return {
    url,
    path,
    isExact: !!end,
    params: keys.reduce((currentParams, { name }, index) => {
      currentParams[name] = rest[index];
      return currentParams;
    }, {} as Params),
  };
}
