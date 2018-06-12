
export function notNull<T>(opt: T | null): T {
    if (opt == null) {
        throw new Error('Assertion failed: object is null!');
    }
    return opt;
}
