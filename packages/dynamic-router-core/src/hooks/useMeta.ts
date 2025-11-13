import { useContext } from 'react';
import RouterContext from '../contexts/RouterContext';

export default function useMeta<T>() {
  const { meta } = useContext(RouterContext);
  return meta as T;
}
