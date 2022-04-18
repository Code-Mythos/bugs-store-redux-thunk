import configureStore from "./store/configureStore";
import { loadBugs } from "./store/bugs";
import * as apiActions from "./store/api";
import { bugsResieved } from "./store/bugs";

const store = configureStore();

// store.dispatch(
//   apiActions.apiCallBegan({
//     url: "/bugs",
//     onSuccess: bugsResieved.type,
//     // onError: apiActions.apiCallFailed.type, // Best to be implemented inside the api middleware
//   })
// );

store.dispatch(loadBugs());
