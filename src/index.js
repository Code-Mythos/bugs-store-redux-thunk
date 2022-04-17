import configureStore from "./store/configureStore";
import {
  bugAdded,
  bugRemoved,
  bugResolved,
  getUnResolvedBugs,
} from "./store/bugs";
import { projectAdded } from "./store/projects";

const store = configureStore();

const unSubscribe = store.subscribe(() => {
  console.log("Store changed!", store.getState());
});

store.dispatch(projectAdded({ name: "Project 1" }));

store.dispatch(bugAdded({ description: "Bug 1" }));
store.dispatch(bugAdded({ description: "Bug 2" }));
store.dispatch(bugAdded({ description: "Bug 3" }));

unSubscribe();

store.dispatch(bugResolved({ id: 1 }));

console.log("State of the store:", store.getState());

const x = getUnResolvedBugs(store.getState());
const y = getUnResolvedBugs(store.getState());
console.log("Unresolved bugs X:", x);
console.log("Unresolved bugs Y:", y);
console.log("Are X and Y the same?", x === y);
