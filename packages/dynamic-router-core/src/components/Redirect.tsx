import { useContext, useEffect } from 'react';
import HistoryContext from '../contexts/HistoryContext';

type RedirectProps = {
  from?: string;
  to: string;
  push?: boolean;
  exact?: boolean;
};
/** 重定向组件 */
export default function Redirect(props: RedirectProps) {
  const { to, push = false } = props;
  const history = useContext(HistoryContext);
  const redirectFn = push ? history.push : history.replace;

  useEffect(() => {
    redirectFn(to);
  }, []);

  return <></>;
}
