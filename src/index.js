import configureStore from "./store/configureStore";
import { loadBugs, assignBugToUser } from "./store/bugs";

const store = configureStore();

store.dispatch(loadBugs());

setTimeout(() => {
  store.dispatch(assignBugToUser({ bugId: 1, userId: 4 }));
}, 2000);
