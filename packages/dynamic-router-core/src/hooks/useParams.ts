import { useContext } from 'react';
import RouterContext from '../contexts/RouterContext';

export default function useParams<T>() {
  const {match} = useContext(RouterContext);
  return match.params as T;
}
