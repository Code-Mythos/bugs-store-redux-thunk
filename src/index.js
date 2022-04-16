import store from "./store/store";
import * as actions from "./store/action";

const unSubscribe = store.subscribe(() => {
  console.log("Store changed!", store.getState());
});

store.dispatch(actions.bugAdded("Bug 1"));

unSubscribe();

store.dispatch(actions.bugResolved(1));

console.log(store.getState());
