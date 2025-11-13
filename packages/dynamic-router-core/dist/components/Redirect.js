import { Fragment as _Fragment, jsx as _jsx } from "react/jsx-runtime";
import { useContext, useEffect } from 'react';
import HistoryContext from '../contexts/HistoryContext';
export default function Redirect(props) {
    const { to, push = false } = props;
    const history = useContext(HistoryContext);
    const redirectFn = push ? history.push : history.replace;
    useEffect(() => {
        redirectFn(to);
    }, []);
    return _jsx(_Fragment, {});
}
