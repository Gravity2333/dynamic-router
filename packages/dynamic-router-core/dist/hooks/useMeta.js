import { useContext } from 'react';
import RouterContext from '../contexts/RouterContext';
export default function useMeta() {
    const { meta } = useContext(RouterContext);
    return meta;
}
