import store from "./store";
import { bugAdded, bugRemoved, bugResolved } from "./action";

const unSubscribe = store.subscribe(() => {
  console.log("Store changed!", store.getState());
});

store.dispatch(bugAdded("Bug 1"));

unSubscribe();

store.dispatch(bugResolved(1));

console.log(store.getState());
