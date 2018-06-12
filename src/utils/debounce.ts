
/**
 * For a keystroke handler.
 * 
 * Guarantees an interval of minIntervalMS between each execution of fn. Multiple consecutive calls are
 * reduced to a single call. The last call is guaranteed to get the last arguments passed to the debounced
 * function, but arguments of intermediary calls may be lost.
 */
export default function debounce(minIntervalMS: number, fn: (...args: any[]) => void) {
    let last = 0;
    let pending = false;
    let pendingArgs: IArguments;
    function play() {
        const now = Date.now();
        const delta = now - last;

        // The last time the function ended was too recent (or we raced with a scheduled run)
        if (delta < minIntervalMS || pending) {
            // Save the arguments for later
            pendingArgs = arguments;
            // Schedule a re-run if necessary
            if (pending === false) {
                setTimeout(() => {
                    pending = false;
                    play.apply(this, pendingArgs);
                }, minIntervalMS - delta);
                pending = true;
            }
        }
        else {
            fn.apply(this, arguments);
            last = Date.now();
        }
    }
    return play;
}
