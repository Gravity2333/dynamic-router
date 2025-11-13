import { useContext } from 'react';
import RouterContext from '../contexts/RouterContext';
export default function useParams() {
    const { match } = useContext(RouterContext);
    return match.params;
}
