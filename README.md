# useSyncExternalStore example

Ever wanted to do everything via events, but not wanted to deal with useEffect and the problems around it, or the boilerplate around it?

Enter `useSyncExternalStore`.

It'll also force you to have memoized deterministic state also, you can't return a random object every time for the snapshot of the store.
