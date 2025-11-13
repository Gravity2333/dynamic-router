import { useContext } from 'react';
import RouterContext from '../contexts/RouterContext';

export default function useLocation() {
  const { location } = useContext(RouterContext);
  return location;
}
