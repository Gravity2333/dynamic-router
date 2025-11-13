import { jsx as _jsx } from "react/jsx-runtime";
import { useLayoutEffect, useMemo, useState } from 'react';
import HistoryContext from '../contexts/HistoryContext';
import RouterContext from '../contexts/RouterContext';
import { computeRootMatch } from '../utils';
export default function Router({ history, children, basename, }) {
    const [location, setLocation] = useState(history.location);
    const routerContextValue = useMemo(() => {
        return {
            history,
            location,
            match: computeRootMatch(),
            basename,
        };
    }, [location]);
    useLayoutEffect(() => {
        history.listen((update) => {
            setLocation(update.location);
            history.location = update.location;
        });
    }, []);
    return (_jsx(HistoryContext.Provider, { value: history, children: _jsx(RouterContext.Provider, { value: routerContextValue, children: children }) }, Math.random().toString(32).substring(2, 8) + new Date()));
}
