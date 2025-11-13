import { History, Location } from 'dynamic-router-history';
import React from 'react';
import { useContext, useMemo } from 'react';
import RouterContext, { RouterContextType } from '../contexts/RouterContext';
import { Match, RouteInputType, RouteProps } from '../typings';
import { matchPath } from '../utils';

/** Route组件 */
export default function Route({
  meta,
  path,
  component,
  render,
  children,
  sensitive = false,
  exact = false,
  computedMatch,
}: RouteProps) {
  const routerContext = useContext(RouterContext);
  /** 计算当前组件是否匹配 */
  const match = computedMatch
    ? computedMatch
    : !!path
    ? matchPath(path, routerContext?.location?.pathname, {
        sensitive,
        exact,
        basename: routerContext.basename,
      })
    : routerContext.match;

  return !!match ? (
    <RouteCore
      meta={meta}
      history={routerContext.history}
      match={match}
      location={routerContext.location}
      render={render}
      component={component}
      basename={routerContext.basename}
    >
      {children}
    </RouteCore>
  ) : null;
}

/** 匹配到之后，负责渲染逻辑 */
function RouteCore({
  meta,
  match,
  location,
  history,
  render,
  component,
  children,
  basename,
}: {
  match: Match;
  location: Location;
  history: History;
  render?: RouteProps['render'];
  component?: RouteProps['component'];
  children?: RouteProps['children'];
  meta?: RouteProps['meta'];
  basename?: string;
}) {
  const NewRouterContextValue: RouterContextType = useMemo(() => {
    return {
      history,
      match,
      location,
      meta,
      basename,
    };
  }, []);

  const routeInputProps: RouteInputType = useMemo(() => {
    return {
      match,
      location,
      meta,
    };
  }, []);

  /** 渲染内容 */
  let renderContext =
    typeof children === 'function' ? (children as any)(routeInputProps) : children;

  /** 如果有 component则覆盖 */
  if (component) {
    renderContext = React.createElement(component, routeInputProps as any);
  }

  /** 如果有render则覆盖 */
  if (render) {
    renderContext = render(routeInputProps);
  }

  // CURRENT_MATCHED_ROUTE.current = meta;

  return (
    <RouterContext.Provider
      key={Math.random().toString(32).substring(2, 8) + new Date()}
      value={NewRouterContextValue}
    >
      {renderContext}
    </RouterContext.Provider>
  );
}
