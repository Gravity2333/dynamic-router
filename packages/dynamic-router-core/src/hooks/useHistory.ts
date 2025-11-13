import { useContext } from 'react';
import HistoryContext from '../contexts/HistoryContext';

export default function useHistory() {
  const history = useContext(HistoryContext);
  return history;
}
