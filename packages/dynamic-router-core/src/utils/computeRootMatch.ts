import { Match } from '../typings';

/** 计算根匹配Match */
export function computeRootMatch(): Match {
  return {
    isExact: false,
    params: {},
    url: '/',
    path: '/',
  };
}
