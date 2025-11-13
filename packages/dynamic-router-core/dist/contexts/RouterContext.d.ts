import { History, Location } from "dynamic-router-history";
import { Match } from "..";
export interface RouterContextType {
    history: History;
    match: Match;
    location: Location;
    meta?: any;
    basename?: string;
}
declare const RouterContext: import("react").Context<RouterContextType>;
export default RouterContext;
