import { History, Location } from "dynamic-router-history";
import { createContext } from "react";
import { Match } from "..";

export interface RouterContextType {
  history: History;
  match: Match;
  location: Location;
  meta?: any;
  basename?: string;
}

/** router上下文 用来提供history */
const RouterContext = createContext<RouterContextType>({} as RouterContextType);

export default RouterContext;
