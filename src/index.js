import configureStore from "./store/configureStore";
import {
  bugAdded,
  bugRemoved,
  bugResolved,
  bugAssignedToUser,
  getUnResolvedBugs,
  getBugsByUser,
} from "./store/bugs";
import { projectAdded } from "./store/projects";
import { userAdded } from "./store/users";

const store = configureStore();

// const unSubscribe = store.subscribe(() => {
//   console.log("Store changed!", store.getState());
// });

store.dispatch(userAdded({ name: "User 1" }));
store.dispatch(userAdded({ name: "User 2" }));

store.dispatch(projectAdded({ name: "Project 1" }));

store.dispatch(bugAdded({ description: "Bug 1" }));
store.dispatch(bugAdded({ description: "Bug 2" }));
store.dispatch(bugAdded({ description: "Bug 3" }));

store.dispatch(bugAssignedToUser({ bugId: 1, userId: 1 }));

// unSubscribe();

store.dispatch(bugResolved({ id: 1 }));

console.log("State of the store:", store.getState());

const unResolvedBugs = getUnResolvedBugs(store.getState());
console.log("Unresolved bugs:", unResolvedBugs);

const bugsByUser = getBugsByUser({ userId: 1 })(store.getState());
console.log("Bugs assigned to user 1:", bugsByUser);
