import { Location } from "dynamic-router-history";
import { JSX } from "react";

export type Params = Record<string, any>;

/**匹配对象 */
export interface Match {
  /** 是否精确匹配 */
  isExact: boolean;
  /** 动态路由参数信息 */
  params: Params;
  /** 当前url */
  url: string;
  /** path 匹配到路径信息 */
  path: string;
}

/** 默认传入组件的路由信息 */
export type RouteInputType = {
  location: Location;
  match: Match;
  /** 元数据 */
  meta?: any;
};

/**路由组件Props */
export type RouteProps = {
  /** 路径信息 */
  path?: string;
  /** 组件 */
  component?: React.ComponentType;
  /** 渲染函数 */
  render?: (props: RouteInputType) => JSX.Element;
  /** 子元素 */
  children?: JSX.Element;
  /** 已经计算过的match 需要配合Switch使用 */
  computedMatch?: Match;
  /** 区分大小写 pathToRegexp参数 */
  sensitive?: boolean;
  /** 是否匹配结尾 pathToRegexp参数 */
  exact?: boolean;
  /** 元数据 */
  meta?: any;
};
