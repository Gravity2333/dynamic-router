export declare enum Action {
    POP = "POP",
    PUSH = "PUSH",
    REPLACE = "REPLACE"
}
export type Pathname = string;
export type Search = string;
export type Hash = string;
export type Key = string | number;
export type State = any;
export interface Path {
    pathname: Pathname;
    search: Search;
    hash: Hash;
}
export type PartialPath = Partial<Path>;
export type To = string | PartialPath;
export interface Location extends Path {
    state: any;
    key: Key;
}
export type Update = {
    action: Action;
    location: Location;
};
export interface Transition extends Update {
    retry: () => void;
}
export type Listener = (updates: Update) => void;
export type Blocker = (transition: Transition) => void;
export interface History {
    action: Action;
    location: Location;
    createHref: (to: To) => string;
    push: (to: To, state?: State) => void;
    replace: (to: To, state?: State) => void;
    go: (delta: number) => void;
    forward: () => void;
    goBack: () => void;
    listen: (listener: Listener) => () => void;
    block: (blocker: Blocker) => () => void;
    basename?: string;
}
export declare function createBrowserHistory({ window, basename, }?: {
    window?: Window;
    basename?: string;
}): History;
export declare function createHashHistory({ window, basename, }?: {
    window?: Window;
    basename?: string;
}): History;
