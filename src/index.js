import configureStore from "./store/configureStore";
import * as actions from "./store/bugs";

const store = configureStore();

const unSubscribe = store.subscribe(() => {
  console.log("Store changed!", store.getState());
});

store.dispatch(actions.bugAdded({ description: "Bug 1" }));
store.dispatch(actions.bugAdded({ description: "Bug 2" }));
store.dispatch(actions.bugAdded({ description: "Bug 3" }));

unSubscribe();

store.dispatch(actions.bugResolved({ id: 1 }));

console.log(store.getState());
