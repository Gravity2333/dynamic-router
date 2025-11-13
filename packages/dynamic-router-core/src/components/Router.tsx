import { History, Location } from 'dynamic-router-history';
import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import HistoryContext from '../contexts/HistoryContext';
import RouterContext, { RouterContextType } from '../contexts/RouterContext';
import { computeRootMatch } from '../utils';

/** 全局Router组件 */
export default function Router({
  history,
  children,
  basename,
}: {
  history: History;
  children?: any;
  basename?: string;
}) {
  /** 保存 Location */
  const [location, setLocation] = useState<Location>(history.location);

  /** Router Provider 内容 */
  const routerContextValue: RouterContextType = useMemo(() => {
    return {
      history,
      location,
      match: computeRootMatch(),
      basename,
    };
  }, [location]);

  /** 对 history设置监听 */
  useLayoutEffect(() => {
    history.listen((update) => {
      setLocation(update.location);
      history.location = update.location
    });
  }, []);

  return (
    <HistoryContext.Provider
      value={history}
      key={Math.random().toString(32).substring(2, 8) + new Date()}
    >
      <RouterContext.Provider value={routerContextValue}>{children}</RouterContext.Provider>
    </HistoryContext.Provider>
  );
}
