import { posix, sep } from "node:path";
export function normalizePath(path) {
    return path.replaceAll(sep, posix.sep);
}
