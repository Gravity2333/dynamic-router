import React from 'react';
import { useContext } from 'react';
import RouterContext from '../contexts/RouterContext';
import { matchPath } from '../utils';

/** 选择第一个匹配的路径 */
export default function Switch({ children }: { children?: any }) {
  // 归一化 让 children为 数组
  if (!Array.isArray(children)) {
    children = [children];
  }

  const { location,basename } = useContext(RouterContext);

  for (const childComponent of children) {
    const props = childComponent.props;
    const { exact=false, sensitive=false } = props;
    const path = props.from || props.path;

    if (!path) return;

    const computedMatch = matchPath(path, location?.pathname, { exact, sensitive,
      basename,
     });
    if (computedMatch) {
      // 渲染匹配到的子节点
      return React.cloneElement(childComponent, { computedMatch });
    }
  }
  return null;
}
