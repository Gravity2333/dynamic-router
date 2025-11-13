import { Match } from '../typings';
export declare function matchPath(path: string, pathname: string, options?: {
    sensitive?: boolean;
    exact?: boolean;
    basename?: string;
}): Match | null;
