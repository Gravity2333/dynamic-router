import { Location } from "dynamic-router-history";
import { JSX } from "react";
export type Params = Record<string, any>;
export interface Match {
    isExact: boolean;
    params: Params;
    url: string;
    path: string;
}
export type RouteInputType = {
    location: Location;
    match: Match;
    meta?: any;
};
export type RouteProps = {
    path?: string;
    component?: React.ComponentType;
    render?: (props: RouteInputType) => JSX.Element;
    children?: JSX.Element;
    computedMatch?: Match;
    sensitive?: boolean;
    exact?: boolean;
    meta?: any;
};
